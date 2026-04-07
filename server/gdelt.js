'use strict';

const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');
const path = require('path');
const { enrichEvents } = require('./enrich');

const GDELT_QUERY = `
SELECT
  CAST(GlobalEventID AS STRING)     AS id,
  CAST(SQLDATE AS STRING)           AS date,
  DATEADDED                         AS date_added,
  IFNULL(ActionGeo_FullName, '')    AS location,
  IFNULL(ActionGeo_CountryCode, '') AS country_code,
  IFNULL(Actor1Name, '')            AS actor1,
  IFNULL(Actor2Name, '')            AS actor2,
  IFNULL(EventCode, '')             AS event_code,
  IFNULL(EventRootCode, '')         AS root_code,
  GoldsteinScale                    AS goldstein,
  NumMentions                       AS num_mentions,
  NumSources                        AS num_sources,
  NumArticles                       AS num_articles,
  AvgTone                           AS avg_tone,
  CAST(ActionGeo_Type AS STRING)    AS geo_type,
  ActionGeo_Lat                     AS latitude,
  ActionGeo_Long                    AS longitude,
  SOURCEURL                         AS source_url
FROM \`gdelt-bq.gdeltv2.events\`
WHERE
  DATEADDED >= CAST(FORMAT_DATETIME('%Y%m%d%H%M%S',
    DATETIME_SUB(CURRENT_DATETIME(), INTERVAL 48 HOUR)) AS INT64)
  AND ActionGeo_Lat IS NOT NULL
  AND ActionGeo_Long IS NOT NULL
  AND ActionGeo_Lat != 0
  AND ActionGeo_Long != 0
  AND SOURCEURL IS NOT NULL
  AND LOWER(SOURCEURL) LIKE ANY (
    '%space%', '%satellite%', '%rocket%', '%launch%', '%missile%',
    '%nasa%', '%esa%', '%roscosmos%', '%spacex%', '%orbit%',
    '%ballistic%', '%icbm%', '%hypersonic%', '%reentry%'
  )
ORDER BY NumMentions DESC
LIMIT 2000
`;

// Timeout wrapper — rejects after ms milliseconds
function withTimeout(promise, ms, label) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    promise.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); }
    );
  });
}

function getCacheFile(cacheDir) {
  const today = new Date().toISOString().slice(0, 10);
  return path.join(cacheDir, `gdelt-${today}.json`);
}

function loadCache(cacheDir) {
  const file = getCacheFile(cacheDir);
  if (fs.existsSync(file)) {
    try {
      const raw = fs.readFileSync(file, 'utf8');
      const parsed = JSON.parse(raw);
      console.log(`[gdelt] Cache hit: ${parsed.length} events from ${file}`);
      return parsed;
    } catch (_) {}
  }
  return null;
}

function saveCache(cacheDir, data) {
  const file = getCacheFile(cacheDir);
  fs.writeFileSync(file, JSON.stringify(data), 'utf8');
  console.log(`[gdelt] Cache saved: ${data.length} events → ${file}`);
}

function createBigQueryClient() {
  const credsJson = process.env.GOOGLE_CREDENTIALS_JSON;
  if (!credsJson) throw new Error('GOOGLE_CREDENTIALS_JSON env var not set');

  let credentials;
  try {
    credentials = JSON.parse(credsJson);
  } catch (e) {
    throw new Error('GOOGLE_CREDENTIALS_JSON is not valid JSON');
  }

  console.log(`[gdelt] BigQuery client — project: ${credentials.project_id}`);
  return new BigQuery({ credentials, projectId: credentials.project_id });
}

async function runBigQuery() {
  const bq = createBigQueryClient();

  console.log('[gdelt] Creating BigQuery job...');
  const [job] = await withTimeout(
    bq.createQueryJob({ query: GDELT_QUERY, location: 'US' }),
    60000,
    'BigQuery createQueryJob'
  );
  console.log(`[gdelt] Job created: ${job.id} — waiting for results...`);

  const [rows] = await withTimeout(
    job.getQueryResults({ timeoutMs: 120000 }),
    150000,
    'BigQuery getQueryResults'
  );
  console.log(`[gdelt] Raw rows received: ${rows.length}`);

  return rows.map((r) => ({
    id: r.id,
    date: r.date,
    date_added: r.date_added ? String(r.date_added) : null,
    location: r.location,
    country_code: r.country_code,
    actor1: r.actor1,
    actor2: r.actor2,
    event_code: r.event_code,
    root_code: r.root_code,
    goldstein: r.goldstein,
    num_mentions: r.num_mentions,
    num_sources: r.num_sources,
    num_articles: r.num_articles,
    avg_tone: r.avg_tone,
    geo_type: r.geo_type,
    latitude: r.latitude,
    longitude: r.longitude,
    source_url: r.source_url,
  }));
}

async function fetchGdeltEvents(cacheDir, forceRefresh = false) {
  // Try cache first
  if (!forceRefresh) {
    const cached = loadCache(cacheDir);
    if (cached) return cached;
  }

  // Check if BigQuery is configured
  if (!process.env.GOOGLE_CREDENTIALS_JSON) {
    console.warn('[gdelt] No GOOGLE_CREDENTIALS_JSON — skipping BigQuery fetch');
    return [];
  }

  console.log('[gdelt] Starting BigQuery fetch pipeline...');
  let rawEvents;
  // Retry up to 3 times with exponential backoff (BigQuery jobs can fail transiently)
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      rawEvents = await runBigQuery();
      break; // success
    } catch (err) {
      console.error(`[gdelt] BigQuery attempt ${attempt}/3 FAILED: ${err.message}`);
      if (attempt < 3) {
        const delay = attempt * 15000; // 15s, 30s
        console.log(`[gdelt] Retrying in ${delay / 1000}s...`);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        console.error('[gdelt] All BigQuery attempts failed — no events this cycle');
        return [];
      }
    }
  }

  if (!rawEvents || rawEvents.length === 0) {
    console.warn('[gdelt] BigQuery returned 0 rows — check credentials/query');
    return [];
  }

  // Cap to top 300 by mentions before enrichment
  const toEnrich = rawEvents.slice(0, 300);
  console.log(`[gdelt] Enriching top ${toEnrich.length}/${rawEvents.length} events via OpenAI...`);

  let enriched;
  try {
    enriched = await withTimeout(
      enrichEvents(toEnrich),
      300000, // 5 min max for enrichment
      'OpenAI enrichment'
    );
  } catch (err) {
    console.error('[gdelt] Enrichment FAILED:', err.message);
    // Return raw events without enrichment rather than nothing
    enriched = toEnrich.map((e) => ({
      ...e,
      title_fr: e.location || 'Événement spatial',
      title_en: e.location || 'Space event',
      relevance: 65,
      inferred_location: e.location || '',
    }));
  }

  console.log(`[gdelt] Final: ${enriched.length} events ready`);
  saveCache(cacheDir, enriched);
  return enriched;
}

module.exports = { fetchGdeltEvents };

'use strict';

const OpenAI = require('openai');
const axios = require('axios');

const OPENAI_KEY = process.env.OPENAI_API_KEY || '';
const BATCH_SIZE = 10;          // smaller batches = faster + less timeout risk
const BATCH_TIMEOUT_MS = 25000; // 25s max per batch
const GEOCODE_TIMEOUT_MS = 6000;

// ── Geocode ───────────────────────────────────────────────────────────────────
async function geocode(locationStr) {
  if (!locationStr) return null;
  try {
    const res = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: locationStr, format: 'json', limit: 1 },
      headers: { 'User-Agent': 'SpaceMonitor/1.0' },
      timeout: GEOCODE_TIMEOUT_MS,
    });
    if (res.data && res.data.length > 0) {
      return { lat: parseFloat(res.data[0].lat), lon: parseFloat(res.data[0].lon), display: res.data[0].display_name };
    }
  } catch (_) {}
  return null;
}

// ── OpenAI single batch with timeout ─────────────────────────────────────────
async function enrichBatchWithTimeout(client, events, batchIndex, total) {
  const prompt = `You are a space/defense analyst. For each GDELT event below:
1. Score relevance to space/military space 0-100
2. French title ≤12 words
3. English title ≤15 words
4. Best location guess (city, country)

Reply ONLY with a JSON array (no wrapper object):
[{"id":"...","title_fr":"...","title_en":"...","relevance":0-100,"inferred_location":"..."}]

Events:
${JSON.stringify(events.map((e) => ({
  id: e.id,
  url: e.source_url?.substring(0, 120),
  actor1: e.actor1,
  actor2: e.actor2,
  location: e.location,
  country: e.country_code,
  goldstein: e.goldstein,
  mentions: e.num_mentions,
})))}`;

  const batchPromise = client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    max_tokens: 1500,
  });

  // Race against timeout
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Batch ${batchIndex} timed out`)), BATCH_TIMEOUT_MS)
  );

  const completion = await Promise.race([batchPromise, timeoutPromise]);
  const content = completion.choices[0]?.message?.content || '[]';

  // Extract JSON array (handle markdown code blocks)
  const match = content.match(/\[[\s\S]*\]/);
  if (!match) return [];

  try {
    return JSON.parse(match[0]);
  } catch (_) {
    return [];
  }
}

// ── Main enrichment pipeline ──────────────────────────────────────────────────
async function enrichBatch(events) {
  if (!OPENAI_KEY) {
    console.warn('[enrich] No OPENAI_API_KEY — returning events as-is');
    return events.map((e) => ({
      ...e,
      title_fr: e.location || 'Événement spatial',
      title_en: e.location || 'Space event',
      relevance: 70,
      inferred_location: e.location || '',
    }));
  }

  const client = new OpenAI({ apiKey: OPENAI_KEY });
  const enriched = [];
  const totalBatches = Math.ceil(events.length / BATCH_SIZE);

  for (let i = 0; i < events.length; i += BATCH_SIZE) {
    const batch = events.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    console.log(`[enrich] Batch ${batchNum}/${totalBatches} (${batch.length} events)...`);

    let results = [];
    try {
      results = await enrichBatchWithTimeout(client, batch, batchNum, totalBatches);
    } catch (err) {
      console.warn(`[enrich] Batch ${batchNum} failed: ${err.message} — using fallback`);
    }

    for (const ev of batch) {
      const r = results.find((x) => String(x.id) === String(ev.id));
      enriched.push({
        ...ev,
        title_fr: r?.title_fr || ev.location || 'Événement spatial',
        title_en: r?.title_en || ev.location || 'Space event',
        relevance: r?.relevance ?? 65,
        inferred_location: r?.inferred_location || ev.location || '',
      });
    }

    // Brief pause between batches to avoid rate limits
    if (i + BATCH_SIZE < events.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  return enriched;
}

// ── Full pipeline: enrich + filter + geocode ──────────────────────────────────
async function enrichEvents(rawEvents) {
  console.log(`[enrich] Starting enrichment for ${rawEvents.length} events...`);
  const enriched = await enrichBatch(rawEvents);

  const relevant = enriched.filter((e) => e.relevance >= 60);
  console.log(`[enrich] ${relevant.length}/${enriched.length} events passed relevance ≥60`);

  // Geocode only events where inferred_location differs or coords are missing
  let geocoded = 0;
  const result = await Promise.all(
    relevant.map(async (e) => {
      if (e.latitude && e.longitude && e.latitude !== 0 && e.longitude !== 0) {
        if (e.inferred_location && e.inferred_location !== e.location) {
          const geo = await geocode(e.inferred_location);
          if (geo) { geocoded++; return { ...e, latitude: geo.lat, longitude: geo.lon, location_display: geo.display }; }
        }
        return e;
      }
      const loc = e.inferred_location || e.location;
      if (loc) {
        const geo = await geocode(loc);
        if (geo) { geocoded++; return { ...e, latitude: geo.lat, longitude: geo.lon, location_display: geo.display }; }
      }
      return null;
    })
  );

  const final = result.filter(Boolean);
  console.log(`[enrich] Done — ${final.length} events with coords (${geocoded} geocoded)`);
  return final;
}

module.exports = { enrichEvents, geocode };

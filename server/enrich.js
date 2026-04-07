'use strict';

const OpenAI = require('openai');
const axios = require('axios');

const OPENAI_KEY = process.env.OPENAI_API_KEY || process.env.chatgpt || '';
const BATCH_SIZE = 20;          // 20 events/batch = 15 batches instead of 30
const BATCH_TIMEOUT_MS = 45000; // 45s max per batch (more events = more output)
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
async function enrichBatchWithTimeout(client, events, batchIndex) {
  const prompt = `You are a **space and defense intelligence analyst** working for a real-time **space monitoring dashboard**.

Your job is to evaluate incoming GDELT events and decide whether each event is relevant for a **space-focused OSINT system**.

The dashboard is not a generic military dashboard.
It is specifically focused on:

* space operations
* launches
* satellites
* reentries
* orbital events
* space debris
* space weather
* military space activity
* anti-satellite capabilities
* satellite communications for defense
* strategic space partnerships
* major space industry developments

## Core rule

Do **not** keep an event just because it is military, aerospace, missile-related, or contains the word "space".

Only keep events that are:

1. clearly related to the space domain,
2. or strategically important to space capabilities,
3. or important contextual developments for the global space sector.

## Relevance scale

### 85–100 = Direct space event

Keep with very high priority.

Examples:

* rocket launch
* satellite launch
* satellite maneuver
* uncontrolled reentry
* orbital debris event
* fragmentation event
* ISS event
* space weather event affecting operations
* ASAT test
* GPS/GNSS jamming with clear space-system relevance
* military satellite deployment
* major space mission operations

### 60–84 = Significant space-related strategic event

Keep.

Examples:

* military space program announcements
* defense satellite communications developments
* anti-satellite capability development
* government space budget decisions
* strategic agency or industry partnerships directly tied to space systems
* creation of new space units, commands, or ground stations
* major procurement of satellite or launch capabilities

### 30–59 = Marginal or indirect space relevance

Usually reject unless unusually strategic.

Examples:

* general aerospace news
* vague dual-use technology
* generic missile or hypersonic stories without explicit space relevance
* broad defense modernization with no clear satellite or orbital link
* corporate news with weak operational relevance

### 0–29 = Not relevant to the space dashboard

Reject.

Examples:

* military news unrelated to space
* "space" used in a non-space meaning
* aviation only
* science news with no operational or strategic space relevance
* general politics with no clear space capability impact

## Important anti-noise rules

Reject events if they are primarily about:

* aviation only
* general military conflict with no space dimension
* ballistic missiles / ICBMs / hypersonic systems unless the article clearly connects them to:

  * space-based detection,
  * space infrastructure,
  * ASAT,
  * orbital systems,
  * satellite navigation / GNSS,
  * missile warning architecture
* corporate PR with no strategic or operational significance
* routine speeches unless they materially affect space programs or space capabilities

## Classification task

For each event return a JSON object with:

* id: the event id (string, unchanged)
* keep: true or false
* relevance: integer 0-100
* space_category: one of launch | satellite | reentry | debris | space_weather | military_space | asat | gnss_interference | partnership | industry | policy | context | reject
* display_mode: one of map | wire | both | reject
* short_reason: one short sentence explaining the decision
* title_fr: concise French title if keep=true, else null
* headline_en: short English headline if keep=true, else null
* inferred_location: best city/country guess if keep=true and display_mode includes map, else null

## Display logic

* map = only for concrete spatial or geolocatable operational events
* wire = for strategic or contextual space events that matter but are not map-worthy
* both = for very important events that are both strategic and operational
* reject = ignore

Use all input fields, but prioritize semantic relevance over raw sentiment or volume.
Do not overvalue media attention alone.
Be conservative: false positives are worse than false negatives.

Reply ONLY with a JSON array (no markdown, no wrapper object):
[{"id":"...","keep":true,"relevance":85,"space_category":"launch","display_mode":"map","short_reason":"...","title_fr":"...","headline_en":"...","inferred_location":"city, country"}]

Events to analyze:
${JSON.stringify(events.map((e) => ({
  id: e.id,
  url: e.source_url?.substring(0, 150),
  actor1: e.actor1 || null,
  actor2: e.actor2 || null,
  location: e.location || null,
  country: e.country_code || null,
  event_code: e.event_code || null,
  root_code: e.root_code || null,
  goldstein: e.goldstein,
  avg_tone: e.avg_tone,
  mentions: e.num_mentions,
  sources: e.num_sources,
})))}`;

  const batchPromise = client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.1,
    max_tokens: 4000,
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
    console.warn('[enrich] No OPENAI_API_KEY — returning empty (cannot score relevance without OpenAI)');
    return [];
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
      results = await enrichBatchWithTimeout(client, batch, batchNum);
    } catch (err) {
      console.warn(`[enrich] Batch ${batchNum} failed: ${err.message} — skipping batch`);
    }

    for (const ev of batch) {
      const r = results.find((x) => String(x.id) === String(ev.id));
      if (!r) continue; // skip if batch failed entirely

      enriched.push({
        ...ev,
        keep:             r.keep === true,
        relevance:        r.relevance ?? 0,
        space_category:   r.space_category || 'reject',
        display_mode:     r.display_mode || 'reject',
        short_reason:     r.short_reason || '',
        title_fr:         r.title_fr || null,
        title_en:         r.headline_en || null,  // normalise to title_en for frontend
        inferred_location: r.inferred_location || ev.location || '',
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

  // Filter: keep only events GPT marked as relevant
  const relevant = enriched.filter((e) => e.keep === true && e.display_mode !== 'reject');
  console.log(`[enrich] ${relevant.length}/${enriched.length} events kept by GPT`);

  // Only geocode events intended for the map
  let geocoded = 0;
  const result = await Promise.all(
    relevant.map(async (e) => {
      // Wire-only events don't need coords
      if (e.display_mode === 'wire') return e;

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
      // map/both events with no coords are dropped
      return null;
    })
  );

  const final = result.filter(Boolean);
  console.log(`[enrich] Done — ${final.length} events ready (${geocoded} geocoded)`);
  return final;
}

module.exports = { enrichEvents, geocode };

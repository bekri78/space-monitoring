'use strict';

const OpenAI = require('openai');
const axios = require('axios');

const OPENAI_KEY = process.env.OPENAI_API_KEY || '';

// Geocode a location string via Nominatim OSM
async function geocode(locationStr) {
  if (!locationStr) return null;
  try {
    const res = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: locationStr, format: 'json', limit: 1 },
      headers: { 'User-Agent': 'SpaceMonitor/1.0 (contact@space-monitor.io)' },
      timeout: 8000,
    });
    if (res.data && res.data.length > 0) {
      return {
        lat: parseFloat(res.data[0].lat),
        lon: parseFloat(res.data[0].lon),
        display: res.data[0].display_name,
      };
    }
  } catch (_) {}
  return null;
}

// Batch enrich events via OpenAI GPT-4o-mini
async function enrichBatch(events) {
  if (!OPENAI_KEY) {
    console.warn('[enrich] No OPENAI_API_KEY — skipping enrichment, returning all events as-is');
    return events.map((e) => ({
      ...e,
      title_fr: e.actor1 ? `Événement spatial: ${e.actor1}` : 'Événement spatial',
      title_en: e.actor1 ? `Space event: ${e.actor1}` : 'Space event',
      relevance: 70,
      inferred_location: e.location || '',
    }));
  }

  const client = new OpenAI({ apiKey: OPENAI_KEY });

  // Process in batches of 20
  const BATCH_SIZE = 20;
  const enriched = [];

  for (let i = 0; i < events.length; i += BATCH_SIZE) {
    const batch = events.slice(i, i + BATCH_SIZE);
    const prompt = `Tu es un expert en événements spatiaux et défense spatiale.
Pour chaque événement GDELT ci-dessous, tu dois:
1. Décider s'il est vraiment lié au spatial / défense spatiale / programmes spatiaux (score de pertinence 0-100)
2. Générer un titre court en FRANÇAIS (≤12 mots)
3. Générer un titre court en ANGLAIS (≤15 mots)
4. Inférer la vraie localisation géographique (ville, pays) si possible

Réponds en JSON array avec ce format exact:
[{"id": "...", "title_fr": "...", "title_en": "...", "relevance": 0-100, "inferred_location": "..."}]

Événements:
${JSON.stringify(batch.map((e) => ({
  id: e.id,
  url: e.source_url,
  actor1: e.actor1,
  actor2: e.actor2,
  location: e.location,
  country: e.country_code,
  event_code: e.event_code,
  goldstein: e.goldstein,
  mentions: e.num_mentions,
})))}`;

    try {
      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0]?.message?.content || '{}';
      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch (_) {
        parsed = {};
      }

      // Handle both array and {results: [...]} formats
      const results = Array.isArray(parsed) ? parsed : (parsed.results || parsed.events || []);

      for (const ev of batch) {
        const enrichment = results.find((r) => String(r.id) === String(ev.id));
        enriched.push({
          ...ev,
          title_fr: enrichment?.title_fr || ev.location || 'Événement spatial',
          title_en: enrichment?.title_en || ev.location || 'Space event',
          relevance: enrichment?.relevance ?? 70,
          inferred_location: enrichment?.inferred_location || ev.location || '',
        });
      }
    } catch (err) {
      console.error('[enrich] OpenAI batch error:', err.message);
      // fallback — add events without enrichment
      for (const ev of batch) {
        enriched.push({
          ...ev,
          title_fr: ev.location || 'Événement spatial',
          title_en: ev.location || 'Space event',
          relevance: 65,
          inferred_location: ev.location || '',
        });
      }
    }

    // Rate limit pause between batches
    if (i + BATCH_SIZE < events.length) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  return enriched;
}

// Full pipeline: enrich + geocode corrected locations + filter by relevance
async function enrichEvents(rawEvents) {
  console.log(`[enrich] Enriching ${rawEvents.length} events via OpenAI...`);
  const enriched = await enrichBatch(rawEvents);

  // Filter by relevance >= 60
  const relevant = enriched.filter((e) => e.relevance >= 60);
  console.log(`[enrich] ${relevant.length}/${enriched.length} events passed relevance threshold`);

  // Geocode events where inferred_location differs from original lat/lon
  const geocoded = await Promise.all(
    relevant.map(async (e) => {
      // If event already has valid coordinates, keep them
      if (e.latitude && e.longitude && e.latitude !== 0 && e.longitude !== 0) {
        // But if we have a better inferred location, try to geocode it
        if (e.inferred_location && e.inferred_location !== e.location) {
          const geo = await geocode(e.inferred_location);
          if (geo) {
            return { ...e, latitude: geo.lat, longitude: geo.lon, location_display: geo.display };
          }
        }
        return e;
      }

      // No coordinates — try to geocode
      const loc = e.inferred_location || e.location;
      if (loc) {
        const geo = await geocode(loc);
        if (geo) {
          return { ...e, latitude: geo.lat, longitude: geo.lon, location_display: geo.display };
        }
      }
      return null; // drop if no coords
    })
  );

  return geocoded.filter(Boolean);
}

module.exports = { enrichEvents, geocode };

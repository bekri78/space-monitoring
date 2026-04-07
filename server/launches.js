'use strict';

const axios = require('axios');

const LL2_BASE = 'https://ll.thespacedevs.com/2.2.0';

async function fetchPage(url) {
  const res = await axios.get(url, {
    headers: { 'User-Agent': 'SpaceMonitor/1.0' },
    timeout: 30000,
  });
  return res.data;
}

async function fetchAllPages(url) {
  let results = [];
  let next = url;
  while (next) {
    const data = await fetchPage(next);
    results = results.concat(data.results || []);
    next = data.next || null;
    if (results.length > 200) break; // safety cap
  }
  return results;
}

function normalizeLaunch(l) {
  const pad = l.pad || {};
  const mission = l.mission || {};
  const rocket = l.rocket || {};
  const agency = l.launch_service_provider || {};

  return {
    id: l.id,
    name: l.name,
    status: {
      id: l.status?.id,
      name: l.status?.name,
      abbrev: l.status?.abbrev,
    },
    net: l.net,              // NET launch time ISO string
    window_start: l.window_start,
    window_end: l.window_end,
    image: l.image || null,
    pad: {
      name: pad.name,
      location: pad.location?.name,
      lat: parseFloat(pad.latitude) || null,
      lon: parseFloat(pad.longitude) || null,
      map_url: pad.map_url || null,
    },
    mission: {
      name: mission.name || null,
      description: mission.description || null,
      orbit: mission.orbit?.name || null,
      type: mission.type || null,
    },
    rocket: {
      name: rocket.configuration?.name || null,
      family: rocket.configuration?.family || null,
    },
    agency: {
      name: agency.name || null,
      abbrev: agency.abbrev || null,
      country: agency.country_code || null,
      type: agency.type || null,
    },
    probability: l.probability || null,
    holdreason: l.holdreason || null,
    failreason: l.failreason || null,
  };
}

async function fetchLaunches() {
  const now = new Date();
  const in30d = new Date(now.getTime() + 30 * 24 * 3600 * 1000).toISOString();
  const minus7d = new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString();

  // Upcoming launches (next 30 days)
  const upcomingUrl = `${LL2_BASE}/launch/upcoming/?limit=100&net__lte=${in30d}&ordering=net&mode=detailed`;
  // Previous launches (last 7 days)
  const previousUrl = `${LL2_BASE}/launch/previous/?limit=50&net__gte=${minus7d}&ordering=-net&mode=detailed`;

  const [upcomingRaw, previousRaw] = await Promise.all([
    fetchAllPages(upcomingUrl),
    fetchAllPages(previousUrl),
  ]);

  const upcoming = upcomingRaw.map(normalizeLaunch);
  const previous = previousRaw.map(normalizeLaunch);

  // Build unique pads list (from upcoming only)
  const padMap = new Map();
  for (const l of upcoming) {
    if (l.pad.lat && l.pad.lon) {
      const key = `${l.pad.lat},${l.pad.lon}`;
      if (!padMap.has(key)) {
        padMap.set(key, {
          key,
          name: l.pad.name,
          location: l.pad.location,
          lat: l.pad.lat,
          lon: l.pad.lon,
          launches: [],
        });
      }
      padMap.get(key).launches.push(l.id);
    }
  }

  return {
    upcoming,
    previous,
    pads: Array.from(padMap.values()),
    fetchedAt: new Date().toISOString(),
  };
}

module.exports = { fetchLaunches };

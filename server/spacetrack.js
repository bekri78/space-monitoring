'use strict';

const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

const BASE = 'https://www.space-track.org';
const LOGIN = process.env.SPACETRACK_LOGIN || '';
const PASSWORD = process.env.SPACETRACK_PASSWORD || '';

function createClient() {
  const jar = new CookieJar();
  const client = wrapper(axios.create({ jar, withCredentials: true, timeout: 60000 }));
  return client;
}

async function login(client) {
  await client.post(`${BASE}/ajaxauth/login`, `identity=${encodeURIComponent(LOGIN)}&password=${encodeURIComponent(PASSWORD)}`, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

function parseDate(str) {
  if (!str) return null;
  return new Date(str).toISOString();
}

// ── DECAY ─────────────────────────────────────────────────────────────────────
// Objects with imminent atmospheric re-entry (window J-1 to J+30)
async function fetchDecay() {
  if (!LOGIN || !PASSWORD) {
    console.warn('[spacetrack] No credentials — skipping DECAY fetch');
    return [];
  }

  const client = createClient();
  await login(client);

  const now = new Date();
  const minus1d = new Date(now.getTime() - 24 * 3600 * 1000).toISOString().slice(0, 10);
  const plus30d = new Date(now.getTime() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10);

  const url = `${BASE}/basicspacedata/query/class/decay/DECAY_EPOCH/${minus1d}--${plus30d}/orderby/DECAY_EPOCH asc/format/json`;

  const res = await client.get(url);
  const raw = res.data || [];

  return raw.map((d) => ({
    id: d.NORAD_CAT_ID,
    name: d.OBJECT_NAME,
    norad: d.NORAD_CAT_ID,
    country: d.COUNTRY,
    inclination: parseFloat(d.INCLINATION) || null,
    apogee: parseFloat(d.APOGEE) || null,
    perigee: parseFloat(d.PERIGEE) || null,
    decayEpoch: parseDate(d.DECAY_EPOCH),
    // Space-Track DECAY does not give lat/lon — use a rough derived position
    // We'll assign a pseudo-random position offset from equator ± inclination for display
    lat: null,
    lon: null,
    source: 'DECAY',
  }));
}

// ── TIP ───────────────────────────────────────────────────────────────────────
// Tracking and Impact Prediction — precise TLE-based objects
async function fetchTip() {
  if (!LOGIN || !PASSWORD) {
    console.warn('[spacetrack] No credentials — skipping TIP fetch');
    return [];
  }

  const client = createClient();
  await login(client);

  const now = new Date();
  const minus1d = new Date(now.getTime() - 24 * 3600 * 1000).toISOString().slice(0, 10);
  const plus30d = new Date(now.getTime() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10);

  const url = `${BASE}/basicspacedata/query/class/tip/DECAY_EPOCH/${minus1d}--${plus30d}/orderby/DECAY_EPOCH asc/format/json`;

  const res = await client.get(url);
  const raw = res.data || [];

  return raw.map((d) => ({
    id: d.NORAD_CAT_ID,
    name: d.OBJECT_NAME || `Object ${d.NORAD_CAT_ID}`,
    norad: d.NORAD_CAT_ID,
    country: d.COUNTRY || null,
    inclination: parseFloat(d.INCLINATION) || null,
    apogee: parseFloat(d.APOGEE) || null,
    perigee: parseFloat(d.PERIGEE) || null,
    decayEpoch: parseDate(d.DECAY_EPOCH),
    altitude: parseFloat(d.ALTITUDE) || null,
    lat: parseFloat(d.LAT) || null,
    lon: parseFloat(d.LON) || null,
    source: 'TIP',
  }));
}

module.exports = { fetchDecay, fetchTip };

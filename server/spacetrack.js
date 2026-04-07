'use strict';

const axios = require('axios');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

const BASE = 'https://www.space-track.org';
const LOGIN = process.env.SPACETRACK_USER || process.env.SPACETRACK_LOGIN || '';
const PASSWORD = process.env.SPACETRACK_PASS || process.env.SPACETRACK_PASSWORD || '';

function createClient() {
  const jar = new CookieJar();
  return wrapper(axios.create({ jar, withCredentials: true, timeout: 60000 }));
}

async function login(client) {
  await client.post(
    `${BASE}/ajaxauth/login`,
    `identity=${encodeURIComponent(LOGIN)}&password=${encodeURIComponent(PASSWORD)}`,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
}

function parseDate(str) {
  if (!str) return null;
  return new Date(str).toISOString();
}

function pf(v) { const n = parseFloat(v); return isNaN(n) ? null : n; }

// ── Fetch orbital elements (GP class) for a list of NORAD IDs ────────────────
async function fetchOrbitalElements(client, noradIds) {
  if (!noradIds.length) return {};
  const ids = noradIds.slice(0, 100).join(','); // Space-Track limit
  const url = `${BASE}/basicspacedata/query/class/gp/NORAD_CAT_ID/${ids}/orderby/EPOCH desc/format/json`;
  try {
    const res = await client.get(url);
    const rows = res.data || [];
    const map = {};
    for (const r of rows) {
      const id = String(r.NORAD_CAT_ID);
      if (!map[id]) {
        map[id] = {
          inclination: pf(r.INCLINATION),
          apogee:      pf(r.APOGEE),
          perigee:     pf(r.PERIGEE),
          period:      pf(r.PERIOD),
          rcs:         r.RCS_SIZE || null,
          objectType:  r.OBJECT_TYPE || null,
        };
      }
    }
    return map;
  } catch (err) {
    console.warn('[spacetrack] GP fetch failed:', err.message);
    return {};
  }
}

// ── DECAY ─────────────────────────────────────────────────────────────────────
async function fetchDecay() {
  if (!LOGIN || !PASSWORD) {
    console.warn('[spacetrack] No credentials (SPACETRACK_USER/SPACETRACK_PASS) — skipping DECAY fetch');
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

  // Cross-reference orbital elements from GP
  const noradIds = raw.map((d) => String(d.NORAD_CAT_ID));
  const orbits = await fetchOrbitalElements(client, noradIds);

  return raw.map((d) => {
    const id = String(d.NORAD_CAT_ID);
    const orb = orbits[id] || {};
    return {
      id,
      name: d.OBJECT_NAME || `Object ${id}`,
      norad: id,
      country: d.COUNTRY || null,
      inclination: orb.inclination ?? null,
      apogee:      orb.apogee ?? null,
      perigee:     orb.perigee ?? null,
      period:      orb.period ?? null,
      objectType:  orb.objectType ?? null,
      rcs:         orb.rcs ?? null,
      decayEpoch:  parseDate(d.DECAY_EPOCH),
      msgEpoch:    parseDate(d.MSG_EPOCH),
      source:      d.SOURCE || null,
      lat: null,
      lon: null,
      sourceType: 'DECAY',
    };
  });
}

// ── TIP ───────────────────────────────────────────────────────────────────────
// TIP fields: NORAD_CAT_ID, OBJECT_NUMBER, MSG_EPOCH, DECAY_EPOCH,
//             WINDOW (±h), REV, DIRECTION, LAT, LON, INCL, HIGH_INTEREST
async function fetchTip() {
  if (!LOGIN || !PASSWORD) {
    console.warn('[spacetrack] No credentials (SPACETRACK_USER/SPACETRACK_PASS) — skipping TIP fetch');
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

  // Cross-reference orbital elements from GP
  const noradIds = raw.map((d) => String(d.NORAD_CAT_ID));
  const orbits = await fetchOrbitalElements(client, noradIds);

  return raw.map((d) => {
    const id = String(d.NORAD_CAT_ID);
    const orb = orbits[id] || {};
    return {
      id,
      name: d.OBJECT_NAME || `Object ${id}`,
      norad: id,
      country: null,
      inclination: pf(d.INCL) ?? orb.inclination ?? null,   // TIP has INCL directly
      apogee:      orb.apogee ?? null,
      perigee:     orb.perigee ?? null,
      period:      orb.period ?? null,
      objectType:  orb.objectType ?? null,
      rcs:         orb.rcs ?? null,
      decayEpoch:  parseDate(d.DECAY_EPOCH),
      msgEpoch:    parseDate(d.MSG_EPOCH),
      window:      pf(d.WINDOW),        // uncertainty window in hours ±
      highInterest: d.HIGH_INTEREST === 'Y',
      lat: pf(d.LAT),
      lon: pf(d.LON),
      sourceType: 'TIP',
    };
  });
}

module.exports = { fetchDecay, fetchTip };

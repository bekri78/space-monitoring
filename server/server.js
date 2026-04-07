'use strict';

const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');

const { fetchLaunches } = require('./launches');
const { fetchDecay, fetchTip } = require('./spacetrack');
const { fetchSpaceWeather } = require('./spaceweather');
const { fetchGdeltEvents } = require('./gdelt');

const app = express();
const PORT = process.env.PORT || 3001;
const CACHE_DIR = process.env.CACHE_DIR || path.join(__dirname, '.cache');

// Ensure cache dir exists
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

app.use(cors());
app.use(express.json());

// ── In-memory state ──────────────────────────────────────────────────────────
let state = {
  launches: null,
  decay: null,
  tip: null,
  spaceweather: null,
  events: null,
  lastUpdated: {
    launches: null,
    decay: null,
    tip: null,
    spaceweather: null,
    events: null,
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
async function safe(fn, label) {
  try {
    const result = await fn();
    console.log(`[${new Date().toISOString()}] ✓ ${label}`);
    return result;
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ✗ ${label}:`, err.message);
    return null;
  }
}

// ── Initial load ─────────────────────────────────────────────────────────────
async function init() {
  console.log('[INIT] Starting Space Monitor backend...');

  const [launches, decay, tip, sw, events] = await Promise.all([
    safe(() => fetchLaunches(), 'launches'),
    safe(() => fetchDecay(), 'decay'),
    safe(() => fetchTip(), 'tip'),
    safe(() => fetchSpaceWeather(), 'spaceweather'),
    safe(() => fetchGdeltEvents(CACHE_DIR), 'gdelt-events'),
  ]);

  if (launches) { state.launches = launches; state.lastUpdated.launches = new Date(); }
  if (decay)    { state.decay = decay;       state.lastUpdated.decay = new Date(); }
  if (tip)      { state.tip = tip;           state.lastUpdated.tip = new Date(); }
  if (sw)       { state.spaceweather = sw;   state.lastUpdated.spaceweather = new Date(); }
  if (events)   { state.events = events;     state.lastUpdated.events = new Date(); }

  console.log('[INIT] Done.');
}

// ── Cron jobs ─────────────────────────────────────────────────────────────────

// Launches: every 6h
cron.schedule('0 */6 * * *', async () => {
  const data = await safe(() => fetchLaunches(), 'launches-cron');
  if (data) { state.launches = data; state.lastUpdated.launches = new Date(); }
});

// Space Weather: every 15 min
cron.schedule('*/15 * * * *', async () => {
  const data = await safe(() => fetchSpaceWeather(), 'spaceweather-cron');
  if (data) { state.spaceweather = data; state.lastUpdated.spaceweather = new Date(); }
});

// DECAY: daily at 06:00 UTC
cron.schedule('0 6 * * *', async () => {
  const data = await safe(() => fetchDecay(), 'decay-cron');
  if (data) { state.decay = data; state.lastUpdated.decay = new Date(); }
});

// TIP: every 6h
cron.schedule('0 */6 * * *', async () => {
  const data = await safe(() => fetchTip(), 'tip-cron');
  if (data) { state.tip = data; state.lastUpdated.tip = new Date(); }
});

// GDELT: every 6h
cron.schedule('30 */6 * * *', async () => {
  const data = await safe(() => fetchGdeltEvents(CACHE_DIR), 'gdelt-cron');
  if (data) { state.events = data; state.lastUpdated.events = new Date(); }
});

// ── Routes ────────────────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    lastUpdated: state.lastUpdated,
    counts: {
      launches: state.launches?.upcoming?.length ?? 0,
      previous: state.launches?.previous?.length ?? 0,
      decay: state.decay?.length ?? 0,
      tip: state.tip?.length ?? 0,
      events: state.events?.length ?? 0,
    },
  });
});

app.get('/launches', (req, res) => {
  if (!state.launches) return res.status(503).json({ error: 'Data not ready yet' });
  res.json(state.launches);
});

app.get('/decay', (req, res) => {
  if (!state.decay) return res.status(503).json({ error: 'Data not ready yet' });
  res.json(state.decay);
});

app.get('/tip', (req, res) => {
  if (!state.tip) return res.status(503).json({ error: 'Data not ready yet' });
  res.json(state.tip);
});

app.get('/spaceweather', (req, res) => {
  if (!state.spaceweather) return res.status(503).json({ error: 'Data not ready yet' });
  res.json(state.spaceweather);
});

app.get('/events', (req, res) => {
  if (!state.events) return res.status(503).json({ error: 'Data not ready yet' });
  res.json(state.events);
});

app.post('/refresh', async (req, res) => {
  res.json({ message: 'Refresh started' });
  const data = await safe(() => fetchGdeltEvents(CACHE_DIR, true), 'gdelt-force-refresh');
  if (data) { state.events = data; state.lastUpdated.events = new Date(); }
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[SERVER] Listening on port ${PORT}`);
  init();
});

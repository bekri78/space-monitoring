'use strict';

const axios = require('axios');

const NOAA_BASE = 'https://services.swpc.noaa.gov';

async function get(path) {
  const res = await axios.get(`${NOAA_BASE}${path}`, { timeout: 15000 });
  return res.data;
}

async function fetchSpaceWeather() {
  const [kpHourly, kp3day, gScale, sScale, rScale, alerts] = await Promise.allSettled([
    get('/products/noaa-planetary-k-index.json'),
    get('/products/noaa-planetary-k-index-forecast.json'),
    get('/noaa/noaa-geomagnetic-storm-probability.json'),
    get('/products/noaa-scales.json'),
    get('/text/wwv.txt'),
    get('/products/alerts.json'),
  ]);

  // Current Kp — last value from hourly feed
  let kpCurrent = null;
  let kpTimestamp = null;
  if (kpHourly.status === 'fulfilled') {
    const rows = kpHourly.value;
    if (Array.isArray(rows) && rows.length > 1) {
      const last = rows[rows.length - 1];
      kpCurrent = parseFloat(last[1]) || null;
      kpTimestamp = last[0] || null;
    }
  }

  // NOAA Scales (G, S, R)
  let scales = { G: null, S: null, R: null };
  if (sScale.status === 'fulfilled' && sScale.value) {
    const data = sScale.value;
    // Format: { "DateStamp": "...", "TimeStamp": "...", "G": {...}, "S": {...}, "R": {...} }
    try {
      scales.G = { current: data?.G?.Scale || '0', text: data?.G?.Text || '' };
      scales.S = { current: data?.S?.Scale || '0', text: data?.S?.Text || '' };
      scales.R = { current: data?.R?.Scale || '0', text: data?.R?.Text || '' };
    } catch (_) {}
  }

  // Active NOAA alerts
  let activeAlerts = [];
  if (alerts.status === 'fulfilled' && Array.isArray(alerts.value)) {
    activeAlerts = alerts.value
      .filter((a) => a.productId && a.message)
      .slice(0, 20)
      .map((a) => ({
        id: a.productId,
        issued: a.issuanceTime || null,
        message: a.message?.substring(0, 500) || '',
        serialNumber: a.serialNumber || null,
      }));
  }

  // Kp forecast (next 3 days)
  let kpForecast = [];
  if (kp3day.status === 'fulfilled' && Array.isArray(kp3day.value)) {
    kpForecast = kp3day.value
      .slice(1) // skip header
      .slice(-24) // last 24 points
      .map((row) => ({ time: row[0], kp: parseFloat(row[1]) || 0 }));
  }

  return {
    kp: kpCurrent,
    kpTimestamp,
    kpForecast,
    scales,
    alerts: activeAlerts,
    fetchedAt: new Date().toISOString(),
  };
}

module.exports = { fetchSpaceWeather };

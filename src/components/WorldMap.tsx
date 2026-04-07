import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import type { LaunchesResponse, Launch, Pad } from '../types/launch';
import type { DecayObject } from '../types/decay';
import type { SpaceEvent } from '../types/event';
import { daysUntilDecay } from '../types/decay';
import { eventSeverity, severityColor } from '../types/event';

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ── FontAwesome icon helpers ───────────────────────────────────────────────────
function createRocketIcon(color: string, glow = false) {
  const shadow = glow ? `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 12px ${color})` : 'none';
  const html = `
    <div style="
      width:32px; height:32px;
      display:flex; align-items:center; justify-content:center;
      filter:${shadow};
    ">
      <i class="fa-solid fa-rocket"
        style="
          color:${color};
          font-size:22px;
          transform: rotate(-45deg);
          display:block;
        ">
      </i>
    </div>`;
  return L.divIcon({
    html,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

function createDecayIcon(color: string) {
  const html = `
    <div style="
      width:28px; height:28px;
      display:flex; align-items:center; justify-content:center;
      filter: drop-shadow(0 0 5px ${color});
    ">
      <i class="fa-solid fa-circle-radiation"
        style="color:${color}; font-size:20px;">
      </i>
    </div>`;
  return L.divIcon({
    html,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

function createTipIcon() {
  const html = `
    <div style="
      width:28px; height:28px;
      display:flex; align-items:center; justify-content:center;
      filter: drop-shadow(0 0 5px #aa44ff);
    ">
      <i class="fa-solid fa-satellite"
        style="color:#aa44ff; font-size:18px;">
      </i>
    </div>`;
  return L.divIcon({
    html,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

// ── Popup helpers ─────────────────────────────────────────────────────────────
const popupStyle = `
  font-family:'Share Tech Mono',monospace;
  background:#0a0e1a;
  color:#e0e8f0;
  border:1px solid #00d4ff44;
  border-radius:4px;
  padding:12px;
  min-width:240px;
  max-width:320px;
  font-size:12px;
  line-height:1.5;
`;

function countdown(netStr: string | null): string {
  if (!netStr) return 'TBD';
  const diff = new Date(netStr).getTime() - Date.now();
  if (diff < 0) return 'LAUNCHED';
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  if (d > 0) return `T-${d}d ${h}h ${m}m`;
  return `T-${h}h ${m}m ${s}s`;
}

function launchPopup(l: Launch): string {
  const statusColor = l.status.abbrev === 'GO' ? '#00d4ff'
    : l.status.abbrev === 'TBD' ? '#ffdd00'
    : l.status.abbrev === 'HOLD' ? '#ff8800'
    : l.status.abbrev === 'SUCCESS' ? '#00ff88'
    : l.status.abbrev === 'FAILURE' ? '#ff2244'
    : '#aaa';

  return `<div style="${popupStyle}">
    <div style="color:#00d4ff;font-weight:bold;font-size:13px;margin-bottom:6px">
      ${l.name}
    </div>
    ${l.image ? `<img src="${l.image}" style="width:100%;border-radius:3px;margin-bottom:8px;max-height:120px;object-fit:cover">` : ''}
    <div style="margin-bottom:4px">
      <span style="color:#888">STATUS: </span>
      <span style="color:${statusColor}">${l.status.abbrev || l.status.name || 'UNKNOWN'}</span>
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">COUNTDOWN: </span>
      <span style="color:#ffdd00">${countdown(l.net)}</span>
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">NET: </span>
      ${l.net ? new Date(l.net).toUTCString() : 'TBD'}
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">ROCKET: </span>${l.rocket.name || 'N/A'}
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">AGENCY: </span>${l.agency.name || 'N/A'} (${l.agency.country || '?'})
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">ORBIT: </span>${l.mission.orbit || 'N/A'}
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">TYPE: </span>${l.mission.type || 'N/A'}
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">PAD: </span>${l.pad.name || 'N/A'}
    </div>
    ${l.mission.description ? `<div style="margin-top:8px;color:#8ab;font-size:11px;border-top:1px solid #1a2a3a;padding-top:6px">${l.mission.description.substring(0, 200)}${l.mission.description.length > 200 ? '...' : ''}</div>` : ''}
  </div>`;
}

function padPopup(pad: Pad, upcoming: Launch[]): string {
  const padLaunches = upcoming.filter((l) => pad.launches.includes(l.id));
  return `<div style="${popupStyle}">
    <div style="color:#2a8aaa;font-weight:bold;margin-bottom:6px">PAD: ${pad.name || 'Unknown'}</div>
    <div style="color:#888;margin-bottom:4px">${pad.location || ''}</div>
    <div style="margin-bottom:4px">
      <span style="color:#888">SCHEDULED: </span>${padLaunches.length} launch(es)
    </div>
    ${padLaunches.map((l) => `
      <div style="margin-top:6px;padding-top:6px;border-top:1px solid #1a2a3a">
        <div style="color:#00d4ff">${l.name}</div>
        <div style="color:#ffdd00">T- ${countdown(l.net)}</div>
      </div>
    `).join('')}
  </div>`;
}

function decayPopup(obj: DecayObject): string {
  const days = daysUntilDecay(obj);
  const urgencyColor = days !== null && days <= 7 ? '#ff2244' : '#ff8800';
  return `<div style="${popupStyle}">
    <div style="color:${urgencyColor};font-weight:bold;margin-bottom:6px">
      ${obj.source} — ${obj.name}
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">NORAD: </span>${obj.norad}
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">COUNTRY: </span>${obj.country || 'N/A'}
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">DECAY EPOCH: </span>
      <span style="color:${urgencyColor}">${obj.decayEpoch ? new Date(obj.decayEpoch).toUTCString() : 'N/A'}</span>
    </div>
    ${days !== null ? `<div style="margin-bottom:4px">
      <span style="color:#888">DAYS REMAINING: </span>
      <span style="color:${urgencyColor}">${days}d</span>
    </div>` : ''}
    <div style="margin-bottom:4px">
      <span style="color:#888">INCLINATION: </span>${obj.inclination ?? 'N/A'}°
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">APOGEE: </span>${obj.apogee ?? 'N/A'} km
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">PERIGEE: </span>${obj.perigee ?? 'N/A'} km
    </div>
    ${obj.altitude != null ? `<div style="margin-bottom:4px">
      <span style="color:#888">ALTITUDE: </span>${obj.altitude} km
    </div>` : ''}
  </div>`;
}

function eventPopup(ev: SpaceEvent): string {
  const severity = eventSeverity(ev);
  const color = severityColor(severity);
  return `<div style="${popupStyle}">
    <div style="color:${color};font-weight:bold;margin-bottom:6px;font-size:13px">
      ${ev.title_en || ev.location}
    </div>
    <div style="color:#8ab;margin-bottom:6px;font-size:11px">${ev.title_fr}</div>
    <div style="margin-bottom:4px">
      <span style="color:#888">LOCATION: </span>${ev.location_display || ev.inferred_location || ev.location}
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">DATE: </span>${ev.date}
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">ACTORS: </span>${[ev.actor1, ev.actor2].filter(Boolean).join(' / ') || 'N/A'}
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">GOLDSTEIN: </span>
      <span style="color:${color}">${ev.goldstein ?? 'N/A'}</span>
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">MENTIONS: </span>${ev.num_mentions}
    </div>
    <div style="margin-bottom:4px">
      <span style="color:#888">RELEVANCE: </span>${ev.relevance}/100
    </div>
    <div style="margin-top:8px">
      <a href="${ev.source_url}" target="_blank" rel="noopener"
        style="color:#00d4ff;text-decoration:none;font-size:11px">
        [SOURCE LINK]
      </a>
    </div>
  </div>`;
}

// ── Cluster radius function ───────────────────────────────────────────────────
function clusterRadius(zoom: number): number {
  if (zoom <= 3) return 60;
  if (zoom <= 5) return 25;
  if (zoom <= 6) return 10;
  return 5;
}

// ── Main component ────────────────────────────────────────────────────────────
interface Props {
  launches: LaunchesResponse | null;
  decay: DecayObject[];
  tip: DecayObject[];
  events: SpaceEvent[];
}

export default function WorldMap({ launches, decay, tip, events }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<{
    launches: L.LayerGroup;
    decay: L.LayerGroup;
    tip: L.LayerGroup;
    events: L.LayerGroup;
  } | null>(null);

  // Init map once
  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map('map', {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 12,
      zoomControl: false,  // disable default (top-left), re-add bottom-right below
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> | &copy; OSM contributors',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(map);

    // Layer groups (non-clustered for launches, clustered for events)
    const launchLayer = L.layerGroup().addTo(map);
    const decayLayer = L.layerGroup().addTo(map);
    const tipLayer = L.layerGroup().addTo(map);
    const eventsCluster = (L as unknown as { markerClusterGroup: (opts: unknown) => L.LayerGroup }).markerClusterGroup({
      maxClusterRadius: clusterRadius,
      showCoverageOnHover: false,
      iconCreateFunction: (cluster: { getChildCount: () => number }) => {
        const count = cluster.getChildCount();
        return L.divIcon({
          html: `<div style="background:#ff440033;border:1px solid #ff4400;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;color:#ff8800;font-family:'Share Tech Mono',monospace;font-size:12px">${count}</div>`,
          className: '',
          iconSize: [36, 36],
        });
      },
    }) as L.LayerGroup;
    map.addLayer(eventsCluster);

    L.control.layers(
      {},
      {
        'Launches': launchLayer,
        'DECAY Reentries': decayLayer,
        'TIP Objects': tipLayer,
        'GDELT Events': eventsCluster,
      },
      { position: 'topright', collapsed: true }
    ).addTo(map);

    mapRef.current = map;
    layersRef.current = {
      launches: launchLayer,
      decay: decayLayer,
      tip: tipLayer,
      events: eventsCluster,
    };

    return () => {
      map.remove();
      mapRef.current = null;
      layersRef.current = null;
    };
  }, []);

  // Update launch markers
  useEffect(() => {
    if (!layersRef.current || !launches) return;
    const layer = layersRef.current.launches;
    layer.clearLayers();

    const padSet = new Set<string>();

    // Upcoming launches — cyan rockets on pad
    for (const l of launches.upcoming) {
      if (!l.pad.lat || !l.pad.lon) continue;
      const key = `${l.pad.lat},${l.pad.lon}`;
      padSet.add(key);
      const marker = L.marker([l.pad.lat, l.pad.lon], {
        icon: createRocketIcon('#00d4ff', l.status.abbrev === 'GO'),
        zIndexOffset: 1000,
      });
      marker.bindPopup(launchPopup(l), { maxWidth: 340 });
      layer.addLayer(marker);
    }

    // Pads without upcoming launches — grey rockets
    for (const pad of launches.pads) {
      const key = `${pad.lat},${pad.lon}`;
      if (padSet.has(key)) continue;
      const marker = L.marker([pad.lat, pad.lon], {
        icon: createRocketIcon('#2a5a7a'),
      });
      marker.bindPopup(padPopup(pad, launches.upcoming), { maxWidth: 320 });
      layer.addLayer(marker);
    }
  }, [launches]);

  // Update DECAY markers
  useEffect(() => {
    if (!layersRef.current) return;
    const layer = layersRef.current.decay;
    layer.clearLayers();

    for (const obj of decay) {
      // DECAY rarely has lat/lon — skip those without
      if (!obj.lat || !obj.lon) continue;
      const days = daysUntilDecay(obj);
      const color = days !== null && days <= 7 ? '#ff2244' : '#ff8800';
      const marker = L.marker([obj.lat, obj.lon], { icon: createDecayIcon(color) });
      marker.bindPopup(decayPopup(obj), { maxWidth: 300 });
      layer.addLayer(marker);
    }
  }, [decay]);

  // Update TIP markers
  useEffect(() => {
    if (!layersRef.current) return;
    const layer = layersRef.current.tip;
    layer.clearLayers();

    for (const obj of tip) {
      if (!obj.lat || !obj.lon) continue;
      const marker = L.marker([obj.lat, obj.lon], { icon: createTipIcon() });
      marker.bindPopup(decayPopup(obj), { maxWidth: 300 });
      layer.addLayer(marker);
    }
  }, [tip]);

  // Update GDELT event markers
  useEffect(() => {
    if (!layersRef.current) return;
    const layer = layersRef.current.events;
    layer.clearLayers();

    for (const ev of events) {
      if (!ev.latitude || !ev.longitude) continue;
      const severity = eventSeverity(ev);
      const color = severityColor(severity);
      const radius = Math.max(5, Math.min(12, 5 + (ev.num_mentions / 50)));
      const marker = L.circleMarker([ev.latitude, ev.longitude], {
        radius,
        fillColor: color,
        fillOpacity: 0.75,
        color: color,
        weight: 1.5,
      });
      marker.bindPopup(eventPopup(ev), { maxWidth: 340 });
      layer.addLayer(marker);
    }
  }, [events]);

  return <div id="map" style={{ width: '100%', height: '100%', background: '#0a0e1a' }} />;
}

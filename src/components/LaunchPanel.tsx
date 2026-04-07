import { useState, useEffect, useRef } from 'react';
import type { Launch, LaunchesResponse } from '../types/launch';

interface Props {
  data: LaunchesResponse | null;
  loading: boolean;
}

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

function statusColor(abbrev: string | null): string {
  switch (abbrev) {
    case 'GO': return '#00d4ff';
    case 'TBD': return '#ffdd00';
    case 'HOLD': return '#ff8800';
    case 'SUCCESS': return '#00ff88';
    case 'FAILURE': return '#ff2244';
    default: return '#aaa';
  }
}

function LaunchCard({ launch, isUpcoming }: { launch: Launch; isUpcoming: boolean }) {
  const [cd, setCd] = useState(countdown(launch.net));

  useEffect(() => {
    if (!isUpcoming) return;
    const t = setInterval(() => setCd(countdown(launch.net)), 1000);
    return () => clearInterval(t);
  }, [launch.net, isUpcoming]);

  const sc = statusColor(launch.status.abbrev);

  return (
    <div style={{
      borderLeft: `2px solid ${sc}`,
      padding: '10px 10px 10px 12px',
      marginBottom: '8px',
      background: 'rgba(0,20,40,0.5)',
      borderRadius: '2px',
    }}>
      {launch.image && (
        <img
          src={launch.image}
          alt={launch.name}
          style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '2px', marginBottom: '6px' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      )}
      <div style={{ color: '#e0e8f0', fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', lineHeight: 1.3 }}>
        {launch.name}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
        <span style={{ color: sc, fontSize: '10px' }}>{launch.status.abbrev || launch.status.name}</span>
        <span style={{ color: '#ffdd00', fontSize: '10px' }}>{cd}</span>
      </div>
      <div style={{ color: '#4a7a8a', fontSize: '10px', marginBottom: '2px' }}>
        {launch.rocket.name} · {launch.agency.abbrev || launch.agency.name}
      </div>
      <div style={{ color: '#3a5a6a', fontSize: '10px' }}>
        {launch.pad.name}
      </div>
      {launch.mission.orbit && (
        <div style={{ color: '#2a8aaa', fontSize: '10px', marginTop: '2px' }}>
          ↗ {launch.mission.orbit}
        </div>
      )}
    </div>
  );
}

export default function LaunchPanel({ data, loading }: Props) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'upcoming' | 'previous'>('upcoming');
  const panelRef = useRef<HTMLDivElement>(null);

  const upcoming = data?.upcoming ?? [];
  const previous = data?.previous ?? [];
  const list = tab === 'upcoming' ? upcoming : previous;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          top: '58px',
          left: '10px',
          zIndex: 1000,
          background: open ? 'rgba(0,212,255,0.15)' : 'rgba(5,8,16,0.9)',
          border: `1px solid ${open ? '#00d4ff' : '#00d4ff44'}`,
          color: '#00d4ff',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '12px',
          padding: '6px 14px',
          cursor: 'pointer',
          borderRadius: '2px',
          letterSpacing: '2px',
          textShadow: open ? '0 0 8px #00d4ff88' : 'none',
        }}
      >
        ◈ SPACE
      </button>

      {/* Side panel */}
      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          top: '48px',
          left: 0,
          bottom: 0,
          width: '300px',
          background: 'rgba(4,8,18,0.97)',
          borderRight: '1px solid #00d4ff22',
          zIndex: 999,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Share Tech Mono', monospace",
        }}
      >
        {/* Panel header */}
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid #00d4ff22',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ color: '#00d4ff', fontSize: '13px', letterSpacing: '2px' }}>
            LAUNCH TRACKER
          </span>
          <button
            onClick={() => setOpen(false)}
            style={{ background: 'none', border: 'none', color: '#4a7a8a', cursor: 'pointer', fontSize: '16px' }}
          >×</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #00d4ff11' }}>
          {(['upcoming', 'previous'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                borderBottom: tab === t ? '2px solid #00d4ff' : '2px solid transparent',
                color: tab === t ? '#00d4ff' : '#4a7a8a',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '11px',
                padding: '8px',
                cursor: 'pointer',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              {t === 'upcoming' ? `UPCOMING (${upcoming.length})` : `PREVIOUS (${previous.length})`}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
          {loading && (
            <div style={{ color: '#4a7a8a', fontSize: '11px', textAlign: 'center', padding: '20px' }}>
              LOADING DATA...
            </div>
          )}
          {!loading && list.length === 0 && (
            <div style={{ color: '#4a7a8a', fontSize: '11px', textAlign: 'center', padding: '20px' }}>
              NO DATA AVAILABLE
            </div>
          )}
          {list.map((l) => (
            <LaunchCard key={l.id} launch={l} isUpcoming={tab === 'upcoming'} />
          ))}
        </div>

        {/* Footer */}
        {data && (
          <div style={{
            padding: '8px 12px',
            borderTop: '1px solid #00d4ff11',
            color: '#2a4a5a',
            fontSize: '10px',
          }}>
            Last sync: {new Date(data.fetchedAt).toUTCString()}
          </div>
        )}
      </div>
    </>
  );
}

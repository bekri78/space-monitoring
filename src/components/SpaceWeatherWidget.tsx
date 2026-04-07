import { useState } from 'react';
import type { SpaceWeatherResponse } from '../types/spaceweather';
import { kpColor, kpLabel } from '../types/spaceweather';

interface Props {
  data: SpaceWeatherResponse | null;
  loading: boolean;
}

function ScaleBadge({ label, value }: { label: string; value: string | null }) {
  const n = parseInt(value || '0', 10);
  const color = n >= 4 ? '#ff2244' : n >= 3 ? '#ff8800' : n >= 2 ? '#ffdd00' : n >= 1 ? '#00d4ff' : '#2a4a5a';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ color: '#3a5a6a', fontSize: '10px' }}>{label}</span>
      <span style={{
        color,
        fontWeight: 'bold',
        fontSize: '12px',
        minWidth: '16px',
        textShadow: n >= 1 ? `0 0 6px ${color}88` : 'none',
      }}>
        {n > 0 ? `${label}${n}` : '--'}
      </span>
    </div>
  );
}

export default function SpaceWeatherWidget({ data, loading }: Props) {
  const [expanded, setExpanded] = useState(false);

  const kp = data?.kp ?? null;
  const color = kpColor(kp ?? 0);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
      background: 'rgba(4,8,18,0.95)',
      border: `1px solid ${kp !== null && kp >= 5 ? color : '#00d4ff22'}`,
      borderRadius: '4px',
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: '12px',
      minWidth: '200px',
      maxWidth: '320px',
      boxShadow: kp !== null && kp >= 5 ? `0 0 20px ${color}44` : '0 0 10px rgba(0,0,0,0.5)',
      transition: 'all 0.3s',
    }}>
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '10px 14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ color: '#00d4ff55', fontSize: '10px', letterSpacing: '2px' }}>
          SPACE WEATHER
        </div>

        {loading ? (
          <span style={{ color: '#4a7a8a', fontSize: '11px' }}>LOADING...</span>
        ) : kp !== null ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#4a7a8a', fontSize: '10px' }}>Kp</span>
            <span style={{
              color,
              fontSize: '20px',
              fontWeight: 'bold',
              textShadow: `0 0 12px ${color}88`,
            }}>
              {kp.toFixed(1)}
            </span>
            <span style={{ color, fontSize: '10px' }}>{kpLabel(kp)}</span>
          </div>
        ) : (
          <span style={{ color: '#4a7a8a', fontSize: '11px' }}>N/A</span>
        )}

        <span style={{ color: '#4a7a8a', fontSize: '14px' }}>{expanded ? '▼' : '▲'}</span>
      </div>

      {/* Expanded content */}
      {expanded && data && (
        <div style={{ borderTop: '1px solid #00d4ff22', padding: '10px 14px' }}>
          {/* NOAA Scales */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '10px' }}>
            <ScaleBadge label="G" value={data.scales?.G?.current ?? '0'} />
            <ScaleBadge label="S" value={data.scales?.S?.current ?? '0'} />
            <ScaleBadge label="R" value={data.scales?.R?.current ?? '0'} />
          </div>

          {/* Kp bar chart (mini) */}
          {data.kpForecast.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ color: '#3a5a6a', fontSize: '10px', marginBottom: '4px' }}>
                Kp FORECAST
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '32px' }}>
                {data.kpForecast.slice(-24).map((p, i) => {
                  const h = Math.max(2, (p.kp / 9) * 32);
                  const c = kpColor(p.kp);
                  return (
                    <div
                      key={i}
                      title={`${p.time}: Kp ${p.kp}`}
                      style={{
                        flex: 1,
                        height: `${h}px`,
                        background: c,
                        opacity: 0.7,
                        borderRadius: '1px 1px 0 0',
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Alerts */}
          {data.alerts.length > 0 && (
            <div>
              <div style={{ color: '#ff8800', fontSize: '10px', marginBottom: '4px', letterSpacing: '1px' }}>
                ⚠ NOAA ALERTS ({data.alerts.length})
              </div>
              <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                {data.alerts.slice(0, 5).map((a, i) => (
                  <div key={i} style={{
                    color: '#8ab4c8',
                    fontSize: '10px',
                    padding: '4px 0',
                    borderBottom: '1px solid #1a2a3a',
                    lineHeight: 1.4,
                  }}>
                    <span style={{ color: '#ff8800' }}>{a.issued?.slice(0, 10)}</span>{' '}
                    {a.message.slice(0, 80)}...
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ color: '#1a3a4a', fontSize: '10px', marginTop: '8px' }}>
            Updated: {data.fetchedAt ? new Date(data.fetchedAt).toUTCString().slice(0, 25) : 'N/A'}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';

interface Props {
  launchCount: number;
  decayCount: number;
  tipCount: number;
  eventCount: number;
  kp: number | null;
}

export default function Header({ launchCount, decayCount, tipCount, eventCount, kp }: Props) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const utcStr = time.toUTCString().replace('GMT', 'UTC');

  function kpColor(k: number | null) {
    if (k === null) return '#555';
    if (k >= 8) return '#ff2244';
    if (k >= 6) return '#ff8800';
    if (k >= 4) return '#ffdd00';
    return '#00d4ff';
  }

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: 'rgba(5,8,16,0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #00d4ff22',
      padding: '0 20px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: '12px',
      color: '#8ab4c8',
    }}>
      {/* Left: logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          color: '#00d4ff',
          fontSize: '16px',
          fontWeight: 'bold',
          letterSpacing: '4px',
          textShadow: '0 0 12px #00d4ff88',
        }}>
          ◈ SPACE MONITOR
        </div>
        <div style={{ color: '#2a4a5a', fontSize: '11px' }}>
          GLOBAL SPACE SURVEILLANCE SYSTEM
        </div>
      </div>

      {/* Center: stats */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Stat label="LAUNCHES" value={launchCount} color="#00d4ff" />
        <Stat label="DECAY" value={decayCount} color="#ff8800" />
        <Stat label="TIP" value={tipCount} color="#aa44ff" />
        <Stat label="EVENTS" value={eventCount} color="#ffdd00" />
        {kp !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#555' }}>Kp</span>
            <span style={{
              color: kpColor(kp),
              fontWeight: 'bold',
              fontSize: '14px',
              textShadow: `0 0 8px ${kpColor(kp)}88`,
            }}>{kp.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Right: UTC clock */}
      <div style={{ color: '#4a7a8a', fontSize: '11px', textAlign: 'right' }}>
        <div style={{ color: '#00d4ff55', marginBottom: '1px' }}>UTC CLOCK</div>
        <div style={{ color: '#8ab4c8' }}>{utcStr}</div>
      </div>
    </header>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ color: '#3a5a6a', fontSize: '10px' }}>{label}</span>
      <span style={{ color, fontWeight: 'bold', fontSize: '13px' }}>{value}</span>
    </div>
  );
}

import WorldMap from './components/WorldMap';
import Header from './components/Header';
import LaunchPanel from './components/LaunchPanel';
import SpaceWeatherWidget from './components/SpaceWeatherWidget';
import { useLaunches } from './hooks/useLaunches';
import { useDecay } from './hooks/useDecay';
import { useTip } from './hooks/useTip';
import { useSpaceWeather } from './hooks/useSpaceWeather';
import { useEvents } from './hooks/useEvents';

export default function App() {
  const { data: launches, loading: launchLoading } = useLaunches();
  const { data: decay } = useDecay();
  const { data: tip } = useTip();
  const { data: weather, loading: weatherLoading } = useSpaceWeather();
  const { data: events } = useEvents();

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0e1a', overflow: 'hidden' }}>
      <Header
        launchCount={launches?.upcoming?.length ?? 0}
        decayCount={decay.length}
        tipCount={tip.length}
        eventCount={events.length}
        kp={weather?.kp ?? null}
      />

      <LaunchPanel data={launches} loading={launchLoading} />

      {/* Map fills everything below header */}
      <div style={{ position: 'absolute', top: '48px', left: 0, right: 0, bottom: 0 }}>
        <WorldMap
          launches={launches}
          decay={decay}
          tip={tip}
          events={events}
        />
      </div>

      <SpaceWeatherWidget data={weather} loading={weatherLoading} />
    </div>
  );
}

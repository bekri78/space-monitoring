import { useState, useEffect, useCallback } from 'react';
import type { SpaceWeatherResponse } from '../types/spaceweather';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export function useSpaceWeather() {
  const [data, setData] = useState<SpaceWeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/spaceweather`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: SpaceWeatherResponse = await res.json();
      setData(json);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
    // Refresh every 15 minutes
    const interval = setInterval(fetch_, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetch_]);

  return { data, loading, error };
}

import { useState, useEffect, useCallback } from 'react';
import type { LaunchesResponse } from '../types/launch';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export function useLaunches() {
  const [data, setData] = useState<LaunchesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/launches`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: LaunchesResponse = await res.json();
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
    // Refresh every 6 hours
    const interval = setInterval(fetch_, 6 * 3600 * 1000);
    return () => clearInterval(interval);
  }, [fetch_]);

  return { data, loading, error, refresh: fetch_ };
}

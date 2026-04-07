import { useState, useEffect, useCallback } from 'react';
import type { TipResponse } from '../types/decay';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export function useTip() {
  const [data, setData] = useState<TipResponse>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/tip`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: TipResponse = await res.json();
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
    const interval = setInterval(fetch_, 6 * 3600 * 1000);
    return () => clearInterval(interval);
  }, [fetch_]);

  return { data, loading, error };
}

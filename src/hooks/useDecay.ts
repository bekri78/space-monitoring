import { useState, useEffect, useCallback } from 'react';
import type { DecayResponse } from '../types/decay';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export function useDecay() {
  const [data, setData] = useState<DecayResponse>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/decay`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: DecayResponse = await res.json();
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
    // Refresh every 12h (DECAY updates once daily)
    const interval = setInterval(fetch_, 12 * 3600 * 1000);
    return () => clearInterval(interval);
  }, [fetch_]);

  return { data, loading, error };
}

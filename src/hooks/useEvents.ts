import { useState, useEffect, useCallback } from 'react';
import type { EventsResponse } from '../types/event';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export function useEvents() {
  const [data, setData] = useState<EventsResponse>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/events`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: EventsResponse = await res.json();
      setData(json);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const forceRefresh = useCallback(async () => {
    try {
      await fetch(`${API_BASE}/refresh`, { method: 'POST' });
      setTimeout(fetch_, 5000); // wait 5s then reload
    } catch (_) {}
  }, [fetch_]);

  useEffect(() => {
    fetch_();
    // Refresh every 6h
    const interval = setInterval(fetch_, 6 * 3600 * 1000);
    return () => clearInterval(interval);
  }, [fetch_]);

  return { data, loading, error, forceRefresh };
}

export interface SpaceEvent {
  id: string;
  date: string;
  date_added: string | null;
  location: string;
  country_code: string;
  actor1: string;
  actor2: string;
  event_code: string;
  root_code: string;
  goldstein: number | null;
  num_mentions: number;
  num_sources: number;
  num_articles: number;
  avg_tone: number | null;
  geo_type: string;
  latitude: number;
  longitude: number;
  source_url: string;
  // Enriched fields
  title_fr: string;
  title_en: string;
  relevance: number;
  inferred_location: string;
  location_display?: string;
}

export type EventsResponse = SpaceEvent[];

// Severity based on Goldstein scale (-10 to +10) and avg_tone
export function eventSeverity(ev: SpaceEvent): 'high' | 'medium' | 'low' | 'positive' {
  const g = ev.goldstein ?? 0;
  if (g <= -5) return 'high';
  if (g <= -1) return 'medium';
  if (g >= 3) return 'positive';
  return 'low';
}

export function severityColor(severity: ReturnType<typeof eventSeverity>): string {
  switch (severity) {
    case 'high': return '#ff2244';
    case 'medium': return '#ff8800';
    case 'positive': return '#00ff88';
    default: return '#ffdd00';
  }
}

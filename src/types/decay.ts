export interface DecayObject {
  id: string;
  name: string;
  norad: string;
  country: string | null;
  inclination: number | null;
  apogee: number | null;
  perigee: number | null;
  decayEpoch: string | null;  // ISO date
  lat: number | null;
  lon: number | null;
  source: 'DECAY' | 'TIP';
  altitude?: number | null;   // TIP only
}

export type DecayResponse = DecayObject[];
export type TipResponse = DecayObject[];

// Days until decay
export function daysUntilDecay(obj: DecayObject): number | null {
  if (!obj.decayEpoch) return null;
  const diff = new Date(obj.decayEpoch).getTime() - Date.now();
  return Math.round(diff / (24 * 3600 * 1000));
}

export function decayUrgency(obj: DecayObject): 'imminent' | 'soon' | 'upcoming' {
  const days = daysUntilDecay(obj);
  if (days === null) return 'upcoming';
  if (days <= 7) return 'imminent';
  if (days <= 30) return 'soon';
  return 'upcoming';
}

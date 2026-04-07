export interface KpPoint {
  time: string;
  kp: number;
}

export interface NoaaScale {
  current: string;
  text: string;
}

export interface NoaaAlert {
  id: string;
  issued: string | null;
  message: string;
  serialNumber: string | null;
}

export interface SpaceWeatherResponse {
  kp: number | null;
  kpTimestamp: string | null;
  kpForecast: KpPoint[];
  scales: {
    G: NoaaScale | null;
    S: NoaaScale | null;
    R: NoaaScale | null;
  };
  alerts: NoaaAlert[];
  fetchedAt: string;
}

export function kpColor(kp: number): string {
  if (kp >= 8) return '#ff2244';
  if (kp >= 6) return '#ff8800';
  if (kp >= 4) return '#ffdd00';
  return '#00d4ff';
}

export function kpLabel(kp: number): string {
  if (kp >= 8) return 'EXTREME';
  if (kp >= 6) return 'SEVERE';
  if (kp >= 5) return 'STRONG';
  if (kp >= 4) return 'MODERATE';
  if (kp >= 2) return 'MINOR';
  return 'QUIET';
}

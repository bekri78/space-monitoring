export interface LaunchStatus {
  id: number | null;
  name: string | null;
  abbrev: string | null; // GO, TBD, HOLD, SUCCESS, FAILURE
}

export interface LaunchPad {
  name: string | null;
  location: string | null;
  lat: number | null;
  lon: number | null;
  map_url: string | null;
}

export interface LaunchMission {
  name: string | null;
  description: string | null;
  orbit: string | null;
  type: string | null;
}

export interface LaunchRocket {
  name: string | null;
  family: string | null;
}

export interface LaunchAgency {
  name: string | null;
  abbrev: string | null;
  country: string | null;
  type: string | null;
}

export interface Launch {
  id: string;
  name: string;
  status: LaunchStatus;
  net: string | null;          // Next Expected Time (ISO)
  window_start: string | null;
  window_end: string | null;
  image: string | null;
  pad: LaunchPad;
  mission: LaunchMission;
  rocket: LaunchRocket;
  agency: LaunchAgency;
  probability: number | null;
  holdreason: string | null;
  failreason: string | null;
}

export interface Pad {
  key: string;
  name: string | null;
  location: string | null;
  lat: number;
  lon: number;
  launches: string[];
}

export interface LaunchesResponse {
  upcoming: Launch[];
  previous: Launch[];
  pads: Pad[];
  fetchedAt: string;
}

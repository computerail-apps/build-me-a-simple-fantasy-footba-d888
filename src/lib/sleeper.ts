const BASE = 'https://api.sleeper.app/v1';

export interface SleeperUser {
  user_id: string;
  username: string;
  display_name: string;
  avatar: string | null;
}

export interface SleeperLeague {
  league_id: string;
  name: string;
  season: string;
  total_rosters: number;
  status: string;
  avatar: string | null;
}

export interface SleeperRosterSettings {
  wins?: number;
  losses?: number;
  ties?: number;
  fpts?: number;
  fpts_decimal?: number;
  fpts_against?: number;
  fpts_against_decimal?: number;
}

export interface SleeperRoster {
  roster_id: number;
  owner_id: string;
  players: string[];
  starters: string[];
  settings: SleeperRosterSettings;
}

export interface SleeperLeagueUser {
  user_id: string;
  display_name: string;
  metadata?: { team_name?: string };
  avatar: string | null;
}

export interface SleeperPlayer {
  full_name?: string;
  first_name?: string;
  last_name?: string;
  position?: string;
  team?: string | null;
}

export interface SleeperMatchup {
  roster_id: number;
  matchup_id: number;
  points: number;
  starters: string[];
  players: string[];
  players_points?: Record<string, number>;
}

export interface NflState {
  week: number;
  season: string;
  season_type: string;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Not found on Sleeper.');
    throw new Error(`Sleeper API error (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function getUserByUsername(username: string): Promise<SleeperUser> {
  return fetchJson<SleeperUser>(`${BASE}/user/${encodeURIComponent(username)}`);
}

export function getUserLeagues(userId: string, season: string): Promise<SleeperLeague[]> {
  return fetchJson<SleeperLeague[]>(`${BASE}/user/${userId}/leagues/nfl/${season}`);
}

export function getLeague(leagueId: string): Promise<SleeperLeague> {
  return fetchJson<SleeperLeague>(`${BASE}/league/${leagueId}`);
}

export function getLeagueRosters(leagueId: string): Promise<SleeperRoster[]> {
  return fetchJson<SleeperRoster[]>(`${BASE}/league/${leagueId}/rosters`);
}

export function getLeagueUsers(leagueId: string): Promise<SleeperLeagueUser[]> {
  return fetchJson<SleeperLeagueUser[]>(`${BASE}/league/${leagueId}/users`);
}

export function getLeagueMatchups(leagueId: string, week: number): Promise<SleeperMatchup[]> {
  return fetchJson<SleeperMatchup[]>(`${BASE}/league/${leagueId}/matchups/${week}`);
}

export function getNflState(): Promise<NflState> {
  return fetchJson<NflState>(`${BASE}/state/nfl`);
}

export function getPlayersDump(): Promise<Record<string, SleeperPlayer>> {
  return fetchJson<Record<string, SleeperPlayer>>(`${BASE}/players/nfl`);
}

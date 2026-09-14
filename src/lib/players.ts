import { getPlayersDump, type SleeperPlayer } from '@/lib/sleeper';

const CACHE_KEY = 'gridiron_players_dump_v1';
const CACHE_TS_KEY = 'gridiron_players_dump_ts_v1';
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export async function getCachedPlayers(): Promise<Record<string, SleeperPlayer>> {
  const ts = localStorage.getItem(CACHE_TS_KEY);
  const cached = localStorage.getItem(CACHE_KEY);
  if (ts && cached && Date.now() - Number(ts) < ONE_DAY_MS) {
    try {
      return JSON.parse(cached) as Record<string, SleeperPlayer>;
    } catch {
      // fall through to refetch
    }
  }
  const fresh = await getPlayersDump();
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(fresh));
    localStorage.setItem(CACHE_TS_KEY, String(Date.now()));
  } catch {
    // localStorage quota exceeded - proceed without caching
  }
  return fresh;
}

export function playerLabel(p: SleeperPlayer | undefined, playerId: string): string {
  if (!p) return playerId === '0' ? 'Empty' : `Unknown (${playerId})`;
  return p.full_name ?? [p.first_name, p.last_name].filter(Boolean).join(' ') || playerId;
}

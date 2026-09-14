import { getPlayersDump, type SleeperPlayer } from '@/lib/sleeper';

const CACHE_KEY = 'gridiron_players_cache_v1';
const CACHE_TS_KEY = 'gridiron_players_cache_ts_v1';
const ONE_DAY = 24 * 60 * 60 * 1000;

export async function getCachedPlayers(): Promise<Record<string, SleeperPlayer>> {
  const ts = localStorage.getItem(CACHE_TS_KEY);
  const cached = localStorage.getItem(CACHE_KEY);
  if (ts && cached && Date.now() - Number(ts) < ONE_DAY) {
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
    // localStorage may be full (dump is large) - ignore, still return fresh data
  }
  return fresh;
}

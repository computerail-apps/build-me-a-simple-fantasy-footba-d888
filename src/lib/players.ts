import { getPlayersDump, type SleeperPlayer } from '@/lib/sleeper';

const CACHE_KEY = 'gridiron_players_cache_v1';
const CACHE_DATE_KEY = 'gridiron_players_cache_date_v1';

function todayStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getCachedPlayers(): Promise<Record<string, SleeperPlayer>> {
  const cachedDate = localStorage.getItem(CACHE_DATE_KEY);
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached && cachedDate === todayStamp()) {
    try {
      return JSON.parse(cached) as Record<string, SleeperPlayer>;
    } catch {
      // fall through to refetch
    }
  }
  const dump = await getPlayersDump();
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(dump));
    localStorage.setItem(CACHE_DATE_KEY, todayStamp());
  } catch {
    // storage quota exceeded — ignore, still return fresh data
  }
  return dump;
}

export function playerName(p: SleeperPlayer | undefined, id: string): string {
  if (!p) return `Player ${id}`;
  return p.full_name || `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim() || `Player ${id}`;
}

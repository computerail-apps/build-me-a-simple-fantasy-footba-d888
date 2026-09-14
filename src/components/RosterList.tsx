import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/lib/ui/Card';
import { PositionBadge } from '@/components/PositionBadge';
import type { SleeperRoster, SleeperPlayer } from '@/lib/sleeper';

function resolvePlayer(id: string, players: Record<string, SleeperPlayer>) {
  const p = players[id];
  if (!p) return { name: id, position: 'N/A', team: 'FA' };
  const name = p.full_name || [p.first_name, p.last_name].filter(Boolean).join(' ') || id;
  return { name, position: p.position || 'N/A', team: p.team || 'FA' };
}

export function RosterList({
  roster,
  players,
  playerPoints,
}: {
  roster: SleeperRoster;
  players: Record<string, SleeperPlayer>;
  playerPoints?: Record<string, number>;
}) {
  const starters = roster.starters ?? [];
  const bench = (roster.players ?? []).filter((id) => !starters.includes(id));

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Starting lineup</CardTitle>
          <CardDescription>{starters.length} starters</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {starters.map((id, idx) => {
              const { name, position, team } = resolvePlayer(id, players);
              const pts = playerPoints?.[id];
              return (
                <li key={`${id}-${idx}`} className="flex items-center gap-3 px-6 py-3">
                  <PositionBadge position={position} />
                  <div className="flex-1">
                    <div className="text-body text-foreground">{name}</div>
                    <div className="text-micro text-muted-foreground">{team}</div>
                  </div>
                  {pts !== undefined && <span className="text-small tabular-nums text-muted-foreground">{pts.toFixed(2)}</span>}
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bench</CardTitle>
          <CardDescription>{bench.length} players</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {bench.map((id, idx) => {
              const { name, position, team } = resolvePlayer(id, players);
              const pts = playerPoints?.[id];
              return (
                <li key={`${id}-${idx}`} className="flex items-center gap-3 px-6 py-3">
                  <PositionBadge position={position} />
                  <div className="flex-1">
                    <div className="text-body text-foreground">{name}</div>
                    <div className="text-micro text-muted-foreground">{team}</div>
                  </div>
                  {pts !== undefined && <span className="text-small tabular-nums text-muted-foreground">{pts.toFixed(2)}</span>}
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

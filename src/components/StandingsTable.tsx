import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/lib/ui/Card';
import { Button } from '@/lib/ui/Button';
import { Badge } from '@/lib/ui/Badge';
import { EmptyState } from '@/lib/ui/EmptyState';
import { Trophy, ArrowRight } from 'lucide-react';
import type { SleeperRoster, SleeperLeagueUser } from '@/lib/sleeper';

export function StandingsTable({
  rosters,
  users,
  leagueId,
}: {
  rosters: SleeperRoster[];
  users: SleeperLeagueUser[];
  leagueId: string;
}) {
  const navigate = useNavigate();

  if (rosters.length === 0) {
    return (
      <EmptyState
        icon={<Trophy size={20} />}
        title="No rosters yet"
        description="This league doesn't have any rosters set up."
      />
    );
  }

  const userMap = new Map(users.map((u) => [u.user_id, u]));
  const sorted = [...rosters].sort((a, b) => {
    const aw = a.settings?.wins ?? 0;
    const bw = b.settings?.wins ?? 0;
    if (bw !== aw) return bw - aw;
    const apf = (a.settings?.fpts ?? 0) + (a.settings?.fpts_decimal ?? 0) / 100;
    const bpf = (b.settings?.fpts ?? 0) + (b.settings?.fpts_decimal ?? 0) / 100;
    return bpf - apf;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Standings</CardTitle>
        <CardDescription>Sorted by wins, then points for.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {sorted.map((r, idx) => {
            const u = userMap.get(r.owner_id);
            const teamName = u?.metadata?.team_name || u?.display_name || `Roster ${r.roster_id}`;
            const wins = r.settings?.wins ?? 0;
            const losses = r.settings?.losses ?? 0;
            const ties = r.settings?.ties ?? 0;
            const pf = ((r.settings?.fpts ?? 0) + (r.settings?.fpts_decimal ?? 0) / 100).toFixed(2);
            const pa = ((r.settings?.fpts_against ?? 0) + (r.settings?.fpts_against_decimal ?? 0) / 100).toFixed(2);
            return (
              <li key={r.roster_id} className="flex items-center gap-4 px-6 py-3">
                <span className="w-6 text-small tabular-nums text-muted-foreground">{idx + 1}</span>
                <span className="flex-1 text-body text-foreground">{teamName}</span>
                <Badge variant="outline">
                  {wins}-{losses}
                  {ties ? `-${ties}` : ''}
                </Badge>
                <span className="w-20 text-right text-small tabular-nums text-muted-foreground">{pf} PF</span>
                <span className="hidden w-20 text-right text-small tabular-nums text-muted-foreground sm:inline">{pa} PA</span>
                <Button size="sm" variant="ghost" onClick={() => navigate(`/league/${leagueId}/roster/${r.roster_id}`)}>
                  View
                  <ArrowRight size={16} />
                </Button>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/lib/ui/Card';
import { Button } from '@/lib/ui/Button';
import { ArrowRight } from 'lucide-react';
import type { SleeperLeague } from '@/lib/sleeper';

export function LeagueGrid({ leagues, username }: { leagues: SleeperLeague[]; username: string }) {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {leagues.map((l) => (
        <Card key={l.league_id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{l.name}</CardTitle>
            <CardDescription>{l.season} season · {l.total_rosters} teams</CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto">
            <Button size="sm" onClick={() => navigate(`/league/${l.league_id}`, { state: { username } })}>
              Open league
              <ArrowRight size={16} />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

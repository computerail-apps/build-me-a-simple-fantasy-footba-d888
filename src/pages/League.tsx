import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Container } from '@/lib/ui/Container';
import { Button } from '@/lib/ui/Button';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { Bookmark, ArrowLeft, Check } from 'lucide-react';
import { getLeague, getLeagueRosters, getLeagueUsers } from '@/lib/sleeper';
import { supabase } from '@/lib/supabase';
import { getSessionId, getLastUsername } from '@/lib/session';
import { StandingsTable } from '@/components/StandingsTable';

export default function League() {
  const { leagueId } = useParams<{ leagueId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const username = (location.state as { username?: string } | null)?.username ?? getLastUsername() ?? '';
  const [saved, setSaved] = useState(false);

  const leagueQuery = useQuery({ queryKey: ['league', leagueId], queryFn: () => getLeague(leagueId as string), enabled: !!leagueId });
  const rostersQuery = useQuery({ queryKey: ['rosters', leagueId], queryFn: () => getLeagueRosters(leagueId as string), enabled: !!leagueId });
  const usersQuery = useQuery({ queryKey: ['league-users', leagueId], queryFn: () => getLeagueUsers(leagueId as string), enabled: !!leagueId });

  const saveLeague = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('saved_leagues').insert({
        session_id: getSessionId(),
        sleeper_username: username,
        league_id: leagueId,
        league_name: leagueQuery.data?.name ?? 'Unknown league',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setSaved(true);
      qc.invalidateQueries({ queryKey: ['saved-leagues'] });
    },
  });

  const isLoading = leagueQuery.isLoading || rostersQuery.isLoading || usersQuery.isLoading;
  const err = leagueQuery.error || rostersQuery.error || usersQuery.error;

  return (
    <Container>
      <div className="space-y-6 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          Back to search
        </Button>

        {isLoading ? (
          <CenteredSpinner label="Loading league" />
        ) : err ? (
          <Alert variant="destructive">
            <AlertTitle>Couldn't load league</AlertTitle>
            <AlertDescription>{(err as Error).message}</AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-h1 text-foreground">{leagueQuery.data?.name}</h1>
                <p className="text-body text-muted-foreground">
                  {leagueQuery.data?.season} season · {leagueQuery.data?.total_rosters} teams
                </p>
              </div>
              <Button variant="secondary" onClick={() => saveLeague.mutate()} disabled={saveLeague.isPending || saved}>
                {saved ? <Check size={16} /> : <Bookmark size={16} />}
                {saved ? 'Saved' : 'Save league'}
              </Button>
            </div>
            {saveLeague.error && (
              <Alert variant="destructive">
                <AlertTitle>Couldn't save league</AlertTitle>
                <AlertDescription>{(saveLeague.error as Error).message}</AlertDescription>
              </Alert>
            )}
            <StandingsTable rosters={rostersQuery.data ?? []} users={usersQuery.data ?? []} leagueId={leagueId as string} />
          </>
        )}
      </div>
    </Container>
  );
}

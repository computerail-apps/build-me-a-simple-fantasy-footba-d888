import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Container } from '@/lib/ui/Container';
import { Button } from '@/lib/ui/Button';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { ArrowLeft } from 'lucide-react';
import { getLeague, getLeagueRosters, getLeagueUsers, getPlayersDump, getLeagueMatchups, getNflState } from '@/lib/sleeper';
import { RosterList } from '@/components/RosterList';
import { MatchupCard } from '@/components/MatchupCard';

export default function Roster() {
  const { leagueId, rosterId } = useParams<{ leagueId: string; rosterId: string }>();
  const navigate = useNavigate();

  const leagueQuery = useQuery({ queryKey: ['league', leagueId], queryFn: () => getLeague(leagueId as string), enabled: !!leagueId });
  const rostersQuery = useQuery({ queryKey: ['rosters', leagueId], queryFn: () => getLeagueRosters(leagueId as string), enabled: !!leagueId });
  const usersQuery = useQuery({ queryKey: ['league-users', leagueId], queryFn: () => getLeagueUsers(leagueId as string), enabled: !!leagueId });
  const playersQuery = useQuery({ queryKey: ['players-dump'], queryFn: getPlayersDump, staleTime: 1000 * 60 * 60 * 12 });
  const stateQuery = useQuery({ queryKey: ['nfl-state'], queryFn: getNflState, staleTime: 1000 * 60 * 60 });

  const week = stateQuery.data?.week ?? 1;
  const matchupsQuery = useQuery({
    queryKey: ['matchups', leagueId, week],
    queryFn: () => getLeagueMatchups(leagueId as string, week),
    enabled: !!leagueId && !!stateQuery.data,
  });

  const isLoading = leagueQuery.isLoading || rostersQuery.isLoading || usersQuery.isLoading || playersQuery.isLoading || stateQuery.isLoading;
  const err = leagueQuery.error || rostersQuery.error || usersQuery.error || playersQuery.error;

  const roster = rostersQuery.data?.find((r) => String(r.roster_id) === rosterId);
  const userMap = new Map((usersQuery.data ?? []).map((u) => [u.user_id, u]));
  const owner = roster ? userMap.get(roster.owner_id) : undefined;
  const teamName = owner?.metadata?.team_name || owner?.display_name || `Roster ${rosterId}`;

  const myMatchup = matchupsQuery.data?.find((m) => String(m.roster_id) === rosterId);
  const opponentMatchup = myMatchup
    ? matchupsQuery.data?.find((m) => m.matchup_id === myMatchup.matchup_id && m.roster_id !== myMatchup.roster_id)
    : undefined;
  const opponentRoster = opponentMatchup ? rostersQuery.data?.find((r) => r.roster_id === opponentMatchup.roster_id) : undefined;
  const opponentOwner = opponentRoster ? userMap.get(opponentRoster.owner_id) : undefined;
  const opponentName =
    opponentOwner?.metadata?.team_name || opponentOwner?.display_name || (opponentRoster ? `Roster ${opponentRoster.roster_id}` : undefined);

  return (
    <Container>
      <div className="space-y-6 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/league/${leagueId}`)}>
          <ArrowLeft size={16} />
          Back to standings
        </Button>

        {isLoading ? (
          <CenteredSpinner label="Loading roster" />
        ) : err ? (
          <Alert variant="destructive">
            <AlertTitle>Couldn't load roster</AlertTitle>
            <AlertDescription>{(err as Error).message}</AlertDescription>
          </Alert>
        ) : !roster ? (
          <Alert variant="destructive">
            <AlertTitle>Roster not found</AlertTitle>
            <AlertDescription>This roster doesn't exist in this league.</AlertDescription>
          </Alert>
        ) : (
          <>
            <div>
              <h1 className="text-h1 text-foreground">{teamName}</h1>
              <p className="text-body text-muted-foreground">
                {leagueQuery.data?.name} · Week {week}
              </p>
            </div>

            <MatchupCard
              myTeamName={teamName}
              myPoints={myMatchup?.points}
              opponentName={opponentMatchup ? opponentName : undefined}
              opponentPoints={opponentMatchup?.points}
              loading={matchupsQuery.isLoading}
              error={matchupsQuery.error as Error | null}
            />

            <RosterList roster={roster} players={playersQuery.data ?? {}} playerPoints={myMatchup?.players_points} />
          </>
        )}
      </div>
    </Container>
  );
}

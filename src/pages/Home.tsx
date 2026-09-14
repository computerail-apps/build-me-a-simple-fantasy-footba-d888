import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container } from '@/lib/ui/Container';
import { Input } from '@/lib/ui/Input';
import { Button } from '@/lib/ui/Button';
import { EmptyState } from '@/lib/ui/EmptyState';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { Search, Users } from 'lucide-react';
import { getUserByUsername, getUserLeagues, getNflState } from '@/lib/sleeper';
import { setLastUsername } from '@/lib/session';
import { LeagueGrid } from '@/components/LeagueGrid';
import { SavedLeaguesSection } from '@/components/SavedLeaguesSection';

export default function Home() {
  const [input, setInput] = useState('');
  const [username, setUsername] = useState<string | null>(null);

  const stateQuery = useQuery({ queryKey: ['nfl-state'], queryFn: getNflState, staleTime: 1000 * 60 * 60 });

  const userQuery = useQuery({
    queryKey: ['sleeper-user', username],
    queryFn: () => getUserByUsername(username as string),
    enabled: !!username,
    retry: false,
  });

  const season = stateQuery.data?.season;

  const leaguesQuery = useQuery({
    queryKey: ['sleeper-leagues', userQuery.data?.user_id, season],
    queryFn: () => getUserLeagues(userQuery.data!.user_id, season as string),
    enabled: !!userQuery.data?.user_id && !!season,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setUsername(trimmed);
    setLastUsername(trimmed);
  }

  return (
    <Container>
      <div className="space-y-10 py-12">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-display text-foreground">Track your Sleeper fantasy leagues</h1>
          <p className="text-body text-muted-foreground">
            Enter your Sleeper username to pull your real leagues, rosters, and live matchup scores — straight
            from Sleeper's API. No fake stats, ever.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input placeholder="Sleeper username" value={input} onChange={(e) => setInput(e.target.value)} />
            <Button type="submit" disabled={userQuery.isFetching}>
              <Search size={16} />
              Find leagues
            </Button>
          </form>
        </div>

        <SavedLeaguesSection />

        {username && (
          <div className="space-y-4">
            <h2 className="text-h2 text-foreground">Leagues for {username}</h2>
            {userQuery.isLoading || stateQuery.isLoading ? (
              <CenteredSpinner label="Looking up Sleeper user" />
            ) : userQuery.error ? (
              <Alert variant="destructive">
                <AlertTitle>Couldn't find that user</AlertTitle>
                <AlertDescription>{(userQuery.error as Error).message}</AlertDescription>
              </Alert>
            ) : leaguesQuery.isLoading ? (
              <CenteredSpinner label="Loading leagues" />
            ) : leaguesQuery.error ? (
              <Alert variant="destructive">
                <AlertTitle>Couldn't load leagues</AlertTitle>
                <AlertDescription>{(leaguesQuery.error as Error).message}</AlertDescription>
              </Alert>
            ) : !leaguesQuery.data || leaguesQuery.data.length === 0 ? (
              <EmptyState
                icon={<Users size={20} />}
                title="No leagues found"
                description={`${username} has no NFL leagues for the ${season} season.`}
              />
            ) : (
              <LeagueGrid leagues={leaguesQuery.data} username={username} />
            )}
          </div>
        )}
      </div>
    </Container>
  );
}

import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/lib/ui/Card';
import { Button } from '@/lib/ui/Button';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { Bookmark, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getSessionId } from '@/lib/session';

interface SavedLeague {
  id: string;
  league_id: string;
  league_name: string;
  sleeper_username: string;
  created_at: string;
}

export function SavedLeaguesSection() {
  const sessionId = getSessionId();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['saved-leagues', sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saved_leagues')
        .select('id,league_id,league_name,sleeper_username,created_at')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as SavedLeague[];
    },
  });

  if (isLoading) return <CenteredSpinner label="Loading saved leagues" />;

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Couldn't load saved leagues</AlertTitle>
        <AlertDescription>{(error as Error).message}</AlertDescription>
      </Alert>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-h2 text-foreground">Saved leagues</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((s) => (
          <Card key={s.id}>
            <CardHeader>
              <CardTitle>{s.league_name}</CardTitle>
              <CardDescription>Saved for @{s.sleeper_username}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => navigate(`/league/${s.league_id}`, { state: { username: s.sleeper_username } })}
              >
                <Bookmark size={16} />
                Open
                <ArrowRight size={16} />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

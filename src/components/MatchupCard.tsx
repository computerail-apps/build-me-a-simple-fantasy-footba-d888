import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/lib/ui/Card';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { EmptyState } from '@/lib/ui/EmptyState';
import { Swords } from 'lucide-react';

interface Props {
  myTeamName: string;
  myPoints?: number;
  opponentName?: string;
  opponentPoints?: number;
  loading: boolean;
  error: Error | null;
}

export function MatchupCard({ myTeamName, myPoints, opponentName, opponentPoints, loading, error }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current matchup</CardTitle>
        <CardDescription>Live score for this week, straight from Sleeper.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <CenteredSpinner label="Loading matchup" />
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Couldn't load matchup</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        ) : !opponentName ? (
          <EmptyState
            icon={<Swords size={20} />}
            title="No matchup this week"
            description="Sleeper hasn't generated a matchup for this roster yet."
          />
        ) : (
          <div className="grid grid-cols-2 items-center gap-4">
            <div className="space-y-1 text-center">
              <div className="text-small text-muted-foreground">{myTeamName}</div>
              <div className="text-h1 tabular-nums text-foreground">{(myPoints ?? 0).toFixed(2)}</div>
            </div>
            <div className="space-y-1 text-center">
              <div className="text-small text-muted-foreground">{opponentName}</div>
              <div className="text-h1 tabular-nums text-foreground">{(opponentPoints ?? 0).toFixed(2)}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

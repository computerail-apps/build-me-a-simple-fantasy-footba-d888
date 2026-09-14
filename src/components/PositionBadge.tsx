import { Badge } from '@/lib/ui/Badge';
import { cn } from '@/lib/cn';

const POSITION_STYLES: Record<string, string> = {
  QB: 'bg-destructive/15 text-destructive border-destructive/30',
  RB: 'bg-success/15 text-success border-success/30',
  WR: 'bg-primary/15 text-primary border-primary/30',
  TE: 'bg-warning/15 text-warning border-warning/30',
  FLEX: 'bg-muted text-muted-foreground border-border',
  DEF: 'bg-secondary/40 text-secondary-foreground border-border',
  K: 'bg-accent/20 text-accent-foreground border-border',
};

export function PositionBadge({ position }: { position: string }) {
  const key = position?.toUpperCase() ?? '';
  const cls = POSITION_STYLES[key] ?? 'bg-muted text-muted-foreground border-border';
  return (
    <Badge variant="outline" className={cn('font-mono text-micro', cls)}>
      {key || '—'}
    </Badge>
  );
}

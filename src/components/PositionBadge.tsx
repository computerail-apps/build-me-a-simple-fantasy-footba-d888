import { Badge } from '@/lib/ui/Badge';
import { cn } from '@/lib/cn';

const POSITION_STYLES: Record<string, string> = {
  QB: 'bg-destructive/15 text-destructive border-destructive/30',
  RB: 'bg-success/15 text-success border-success/30',
  WR: 'bg-primary/15 text-primary border-primary/30',
  TE: 'bg-warning/15 text-warning border-warning/30',
  FLEX: 'bg-accent/15 text-accent border-accent/30',
  DEF: 'bg-muted text-muted-foreground border-border',
  K: 'bg-muted text-muted-foreground border-border',
};

export function PositionBadge({ position }: { position: string }) {
  const style = POSITION_STYLES[position] ?? 'bg-muted text-muted-foreground border-border';
  return (
    <Badge variant="outline" className={cn('border font-mono text-micro tracking-wide', style)}>
      {position}
    </Badge>
  );
}

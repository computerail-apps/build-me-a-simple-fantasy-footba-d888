import { Badge } from '@/lib/ui/Badge';
import { cn } from '@/lib/cn';

const POSITION_STYLES: Record<string, string> = {
  QB: 'border-transparent bg-destructive/15 text-destructive',
  RB: 'border-transparent bg-success/15 text-success',
  WR: 'border-transparent bg-primary/15 text-primary',
  TE: 'border-transparent bg-warning/15 text-warning',
  FLEX: 'border-transparent bg-accent/20 text-accent-foreground',
  DEF: 'border-transparent bg-muted text-muted-foreground',
  K: 'border-transparent bg-muted text-muted-foreground',
};

export function PositionBadge({ position, className }: { position: string; className?: string }) {
  const style = POSITION_STYLES[position] ?? 'border-transparent bg-muted text-muted-foreground';
  return (
    <Badge variant="outline" className={cn(style, 'font-mono text-micro', className)}>
      {position}
    </Badge>
  );
}

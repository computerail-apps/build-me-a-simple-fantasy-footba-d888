import { Badge } from '@/lib/ui/Badge';

type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive' | 'outline';

const variantMap: Record<string, BadgeVariant> = {
  QB: 'default',
  RB: 'success',
  WR: 'warning',
  TE: 'outline',
  FLEX: 'outline',
  DEF: 'destructive',
  DST: 'destructive',
  K: 'outline',
  BN: 'outline',
};

export function PositionBadge({ position }: { position: string }) {
  const variant = variantMap[position] ?? 'outline';
  return <Badge variant={variant}>{position}</Badge>;
}

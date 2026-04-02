import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'high' | 'medium' | 'low' | 'platform'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-bg-elevated text-text-secondary border border-border',
    high: 'bg-score-high/10 text-score-high border border-score-high/20',
    medium: 'bg-score-mid/10 text-score-mid border border-score-mid/20',
    low: 'bg-text-muted/10 text-text-secondary border border-border',
    platform: 'bg-bg-elevated text-text-primary border border-border',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-sm',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

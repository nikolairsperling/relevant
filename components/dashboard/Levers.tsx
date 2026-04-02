import type { Lever } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'
import { CATEGORY_LABELS, PRIORITY_LABELS } from '@/lib/utils'

interface LeversProps {
  levers: Lever[]
}

export function Levers({ levers }: LeversProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-text-muted uppercase tracking-widest mb-1">Was du zuerst ändern solltest</p>
        <p className="text-sm text-text-secondary">Nicht alles gleichzeitig. Beginne hier.</p>
      </div>

      <div className="space-y-3">
        {levers.map((lever, i) => (
          <div
            key={lever.id}
            className="border border-border rounded-lg bg-bg-surface p-5 space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="text-xs font-mono text-text-muted pt-0.5 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{lever.title}</p>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {lever.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-6">
              <Badge variant={lever.priority}>
                {PRIORITY_LABELS[lever.priority]}
              </Badge>
              <Badge variant="default">
                {CATEGORY_LABELS[lever.category]}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

'use client'

import type { CategoryScore } from '@/lib/types'
import { CATEGORY_LABELS } from '@/lib/utils'

interface ScoreBreakdownProps {
  scores: CategoryScore[]
}

export function ScoreBreakdown({ scores }: ScoreBreakdownProps) {
  return (
    <div className="border border-border rounded-lg bg-bg-surface p-6 space-y-4">
      <p className="text-xs text-text-muted uppercase tracking-widest">Score-Aufschlüsselung</p>
      <div className="space-y-3">
        {scores.map((s) => {
          const pct = (s.score / s.maxScore) * 100
          const color =
            pct >= 70
              ? 'bg-score-high'
              : pct >= 45
              ? 'bg-score-mid'
              : 'bg-score-low'

          return (
            <div key={s.category} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">
                  {CATEGORY_LABELS[s.category]}
                </span>
                <span className="text-xs font-medium text-text-primary">
                  {s.score}
                  <span className="text-text-muted">/{s.maxScore}</span>
                </span>
              </div>
              <div className="h-1 bg-bg-elevated rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-xs text-text-muted pt-1">
        Jeder Bereich zählt gleich. Relevanz ist kein Einzelproblem.
      </p>
    </div>
  )
}

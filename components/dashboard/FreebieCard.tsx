import type { FreebieAnalysis } from '@/lib/types'

interface FreebieCardProps {
  analysis: FreebieAnalysis
}

export function FreebieCard({ analysis }: FreebieCardProps) {
  const scoreColor =
    analysis.score >= 14
      ? 'text-score-high'
      : analysis.score >= 8
      ? 'text-score-mid'
      : 'text-score-low'

  return (
    <div className="border border-border rounded-lg bg-bg-surface p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted uppercase tracking-widest">
          Freebie-Bewertung
        </p>
        <span className={`text-sm font-semibold ${scoreColor}`}>
          {analysis.score}/20
        </span>
      </div>

      <p className="text-sm text-text-secondary leading-relaxed">
        {analysis.diagnosis}
      </p>

      {analysis.improvement && (
        <div className="space-y-3 pt-2 border-t border-border">
          <p className="text-xs text-text-muted uppercase tracking-widest">
            Empfehlung
          </p>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-text-muted mb-0.5">Titel</p>
              <p className="text-sm font-medium">{analysis.improvement.title}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-0.5">1-Satz-Pitch</p>
              <p className="text-sm text-text-secondary">
                {analysis.improvement.oneLiner}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-0.5">Bio-Copy</p>
              <p className="text-sm text-text-secondary font-mono text-xs bg-bg-elevated px-3 py-2 rounded">
                {analysis.improvement.bioCopy}
              </p>
            </div>
          </div>
        </div>
      )}

      {!analysis.hasExistingFreebie && !analysis.improvement && (
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-text-secondary">
            RELEVANT. kann dir ein passendes Freebie-Konzept vorschlagen.
          </p>
        </div>
      )}
    </div>
  )
}

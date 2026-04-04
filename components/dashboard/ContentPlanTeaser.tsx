'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const MOCK_PLAN = [
  { day: 'Mo', type: 'Reel', hook: 'Warum dein Content ignoriert wird', cta: 'Freebie', rest: false },
  { day: 'Di', type: 'Karussell', hook: 'Die 3 häufigsten Positionierungsfehler', cta: 'Kommentar', rest: false },
  { day: 'Mi', type: '—', hook: '—', cta: '—', rest: true },
  { day: 'Do', type: 'Reel', hook: 'Hook-Formel für deine Nische', cta: 'Freebie', rest: false },
  { day: 'Fr', type: 'Story-Serie', hook: 'Behind the Scenes: So entsteht Relevanz', cta: 'DM', rest: false },
  { day: 'Sa', type: 'Reel', hook: 'Diagnose: Was fehlt wirklich in deinem Profil?', cta: 'Link Bio', rest: false },
  { day: 'So', type: '—', hook: '—', cta: '—', rest: true },
]

interface ContentPlanTeaserProps {
  userPlan: string
}

export function ContentPlanTeaser({ userPlan }: ContentPlanTeaserProps) {
  const isLocked = userPlan === 'free'

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-text-muted uppercase tracking-widest mb-1">
            7-Tage Content-Plan
          </p>
          <p className="text-xs text-text-secondary">
            Basierend auf deiner Analyse. Wöchentlich neu generiert.
          </p>
        </div>
        {isLocked && (
          <Badge variant="default">ab Starter</Badge>
        )}
      </div>

      <div className="relative border border-border rounded-xl overflow-hidden">
        <div
          className={isLocked ? 'blur-sm pointer-events-none select-none' : ''}
          aria-hidden={isLocked}
        >
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-bg-surface">
                <th className="text-left px-4 py-3 text-text-muted font-medium w-12">Tag</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium w-28">Format</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium">Hook-Idee</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium w-24">CTA-Ziel</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PLAN.map((row) => (
                <tr
                  key={row.day}
                  className={`border-b border-border last:border-0 ${row.rest ? 'opacity-25' : ''}`}
                >
                  <td className="px-4 py-3 font-medium text-text-secondary">{row.day}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.type}</td>
                  <td className="px-4 py-3 text-text-primary">{row.hook}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.cta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg/70 backdrop-blur-[1px]">
            <p className="text-sm font-medium">7-Tage Content-Plan</p>
            <p className="text-xs text-text-secondary text-center max-w-xs">
              Wöchentlich neu generiert. Basierend auf deiner Analyse und deinen Plattformen.
            </p>
            <Button variant="primary" size="sm" asChild>
              <Link href="/konto/plan">Starter freischalten — ab 29 €</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

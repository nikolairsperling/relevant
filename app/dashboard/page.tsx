'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ScoreRing } from '@/components/ui/ScoreRing'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ScoreBreakdown } from '@/components/dashboard/ScoreBreakdown'
import { Levers } from '@/components/dashboard/Levers'
import { HookList } from '@/components/dashboard/HookList'
import { ScriptCard } from '@/components/dashboard/ScriptCard'
import { FreebieCard } from '@/components/dashboard/FreebieCard'
import { ContentPlanTeaser } from '@/components/dashboard/ContentPlanTeaser'
import { generateMockAnalysis, getScoreDiagnosis } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { AnalysisResult } from '@/lib/types'
import type { User } from '@supabase/supabase-js'

export default function DashboardPage() {
  const router = useRouter()
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isReal, setIsReal] = useState(false)
  const [userPlan, setUserPlan] = useState<string>('free')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null)
    })

    const stored = localStorage.getItem('relevant_analysis')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setAnalysis(parsed)
        setIsReal(true)
        fetch('/api/user/plan').then(r => r.ok ? r.json() : null).then(j => { if (j?.plan) setUserPlan(j.plan) })
        return
      } catch { }
    }

    fetch('/api/user/analysis').then(r => r.ok ? r.json() : null).then(j => {
      if (j?.analysis) {
        localStorage.setItem('relevant_analysis', JSON.stringify(j.analysis))
        setAnalysis(j.analysis)
        setIsReal(true)
        fetch('/api/user/plan').then(r => r.ok ? r.json() : null).then(p => { if (p?.plan) setUserPlan(p.plan) })
      } else {
        setAnalysis(generateMockAnalysis() as unknown as AnalysisResult)
        setIsReal(false)
      }
    }).catch(() => {
      setAnalysis(generateMockAnalysis() as unknown as AnalysisResult)
      setIsReal(false)
    })
  }, [])

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-t-white border-white/20 animate-spin" />
      </div>
    )
  }

  const diagnosis = getScoreDiagnosis(analysis.relevantScore)
  const emailInitial = user?.email?.[0]?.toUpperCase() ?? 'K'
  const isFree = userPlan === 'free'
  const isStarter = userPlan === 'starter'

  return (
    <div className="min-h-screen">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-widest uppercase">
            RELEVANT<span className="text-text-secondary">.</span>
          </Link>
          <div className="flex items-center gap-3">
            {!isReal && (
              <span className="text-xs text-text-muted border border-border rounded-sm px-2 py-0.5">
                Demo-Daten
              </span>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/onboarding">Neue Analyse</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/konto" title={user?.email ?? 'Konto'}>
                {user ? emailInitial : 'Konto'}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10 animate-in">
        {/* Score Hero */}
        <section className="border border-border rounded-xl bg-bg-surface p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="shrink-0">
              <ScoreRing score={analysis.relevantScore} size="lg" animated />
            </div>
            <div className="space-y-4 flex-1">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-widest mb-2">
                  Warum du aktuell ignoriert wirst
                </p>
                <p className="text-lg font-medium leading-relaxed max-w-xl">
                  {diagnosis}
                </p>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
                {analysis.diagnosis}
              </p>
            </div>
          </div>
        </section>

        {/* Score Breakdown */}
        <ScoreBreakdown scores={analysis.scores} />

        {/* Levers */}
        <section>
          <Levers levers={analysis.levers} />
        </section>

        {/* Hooks – plan-gated */}
        <section>
          <HookList hooks={analysis.hooks} userPlan={userPlan} />
        </section>

        {/* Content-Plan – locked for Free */}
        <ContentPlanTeaser userPlan={userPlan} />

        {/* Scripts – 1 visible, rest locked for Free */}
        <section className="space-y-4">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-widest mb-1">
              Reel-Skript
            </p>
            <p className="text-xs text-text-secondary">
              Kurz. Klar. Erwartungsgeführt.
            </p>
          </div>
          {analysis.scripts.map((script) => (
            <ScriptCard key={script.id} script={script} />
          ))}
          {isFree && (
            <div className="relative border border-border rounded-xl overflow-hidden">
              <div className="blur-sm pointer-events-none select-none p-5 space-y-3 bg-bg-surface" aria-hidden="true">
                <div className="flex gap-2">
                  <div className="h-5 w-20 bg-border rounded-sm" />
                  <div className="h-5 w-16 bg-border rounded-sm" />
                  <div className="h-5 w-12 bg-border rounded-sm" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-full bg-border rounded-sm" />
                  <div className="h-3 w-5/6 bg-border rounded-sm" />
                  <div className="h-3 w-4/6 bg-border rounded-sm" />
                </div>
                <div className="space-y-1.5 pt-2">
                  <div className="h-3 w-full bg-border rounded-sm" />
                  <div className="h-3 w-3/4 bg-border rounded-sm" />
                </div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg/70 backdrop-blur-[1px]">
                <p className="text-sm font-medium">6 Skripte / Monat</p>
                <p className="text-xs text-text-secondary text-center max-w-xs">
                  Jedes Skript auf Plattform, Format und Ziel optimiert.
                </p>
                <Button variant="primary" size="sm" asChild>
                  <Link href="/konto/plan">Starter freischalten — ab 29 €</Link>
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Freebie */}
        <FreebieCard analysis={analysis.freebieAnalysis} />

        {/* Weekly Check – locked for Free & Starter */}
        {(isFree || isStarter) && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-widest mb-1">
                  Wöchentlicher Relevant Check
                </p>
                <p className="text-xs text-text-secondary">
                  Dein Score wird wöchentlich neu berechnet und verglichen.
                </p>
              </div>
              <Badge variant="default">ab Pro</Badge>
            </div>
            <div className="relative border border-border rounded-xl overflow-hidden">
              <div className="blur-sm pointer-events-none select-none p-6 bg-bg-surface" aria-hidden="true">
                <div className="flex items-end gap-2 h-20">
                  {[38, 42, 41, 45, 47, 52, 48].map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-text-muted/30 rounded-sm"
                      style={{ height: `${v}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {['W1','W2','W3','W4','W5','W6','W7'].map(w => (
                    <span key={w} className="text-xs text-text-muted">{w}</span>
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-bg/70 backdrop-blur-[1px]">
                <p className="text-sm font-medium">Relevanz-Verlauf</p>
                <p className="text-xs text-text-secondary text-center max-w-xs">
                  Sieh wöchentlich wie sich dein Score entwickelt und wo du Boden verlierst.
                </p>
                <Button variant="primary" size="sm" asChild>
                  <Link href="/konto/plan">Pro freischalten — ab 79 €</Link>
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Bottom CTA – only for free users */}
        {isFree && (
          <section className="border border-border rounded-xl p-8 text-center space-y-4">
            <h2 className="text-xl font-semibold">Relevanz ist kein Einmal-Fix.</h2>
            <p className="text-sm text-text-secondary max-w-md mx-auto">
              Wer dauerhaft wahrgenommen werden will, braucht Struktur, Wiederholung und Anpassung. RELEVANT. begleitet diesen Prozess wöchentlich.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="primary" size="lg" asChild>
                <Link href="/konto/plan">Zugang freischalten</Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link href="/#preise">Pläne ansehen</Link>
              </Button>
            </div>
            <p className="text-xs text-text-muted">
              Monatlich kündbar. Kein Datenverlust.
            </p>
          </section>
        )}
      </main>
    </div>
  )
}

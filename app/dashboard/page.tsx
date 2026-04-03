'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ScoreRing } from '@/components/ui/ScoreRing'
import { Button } from '@/components/ui/Button'
import { ScoreBreakdown } from '@/components/dashboard/ScoreBreakdown'
import { Levers } from '@/components/dashboard/Levers'
import { HookList } from '@/components/dashboard/HookList'
import { ScriptCard } from '@/components/dashboard/ScriptCard'
import { FreebieCard } from '@/components/dashboard/FreebieCard'
import { generateMockAnalysis, getScoreDiagnosis } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { AnalysisResult } from '@/lib/types'
import type { User } from '@supabase/supabase-js'
export default function DashboardPage() {
  const router = useRouter()
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isReal, setIsReal] = useState(false)

  useEffect(() => {
    // Load user
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null)
    })

    // Load analysis – prefer real result from session
    const stored = localStorage.getItem('relevant_analysis')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setAnalysis(parsed)
        setIsReal(true)
        return
      } catch {
        // fall through to mock
      }
    }
    setAnalysis(generateMockAnalysis() as unknown as AnalysisResult)
    setIsReal(false)
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

  return (
    <div className="min-h-screen">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold tracking-widest uppercase"
          >
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

            {/* Ring */}
            <div className="shrink-0">
              <ScoreRing score={analysis.relevantScore} size="lg" animated />
            </div>

            {/* Info */}
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

        {/* Hooks */}
        <section>
          <HookList hooks={analysis.hooks} isLimited />
        </section>

        {/* Script */}
        <section className="space-y-4">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-widest mb-1">
              Reel-Skript
            </p>
            <p className="text-xs text-text-secondary">
              Kurz. Klar. Erwartungsgeføhrt.
            </p>
          </div>
          {analysis.scripts.map((script) => (
            <ScriptCard key={script.id} script={script} />
          ))}
        </section>

        {/* Freebie */}
        <FreebieCard analysis={analysis.freebieAnalysis} />

        {/* Upgrade CTA */}
        <section className="border border-border rounded-xl p-8 text-center space-y-4">
          <h2 className="text-xl font-semibold">Relevanz ist kein Einmal-Fix.</h2>
          <p className="text-sm text-text-secondary max-w-md mx-auto">
            Wer dauerhaft wahrgenommen werden will, braucht Struktur,
            Wiederholung und Anpassung. RELEVANT. begleitet diesen Prozess
            wöchentlich.
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
            Monatlich køndbar. Kein Datenverlust.
          </p>
        </section>
      </main>
    </div>
  )
}

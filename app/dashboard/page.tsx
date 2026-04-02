'use client'

import Link from 'next/link'
import { ScoreRing } from '@/components/ui/ScoreRing'
import { Button } from '@/components/ui/Button'
import { ScoreBreakdown } from '@/components/dashboard/ScoreBreakdown'
import { Levers } from '@/components/dashboard/Levers'
import { HookList } from '@/components/dashboard/HookList'
import { ScriptCard } from '@/components/dashboard/ScriptCard'
import { FreebieCard } from '@/components/dashboard/FreebieCard'
import { generateMockAnalysis, getScoreDiagnosis } from '@/lib/utils'

// Im echten System: aus Supabase laden via Server Component
// Für jetzt: Mock-Daten
const analysis = generateMockAnalysis()

export default function DashboardPage() {
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
            <Button variant="ghost" size="sm" asChild>
              <Link href="/onboarding">Neue Analyse</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Konto</Link>
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
                  {getScoreDiagnosis(analysis.relevantScore)}
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
              Kurz. Klar. Erwartungsgeführt.
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
              <Link href="/login">Zugang freischalten</Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link href="/#preise">Pläne ansehen</Link>
            </Button>
          </div>
          <p className="text-xs text-text-muted">
            Monatlich kündbar. Kein Datenverlust.
          </p>
        </section>
      </main>
    </div>
  )
}

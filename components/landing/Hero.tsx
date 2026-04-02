import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function Hero() {
  return (
    <section className="min-h-[92vh] flex flex-col items-center justify-center px-6 pt-20 pb-16">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 border border-border rounded-sm px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-score-high animate-pulse-slow" />
          <span className="text-xs text-text-secondary tracking-wide">
            Analyse- und Produktionssystem für Relevanz
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-semibold leading-[1.1] tracking-tight">
          Dein Content wird gesehen.{' '}
          <span className="text-text-secondary">
            Aber nicht ernst genommen.
          </span>
        </h1>

        {/* Subline */}
        <p className="text-base md:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
          RELEVANT. analysiert dein Profil und zeigt dir, warum Menschen nicht
          reagieren – und was du ändern musst.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="primary" size="lg" asChild>
            <Link href="/onboarding">Profil analysieren</Link>
          </Button>
          <Button variant="ghost" size="lg" asChild>
            <Link href="#produkt">Wie es funktioniert</Link>
          </Button>
        </div>

        {/* Trust */}
        <p className="text-xs text-text-muted">
          Keine Kreditkarte. Keine Verpflichtung.
        </p>
      </div>

      {/* Score Preview */}
      <div className="mt-16 w-full max-w-2xl mx-auto px-6">
        <div className="border border-border rounded-lg bg-bg-surface p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-muted uppercase tracking-widest mb-1">Relevant Score</p>
              <div className="text-4xl font-semibold">42<span className="text-text-muted text-xl font-normal"> / 100</span></div>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-muted mb-1">Diagnose</p>
              <p className="text-xs text-text-secondary max-w-[200px]">
                Dein Profil ist sichtbar. Aber nicht überzeugend.
              </p>
            </div>
          </div>
          {/* Score bars */}
          <div className="space-y-2 pt-2 border-t border-border">
            {[
              { label: 'Positionierung', score: 6, max: 20 },
              { label: 'Zielgruppe & Angebot', score: 8, max: 20 },
              { label: 'Hooks', score: 9, max: 20 },
              { label: 'Content-Struktur', score: 11, max: 20 },
              { label: 'Freebie & CTA', score: 8, max: 20 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xs text-text-muted w-32 shrink-0">{item.label}</span>
                <div className="flex-1 h-1 bg-bg-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white/20 rounded-full"
                    style={{ width: `${(item.score / item.max) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-text-secondary w-8 text-right">
                  {item.score}/{item.max}
                </span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-center text-xs text-text-muted mt-3">
          Beispiel-Analyse · Dein Score wird live berechnet
        </p>
      </div>
    </section>
  )
}

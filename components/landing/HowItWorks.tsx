import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Profil & Ziel erfassen',
      description:
        'Plattform, Rolle und Ziel angeben. Keine API-Zugänge. Kein automatisches Scraping. Du gibst an, wir analysieren.',
    },
    {
      number: '02',
      title: 'Relevant Score berechnen',
      description:
        'Fünf Bereiche. Klare Bewertung. Der Score zeigt, wo Relevanz verloren geht – und warum.',
    },
    {
      number: '03',
      title: 'Hebel priorisieren',
      description:
        'Nicht alles auf einmal. Die Top-5 Hebel nach Impact – damit du weißt, womit du anfängst.',
    },
    {
      number: '04',
      title: 'Assets ausgeben',
      description:
        'Personalisierte Hooks, Reel-Skripte und Freebie-Optimierung. Plattform-spezifisch. Umsetzbar.',
    },
  ]

  return (
    <section className="py-24 px-6 border-t border-border">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="space-y-4">
          <p className="text-xs text-text-muted uppercase tracking-widest">So funktioniert RELEVANT.</p>
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
            Diagnose. Priorität. Umsetzung.
          </h2>
        </div>

        <div className="space-y-0">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`flex gap-6 py-8 ${
                i < steps.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <div className="text-xs font-mono text-text-muted pt-0.5 w-6 shrink-0">
                {step.number}
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">{step.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4">
          <Button variant="primary" size="lg" asChild>
            <Link href="/onboarding">Analyse starten</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

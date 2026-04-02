import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { PRICING_TIERS } from '@/lib/utils'

export function Pricing() {
  return (
    <section className="py-24 px-6 border-t border-border" id="preise">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <p className="text-xs text-text-muted uppercase tracking-widest">Preise</p>
          <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
            Relevanz entsteht nicht einmal.
          </h2>
          <p className="text-text-secondary text-sm max-w-lg">
            Wer dauerhaft wahrgenommen werden will, braucht Struktur, Wiederholung und Anpassung.
            RELEVANT. begleitet diesen Prozess wöchentlich.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`border rounded-lg p-6 space-y-6 flex flex-col ${
                tier.id === 'pro'
                  ? 'border-white/30 bg-bg-elevated'
                  : 'border-border bg-bg-surface'
              }`}
            >
              {/* Header */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{tier.name}</p>
                  {tier.id === 'pro' && (
                    <span className="text-xs border border-white/20 px-2 py-0.5 rounded-sm text-white/70">
                      Empfohlen
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  {tier.price === 0 ? (
                    <span className="text-2xl font-semibold">Kostenlos</span>
                  ) : (
                    <>
                      <span className="text-2xl font-semibold">{tier.price} €</span>
                      <span className="text-xs text-text-muted">/ Monat</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-text-muted">{tier.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-2 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-xs text-text-secondary">
                    <span className="text-text-muted mt-0.5">—</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                variant={tier.id === 'pro' ? 'primary' : 'outline'}
                size="sm"
                className="w-full"
                asChild
              >
                <Link href={tier.price === 0 ? '/onboarding' : '/login'}>
                  {tier.price === 0 ? 'Kostenlos starten' : 'Zugang freischalten'}
                </Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="text-xs text-text-muted text-center">
          Monatlich kündbar. Kein Datenverlust. Kein Verkaufsdruck.
        </p>
      </div>
    </section>
  )
}

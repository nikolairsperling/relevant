'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { PRICING_TIERS } from '@/lib/utils'

export default function PlanPage() {
  const [currentPlan] = useState('free')

  return (
    <div className="min-h-screen">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/konto" className="text-sm text-text-secondary hover:text-white transition-colors">
            ← Zurück zum Konto
          </Link>
          <Link href="/" className="text-sm font-semibold tracking-widest uppercase">
            RELEVANT<span className="text-text-secondary">.</span>
          </Link>
          <div className="w-32" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10 animate-in">

        <div className="space-y-3">
          <p className="text-xs text-text-muted uppercase tracking-widest">Plan wählen</p>
          <h1 className="text-2xl font-semibold">Relevanz entsteht nicht einmal.</h1>
          <p className="text-sm text-text-secondary max-w-lg">
            Wähle den Plan, der zu deiner aktuellen Phase passt. Monatlich kündbar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRICING_TIERS.map((tier) => {
            const isActive = tier.id === currentPlan
            const isPro = tier.id === 'pro'

            return (
              <div
                key={tier.id}
                className={`border rounded-xl p-6 space-y-6 flex flex-col relative ${
                  isPro
                    ? 'border-white/30 bg-bg-elevated'
                    : isActive
                    ? 'border-border bg-bg-elevated'
                    : 'border-border bg-bg-surface'
                }`}
              >
                {isPro && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs border border-white/20 bg-bg-elevated px-3 py-0.5 rounded-full text-white/70 whitespace-nowrap">
                    Empfohlen
                  </span>
                )}
                {isActive && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs border border-border bg-bg-elevated px-3 py-0.5 rounded-full text-text-muted whitespace-nowrap">
                    Aktiv
                  </span>
                )}

                {/* Header */}
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{tier.name}</p>
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
                {isActive ? (
                  <div className="text-xs text-text-muted text-center py-2 border border-border rounded-md">
                    Dein aktueller Plan
                  </div>
                ) : tier.price === 0 ? (
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/onboarding">Kostenlos starten</Link>
                  </Button>
                ) : (
                  <Button
                    variant={isPro ? 'primary' : 'outline'}
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      // Stripe integration kommt bald
                      alert(`Plan "${tier.name}" – Zahlungsintegration kommt in Kürze. Schreib uns: hallo@relevant.app`)
                    }}
                  >
                    {tier.price} € / Monat
                  </Button>
                )}
              </div>
            )
          })}
        </div>

        <div className="text-center space-y-2">
          <p className="text-xs text-text-muted">
            Monatlich kündbar. Kein Datenverlust. Kein Verkaufsdruck.
          </p>
          <p className="text-xs text-text-muted">
            Fragen? Schreib uns:{' '}
            <a href="mailto:hallo@relevant.app" className="text-text-secondary hover:text-white transition-colors">
              hallo@relevant.app
            </a>
          </p>
        </div>

      </main>
    </div>
  )
}

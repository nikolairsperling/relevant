'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PRICING_TIERS } from '@/lib/utils'
import { CheckoutButton } from '@/components/stripe/CheckoutButton'
import { createClient } from '@/lib/supabase/client'

export default function PlanPage() {
  const [currentPlan, setCurrentPlan] = useState('free')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', data.user.id)
          .single()
        if (profile?.plan) setCurrentPlan(profile.plan)
      }
    })
  }, [])

  return (
    <div className="min-h-screen">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/konto" className="text-sm text-text-secondary hover:text-white transition-colors flex items-center gap-1">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRICING_TIERS.map((tier) => {
            const isActive = currentPlan === tier.id
            const isRecommended = tier.id === 'pro'

            return (
              <div
                key={tier.id}
                className={`relative rounded-xl border p-5 flex flex-col gap-4 ${
                  isActive
                    ? 'border-white bg-white/5'
                    : isRecommended
                    ? 'border-white/30 bg-white/3'
                    : 'border-border bg-surface'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs bg-white text-black px-2 py-0.5 rounded-full font-medium">
                    Aktiv
                  </span>
                )}
                {isRecommended && !isActive && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-medium">
                    Empfohlen
                  </span>
                )}

                <div>
                  <p className="text-sm font-medium text-text-secondary">{tier.name}</p>
                  <p className="text-2xl font-bold mt-1">
                    {tier.price === 0 ? 'Kostenlos' : `${tier.price} €`}
                    {tier.price > 0 && <span className="text-sm font-normal text-text-secondary"> / Monat</span>}
                  </p>
                  {tier.description && (
                    <p className="text-xs text-text-muted mt-1">{tier.description}</p>
                  )}
                </div>

                <ul className="space-y-1.5 flex-1">
                  {tier.features.map((f, i) => (
                    <li key={i} className="text-xs text-text-secondary flex items-start gap-1.5">
                      <span className="text-white/40 mt-0.5">—</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  {isActive ? (
                    <div className="w-full text-center text-sm text-text-muted py-2">
                      Dein aktueller Plan
                    </div>
                  ) : tier.id === 'free' ? (
                    <div className="w-full text-center text-sm text-text-muted py-2">
                      Kostenlos
                    </div>
                  ) : (
                    <CheckoutButton
                      plan={tier.id as 'starter' | 'pro' | 'agency'}
                      className="w-full bg-white text-black text-sm font-medium py-2 px-4 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
                    >
                      {tier.price} € / Monat
                    </CheckoutButton>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-center text-xs text-text-muted">
          Monatlich kündbar. Kein Datenverlust. Kein Verkaufsdruck.
          <br />
          Fragen? Schreib uns: <a href="mailto:hello@getrelevant.app" className="underline">hello@getrelevant.app</a>
        </p>

      </main>
    </div>
  )
}

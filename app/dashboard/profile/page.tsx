'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { PRICING_TIERS } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPlan, setCurrentPlan] = useState<string>('free')
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace('/login')
        return
      }
      setUser(data.user)
      try {
        const resp = await fetch('/api/user/plan')
        if (resp.ok) {
          const json = await resp.json()
          if (json.plan) setCurrentPlan(json.plan)
          if (json.subscription_status) setSubscriptionStatus(json.subscription_status)
        }
      } catch (e) {}
      setLoading(false)
    })
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 rounded-full border-2 border-t-white border-white/20 animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const currentTier = PRICING_TIERS.find((t) => t.id === currentPlan)
  const isPaid = currentPlan !== 'free'

  const joinedDate = new Date(user.created_at).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-6 animate-in">
      <div>
        <p className="text-xs text-text-muted uppercase tracking-widest">Dein Konto</p>
        <h1 className="text-2xl font-semibold mt-1">Profil</h1>
      </div>

      {/* Account Info */}
      <section className="border border-border rounded-xl bg-bg-surface p-6 space-y-5">
        <p className="text-xs text-text-muted uppercase tracking-widest">Kontodaten</p>
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs text-text-muted uppercase tracking-widest">E-Mail</p>
            <p className="text-sm font-medium">{user.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-text-muted uppercase tracking-widest">Mitglied seit</p>
            <p className="text-sm font-medium">{joinedDate}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-text-muted uppercase tracking-widest">Konto-ID</p>
            <p className="text-xs text-text-muted font-mono">{user.id.slice(0, 16)}…</p>
          </div>
        </div>
      </section>

      {/* Current Plan */}
      <section className="border border-border rounded-xl bg-bg-surface p-6 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-muted uppercase tracking-widest">Aktueller Plan</p>
          <div className="flex items-center gap-2">
            {isPaid && (
              <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-sm">
                Aktiv
              </span>
            )}
            <span className="text-xs border border-border px-2 py-0.5 rounded-sm text-text-muted">
              {currentTier?.name ?? 'Free'}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-base font-semibold">{currentTier?.name ?? 'Free'}</p>
          <p className="text-sm text-text-secondary">{currentTier?.description}</p>
        </div>
        <ul className="space-y-1.5">
          {currentTier?.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-text-muted mt-0.5">—</span>
              {f}
            </li>
          ))}
        </ul>
        <Button variant="primary" size="md" className="w-full" asChild>
          <Link href="/konto/plan">
            {isPaid ? 'Plan verwalten' : 'Plan upgraden'}
          </Link>
        </Button>
      </section>
    </div>
  )
}

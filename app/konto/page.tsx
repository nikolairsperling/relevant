'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { PRICING_TIERS } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'

export default function KontoPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace('/login')
      } else {
        setUser(data.user)
      }
      setLoading(false)
    })
  }, [router])

  const handleLogout = async () => {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-t-white border-white/20 animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const currentPlan = 'free'
  const currentTier = PRICING_TIERS.find((t) => t.id === currentPlan)
  const joinedDate = new Date(user.created_at).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen">
      {/* Topbar */}
      <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm font-semibold tracking-widest uppercase">
            RELEVANT<span className="text-text-secondary">.</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout} loading={loggingOut}>
            Abmelden
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-6 animate-in">

        {/* Profile Section */}
        <section className="border border-border rounded-xl bg-bg-surface p-6 space-y-5">
          <p className="text-xs text-text-muted uppercase tracking-widest">Dein Konto</p>

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
            <span className="text-xs border border-border px-2 py-0.5 rounded-sm text-text-muted">
              {currentTier?.name ?? 'Free'}
            </span>
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
            <Link href="/konto/plan">Plan upgraden</Link>
          </Button>
        </section>

        {/* Actions */}
        <section className="border border-border rounded-xl bg-bg-surface p-6 space-y-4">
          <p className="text-xs text-text-muted uppercase tracking-widest">Aktionen</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard">Zum Dashboard</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/onboarding">Neue Analyse starten</Link>
            </Button>
          </div>
        </section>

        {/* Logout Section */}
        <section className="border border-border rounded-xl bg-bg-surface p-6 space-y-4">
          <p className="text-xs text-text-muted uppercase tracking-widest">Sitzung</p>
          <p className="text-xs text-text-secondary">
            Du bist als <span className="text-text-primary">{user.email}</span> angemeldet.
          </p>
          <Button variant="ghost" size="sm" onClick={handleLogout} loading={loggingOut}>
            Jetzt abmelden
          </Button>
        </section>

      </main>
    </div>
  )
}

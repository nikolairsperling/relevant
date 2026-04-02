'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import type { User } from '@supabase/supabase-js'

export default function SettingsPage() {
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
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 rounded-full border-2 border-t-white border-white/20 animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="space-y-6 animate-in">
      <div>
        <p className="text-xs text-text-muted uppercase tracking-widest">Konto</p>
        <h1 className="text-2xl font-semibold mt-1">Einstellungen</h1>
      </div>

      {/* Login & Sicherheit */}
      <section className="border border-border rounded-xl bg-bg-surface p-6 space-y-4">
        <p className="text-xs text-text-muted uppercase tracking-widest">Login & Sicherheit</p>
        <div className="space-y-1">
          <p className="text-xs text-text-muted uppercase tracking-widest">Angemeldet als</p>
          <p className="text-sm font-medium">{user.email}</p>
        </div>
        <p className="text-xs text-text-secondary">
          RELEVANT. verwendet Magic Links – kein Passwort nötig. Du kannst dich juderzeit
          abmelden und mit deiner E-Mail erneut anmelden.
        </p>
        <Button variant="outline" size="sm" onClick={handleLogout} loading={loggingOut}>
          Jetzt abmelden
        </Button>
      </section>

      {/* Plan & Abonnement */}
      <section className="border border-border rounded-xl bg-bg-surface p-6 space-y-4">
        <p className="text-xs text-text-muted uppercase tracking-widest">Plan & Abonnement</p>
        <p className="text-sm text-text-secondary">
          Du nutzt aktuell den kostenlosen Plan. Upgrade für unbegrenzte Analysen,
          Hooks, Scripts und wöchentliche Reports.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="primary" size="sm" asChild>
            <Link href="/konto/plan">Plan upgraden</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/konto">Zur Kontoübersicht</Link>
          </Button>
        </div>
      </section>

      {/* Benachrichtigungen */}
      <section className="border border-border rounded-xl bg-bg-surface p-6 space-y-4">
        <p className="text-xs text-text-muted uppercase tracking-widest">Benachrichtigungen</p>
        <p className="text-sm text-text-secondary">
          E-Mail-Benachrichtigungen für neue Features und wöchentliche Analyse-Erinnerungen.
        </p>
        <p className="text-xs text-text-muted border border-border rounded-md px-3 py-2">
          Benachrichtigungseinstellungen kommen in der nächsten Version.
        </p>
      </section>

      {/* Daten */}
      <section className="border border-border rounded-xl bg-bg-surface p-6 space-y-4">
        <p className="text-xs text-text-muted uppercase tracking-widest">Deine Daten</p>
        <p className="text-sm text-text-secondary">
          RELEVANT. speichert keine Social-Media-Daten. Deine Analysen bleiben in deinem Browser
          (Session Storage) und werden nicht dauerhaft auf unseren Servern gespeichert.
        </p>
        <p className="text-xs text-text-muted">
          Fragen? Schreib uns:{' '}
          <a href="mailto:hallo@relevant.app" className="text-text-secondary hover:text-white transition-colors">
            hallo@relevant.app
          </a>
        </p>
      </section>
    </div>
  )
}

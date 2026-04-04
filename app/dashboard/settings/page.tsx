'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import type { User } from '@supabase/supabase-js'

const PLAN_LABELS: Record<string, string> = {
  free: 'Kostenloser Plan',
  starter: 'Starter',
  pro: 'Pro',
  agency: 'Agency',
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [plan, setPlan] = useState<string>('free')
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace('/login')
        return
      }
      setUser(data.user)
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan, subscription_status')
        .eq('id', data.user.id)
        .single()
      if (profile?.plan && profile?.subscription_status === 'active') {
        setPlan(profile.plan)
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
      <div className="flex items-center justify-center h-48">
        <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const isPaid = plan !== 'free'

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      <h1 className="text-xl font-bold tracking-wide">Einstellungen</h1>

      {/* Login & Sicherheit */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Login & Sicherheit</p>
        <div>
          <p className="text-xs text-zinc-500 mb-1">E-Mail-Adresse</p>
          <p className="text-sm text-white font-medium">{user?.email}</p>
        </div>
        <div className="bg-zinc-800 rounded-lg p-3">
          <p className="text-xs text-zinc-400">
            Du loggst dich per <span className="text-yellow-400">Magic Link</span> ein — kein Passwort nötig. Wir schicken dir einen Login-Link an deine E-Mail.
          </p>
        </div>
        <Button onClick={handleLogout} disabled={loggingOut} variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500">
          {loggingOut ? 'Abmelden…' : 'Abmelden'}
        </Button>
      </div>

      {/* Plan & Abonnement */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Plan & Abonnement</p>
        {isPaid ? (
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-300">
              Aktiver Plan: <span className="text-white font-semibold capitalize">{PLAN_LABELS[plan] ?? plan}</span>
            </p>
            <span className="text-xs bg-green-900/40 text-green-400 border border-green-800 px-2 py-0.5 rounded-full">Aktiv</span>
          </div>
        ) : (
          <p className="text-sm text-zinc-300">
            Du nutzt aktuell den <span className="text-white font-semibold">kostenlosen Plan</span>. Upgrade für unbegrenzte Analysen, Hooks, Scripts und wöchentliche Reports.
          </p>
        )}
        <Link href="/konto/plan">
          <Button className="w-full bg-white text-black hover:bg-zinc-100 font-semibold">
            {isPaid ? 'Plan verwalten' : 'Plan upgraden'}
          </Button>
        </Link>
        <Link href="/konto" className="block text-center text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          Zur Kontoübersicht
        </Link>
      </div>

      {/* Benachrichtigungen */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
        <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Benachrichtigungen</p>
        <p className="text-sm text-zinc-300">E-Mail-Benachrichtigungen für neue Features und wöchentliche Analyse-Erinnerungen.</p>
        <div className="bg-zinc-800 rounded-lg p-3">
          <p className="text-xs text-zinc-500">Benachrichtigungseinstellungen kommen in der nächsten Version.</p>
        </div>
      </div>

      {/* Deine Daten */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
        <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Deine Daten</p>
        <p className="text-sm text-zinc-300">
          RELEVANT. speichert keine Social-Media-Daten. Deine Analysen bleiben in deinem Browser (Session Storage) und werden nicht dauerhaft auf unseren Servern gespeichert.
        </p>
        <p className="text-xs text-zinc-500">
          Fragen? Schreib uns:{' '}
          <a href="mailto:hello@getrelevant.app" className="text-yellow-400 hover:underline">hello@getrelevant.app</a>
        </p>
        <div className="flex gap-4 pt-1">
          <Link href="/datenschutz" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Datenschutz</Link>
          <Link href="/impressum" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Impressum</Link>
          <Link href="/agb" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">AGB</Link>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError('Fehler beim Senden. Bitte versuche es erneut.')
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">

        <div className="space-y-2 text-center">
          <Link href="/" className="inline-block text-sm font-semibold tracking-widest uppercase mb-4">
            RELEVANT<span className="text-text-secondary">.</span>
          </Link>
          <h1 className="text-2xl font-semibold">
            {sent ? 'Prüfe deine E-Mail.' : 'Anmelden.'}
          </h1>
          <p className="text-sm text-text-secondary">
            {sent
              ? `Wir haben einen Link an ${email} gesendet.`
              : 'Kein Passwort. Ein Link reicht.'}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-text-muted uppercase tracking-widest">
                E-Mail-Adresse
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="deine@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg-surface border border-border rounded-md px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-text-secondary transition-colors"
              />
            </div>

            {error && (
              <p className="text-xs text-score-low">{error}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
            >
              Magic Link senden
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="border border-border rounded-lg p-4 text-center space-y-2">
              <p className="text-sm text-text-secondary">
                Klicke auf den Link in der E-Mail, um dich anzumelden.
              </p>
              <p className="text-xs text-text-muted">
                Kein Spam. Kein Passwort. Einmalig.
              </p>
            </div>
            <button
              onClick={() => { setSent(false); setEmail('') }}
              className="w-full text-xs text-text-muted hover:text-text-secondary transition-colors text-center"
            >
              Andere E-Mail verwenden
            </button>
          </div>
        )}

        <p className="text-center text-xs text-text-muted">
          Noch kein Konto?{' '}
          <Link href="/onboarding" className="text-text-secondary hover:text-white transition-colors">
            Kostenlose Analyse starten
          </Link>
        </p>
      </div>
    </div>
  )
}

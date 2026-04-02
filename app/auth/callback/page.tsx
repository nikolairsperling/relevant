'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const error = params.get('error')
      const errorDesc = params.get('error_description')
      const next = params.get('next') ?? '/dashboard'

      if (error) {
        const msg = errorDesc ? decodeURIComponent(errorDesc) : error
        router.replace('/login?error=' + encodeURIComponent(msg))
        return
      }

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        if (!exchangeError) {
          router.replace(next)
          return
        }
      }

      // Fallback: session already set (implicit flow via hash)
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace(next)
        return
      }

      router.replace('/login?error=Anmeldung+fehlgeschlagen')
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base">
      <div className="flex flex-col items-center gap-4">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <p className="text-text-secondary text-sm">Anmeldung wird verarbeitet...</p>
      </div>
    </div>
  )
}

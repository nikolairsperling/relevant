'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ADMIN_EMAIL = 'hello@kayuyimedia-marketing.com'

interface UserRow {
  id: string
  email: string
  plan: string | null
  subscription_status: string | null
  stripe_customer_id: string | null
  plan_expires_at: string | null
  created_at: string
}

const PLAN_COLORS: Record<string, string> = {
  starter: 'text-blue-400',
  pro: 'text-purple-400',
  agency: 'text-yellow-400',
  free: 'text-zinc-400',
}

export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user || data.user.email !== ADMIN_EMAIL) {
        router.replace('/dashboard')
        return
      }
      const resp = await fetch('/api/admin/users')
      if (!resp.ok) {
        setError('Fehler beim Laden der Nutzer')
        setLoading(false)
        return
      }
      const json = await resp.json()
      setUsers(json.users || [])
      setLoading(false)
    })
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-zinc-400 text-sm">Lade Nutzerdaten…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  const planCount = users.reduce((acc, u) => {
    const p = u.plan || 'free'
    acc[p] = (acc[p] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const activeCount = users.filter(u => u.subscription_status === 'active').length

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 max-w-6xl mx-auto">
      <div className="mb-10">
        <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Admin</p>
        <h1 className="text-2xl font-semibold tracking-tight">Nutzerübersicht</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-xs text-zinc-500 mb-1">Gesamt</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-xs text-zinc-500 mb-1">Aktive Abos</p>
          <p className="text-2xl font-bold text-green-400">{activeCount}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-xs text-zinc-500 mb-1">Pro</p>
          <p className="text-2xl font-bold text-purple-400">{planCount['pro'] || 0}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <p className="text-xs text-zinc-500 mb-1">Agency</p>
          <p className="text-2xl font-bold text-yellow-400">{planCount['agency'] || 0}</p>
        </div>
      </div>

      {/* Table */}
      <div className="border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="text-left px-4 py-3 text-xs text-zinc-500 uppercase tracking-widest font-medium">Email</th>
              <th className="text-left px-4 py-3 text-xs text-zinc-500 uppercase tracking-widest font-medium">Plan</th>
              <th className="text-left px-4 py-3 text-xs text-zinc-500 uppercase tracking-widest font-medium">Status</th>
              <th className="text-left px-4 py-3 text-xs text-zinc-500 uppercase tracking-widest font-medium">Läuft bis</th>
              <th className="text-left px-4 py-3 text-xs text-zinc-500 uppercase tracking-widest font-medium">Registriert</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} className={`border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors ${i % 2 === 0 ? '' : 'bg-zinc-900/10'}`}>
                <td className="px-4 py-3 text-zinc-300">{u.email || '—'}</td>
                <td className={`px-4 py-3 font-medium capitalize ${PLAN_COLORS[u.plan || 'free'] || 'text-zinc-400'}`}>
                  {u.plan || 'Free'}
                </td>
                <td className="px-4 py-3">
                  {u.subscription_status ? (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      u.subscription_status === 'active' 
                        ? 'bg-green-900/40 text-green-400 border border-green-800' 
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}>
                      {u.subscription_status}
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-600">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-500 text-xs">
                  {u.plan_expires_at ? new Date(u.plan_expires_at).toLocaleDateString('de-DE') : '—'}
                </td>
                <td className="px-4 py-3 text-zinc-500 text-xs">
                  {new Date(u.created_at).toLocaleDateString('de-DE')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center py-12 text-zinc-600 text-sm">Noch keine Nutzer</div>
        )}
      </div>
    </div>
  )
}
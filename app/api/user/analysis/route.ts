import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ analysis: null }, { status: 401 })

  const { data } = await supabase
    .from('profiles')
    .select('latest_analysis')
    .eq('id', user.id)
    .single()

  return NextResponse.json({ analysis: data?.latest_analysis ?? null })
}

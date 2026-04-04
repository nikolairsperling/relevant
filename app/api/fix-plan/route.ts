import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('token') !== 'fix-plan-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  // Find user
  const { data: users } = await supabase.auth.admin.listUsers()
  const adminUser = users?.users?.find((u: any) => u.email === 'hello@kayuyimedia-marketing.com')
  if (!adminUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Check current profile
  const { data: existing } = await supabase.from('profiles').select('*').eq('id', adminUser.id).single()

  // Direct UPDATE
  const { data: updated, error } = await supabase
    .from('profiles')
    .update({
      plan: 'agency',
      subscription_status: 'active',
      plan_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .eq('id', adminUser.id)
    .select()

  if (error) {
    // Try insert if profile doesn't exist
    const { data: inserted, error: insertErr } = await supabase
      .from('profiles')
      .insert({ id: adminUser.id, email: adminUser.email, plan: 'agency', subscription_status: 'active', plan_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() })
      .select()
    return NextResponse.json({ action: 'insert', result: inserted, error: insertErr?.message, existing })
  }

  return NextResponse.json({ action: 'update', result: updated, existing, userId: adminUser.id })
}
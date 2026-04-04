import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('token') !== 'setup-admin-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Find user by email and update their plan
  const { data: users } = await supabase.auth.admin.listUsers()
  const adminUser = users?.users?.find((u: any) => u.email === 'hello@kayuyimedia-marketing.com')
  
  if (!adminUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: adminUser.id,
      email: adminUser.email,
      plan: 'agency',
      subscription_status: 'active',
      plan_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .eq('id', adminUser.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, userId: adminUser.id, plan: 'agency' })
}
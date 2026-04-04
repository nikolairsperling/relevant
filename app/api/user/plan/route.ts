import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ plan: 'free', subscription_status: null })
  }

  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: profile } = await service
    .from('profiles')
    .select('plan, subscription_status, plan_expires_at')
    .eq('id', user.id)
    .single()

  return NextResponse.json({
    plan: profile?.plan ?? 'free',
    subscription_status: profile?.subscription_status ?? null,
    plan_expires_at: profile?.plan_expires_at ?? null,
  })
}
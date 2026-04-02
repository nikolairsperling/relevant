import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')
  const next = searchParams.get('next') ?? '/dashboard'

  if (error) {
    const msg = error_description ? decodeURIComponent(error_description) : error
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(msg)}`, origin)
    )
  }

  if (code) {
    // Create the redirect response first so we can attach cookies to it
    const redirectResponse = NextResponse.redirect(new URL(next, origin))

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.headers.get('cookie')?.split('; ').map((c) => {
              const [name, ...rest] = c.split('=')
              return { name: name.trim(), value: rest.join('=') }
            }) ?? []
          },
          setAll(cookiesToSet) {
            // Set cookies directly on the redirect response
            cookiesToSet.forEach(({ name, value, options }) => {
              redirectResponse.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (!exchangeError) {
      return redirectResponse
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth_failed', origin))
}

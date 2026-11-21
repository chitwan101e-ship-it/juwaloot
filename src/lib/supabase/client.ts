import { createBrowserClient } from '@supabase/ssr'

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  )
}

let realtimeAuthBound = false

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.'
    )
  }
  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Restored sessions fire INITIAL_SESSION, which does not authorize Realtime.
  // Without this, message and notification inserts never arrive until a later token refresh.
  if (typeof window !== 'undefined' && !realtimeAuthBound) {
    realtimeAuthBound = true
    const authorize = (token: string | undefined) => {
      if (token) void client.realtime.setAuth(token)
    }
    void client.auth.getSession().then(({ data }) => authorize(data.session?.access_token))
    client.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        authorize(session?.access_token)
      }
    })
  }

  return client
}

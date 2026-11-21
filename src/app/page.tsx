import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { resolveAuthenticatedPath } from '@/lib/authRouting'

export default async function HomePage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()) {
    redirect('/login')
  }
  const supabase = await createClient()
  const path = await resolveAuthenticatedPath(supabase)
  redirect(path ?? '/login')
}

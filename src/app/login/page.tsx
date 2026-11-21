'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'
import { finalizeSessionAfterSignIn, redirectIfAuthenticated } from '@/lib/authRouting'
import RelayLogo from '@/components/RelayLogo'
import { Loader2, Eye, EyeOff } from 'lucide-react'

const inp =
  'w-full px-3 py-2.5 border border-white/10 bg-[#132019] text-white placeholder:text-[#6f7896] rounded-lg text-sm focus:border-[#1fbf8a] focus:ring-4 focus:ring-[#1fbf8a]/20 focus:outline-none transition-all'

export default function LoginPage() {
  const router = useRouter()
  const configured = isSupabaseConfigured()
  const supabase = useMemo(() => (configured ? createClient() : null), [configured])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const q = new URLSearchParams(window.location.search)
    const err = q.get('error')
    if (err) setError(decodeURIComponent(err))
    if (q.get('reset') === 'ok') setInfo('Password updated. Sign in with your new password.')
  }, [])

  useEffect(() => {
    let cancelled = false
    if (!supabase) return
    void (async () => {
      if (cancelled) return
      await redirectIfAuthenticated(supabase, router)
    })()
    return () => {
      cancelled = true
    }
  }, [router, supabase])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!supabase) {
        throw new Error('Add your Supabase keys to .env.local, then restart the dev server.')
      }
      const identifier = email.trim()
      if (!identifier) {
        throw new Error('Enter your email or @username.')
      }

      const useStaffId = !identifier.includes('@')

      if (useStaffId) {
        const r = await fetch('/api/auth/staff-sign-in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ staffId: identifier, password }),
        })
        const j = (await r.json().catch(() => ({}))) as { error?: string }
        if (!r.ok) throw new Error(j.error || 'Sign in failed')
        await supabase.auth.getSession()
      } else {
        const { error: signErr } = await supabase.auth.signInWithPassword({
          email: identifier,
          password,
        })
        if (signErr) throw signErr
      }

      await finalizeSessionAfterSignIn(supabase, router)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relay-auth-frame h-dvh overflow-hidden bg-[#07140f] flex flex-col">
      <main className="flex-1 min-h-0 flex items-center justify-center p-4">
        <div className="relay-overlay-scroll bg-[#101c16]/95 rounded-3xl shadow-2xl border border-emerald-900/40 w-full max-w-lg max-h-full overflow-y-auto p-8">
          <div className="text-center mb-6">
            <RelayLogo size="lg" className="justify-center mb-2" />
            <p className="text-[#8ea89a] text-sm">Player support, rewards, and a direct line to the desk.</p>
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-[#14291f] text-[#7dffc3] text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#1fbf8a]" />
              The desk checks new players in
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-[#132019] p-1 flex">
              <span className="flex-1 text-center py-2.5 text-white font-semibold rounded-xl bg-gradient-to-r from-[#0e8f6a] to-[#c9a227]">Sign in</span>
              <Link href="/signup" className="flex-1 text-center py-2.5 text-[#8ea89a] font-semibold rounded-xl hover:text-white transition-colors">Join</Link>
            </div>
          </div>

          <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#7f8bad] uppercase tracking-wide mb-1.5">
                Email
              </label>
              <input
                type="text"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className={inp}
                required
              />
              <p className="text-[11px] text-[#5c647e] mt-1.5">
                Use your email and password. Desk staff can use an @username instead.
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#7f8bad] uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inp} pr-10`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7f8bad] hover:text-white"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!configured ? (
              <p className="text-amber-300 text-sm">
                Supabase keys are not in .env.local yet. The sign-in form is ready, and it will work after you paste them and restart.
              </p>
            ) : null}
            {error ? <p className="text-red-400 text-sm">{error}</p> : null}
            {info ? <p className="text-emerald-400/90 text-sm">{info}</p> : null}

            <div className="flex justify-end">
              <Link
                href={email.trim() ? `/reset-password?i=${encodeURIComponent(email.trim())}` : '/reset-password'}
                className="text-sm text-[#3dbe8a] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0e8f6a] to-[#c9a227] text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

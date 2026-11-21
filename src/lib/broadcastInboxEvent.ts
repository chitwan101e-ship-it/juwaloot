/** Push a live inbox event to browsers already subscribed to this business channel. */
export async function broadcastInboxEvent(
  businessId: string,
  event: 'customer_message' | 'staff_message',
  payload: Record<string, unknown>
): Promise<void> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!base || !key || !businessId) return

  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 2500)
  try {
    await fetch(`${base}/realtime/v1/api/broadcast`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            topic: `inbox-live-${businessId}`,
            event,
            payload,
            private: false,
          },
        ],
      }),
      signal: ctrl.signal,
    })
  } catch {
    // The sender's own socket broadcast is the fast path. This is the backup.
  } finally {
    clearTimeout(timer)
  }
}

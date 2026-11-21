/** Browser corner popups for new message alerts (no native app). */

const ENABLED_KEY = 'relay-desktop-notify-enabled'
const DISMISSED_KEY = 'relay-desktop-notify-dismissed'

export type DesktopNotifyPermission = 'unsupported' | 'default' | 'granted' | 'denied'

export function desktopNotifySupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function getDesktopNotifyPermission(): DesktopNotifyPermission {
  if (!desktopNotifySupported()) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  return 'default'
}

/** True when the browser allows corner popups (permission is enough — no extra toggle). */
export function isDesktopNotifyEnabled(): boolean {
  return getDesktopNotifyPermission() === 'granted'
}

export function setDesktopNotifyEnabled(on: boolean): void {
  if (typeof window === 'undefined') return
  if (on) {
    window.localStorage.setItem(ENABLED_KEY, '1')
    window.localStorage.removeItem(DISMISSED_KEY)
  } else {
    window.localStorage.removeItem(ENABLED_KEY)
  }
}

export function isDesktopNotifyPromptDismissed(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(DISMISSED_KEY) === '1'
}

export function dismissDesktopNotifyPrompt(): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(DISMISSED_KEY, '1')
}

export async function requestDesktopNotifyPermission(): Promise<DesktopNotifyPermission> {
  if (!desktopNotifySupported()) return 'unsupported'
  const result = await Notification.requestPermission()
  if (result === 'granted') {
    setDesktopNotifyEnabled(true)
    await showDesktopNotification({
      title: 'JuwaLoot alerts on',
      body: 'A corner popup will show for each new player message and signup request.',
      tag: `relay-alerts-on-${Date.now()}`,
    })
  }
  return result === 'granted' ? 'granted' : result === 'denied' ? 'denied' : 'default'
}

export type DesktopNotifyResult = {
  ok: boolean
  reason?: string
}

function desktopNotificationIcon(): string | undefined {
  return undefined
}

let notificationServiceWorker: Promise<ServiceWorkerRegistration | null> | null = null

function notificationServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return Promise.resolve(null)
  if (!notificationServiceWorker) {
    notificationServiceWorker = navigator.serviceWorker
      .register('/notify-sw.js')
      .then(() => navigator.serviceWorker.ready)
      .catch((err) => {
        console.warn('[desktop-notify] service worker failed', err)
        notificationServiceWorker = null
        return null
      })
  }
  return notificationServiceWorker
}

function createDesktopNotification(
  opts: {
    title: string
    body: string
    tag?: string
    onClick?: () => void
  },
  withIcon: boolean
): Notification | null {
  const options: NotificationOptions = {
    body: opts.body,
    tag: opts.tag,
    silent: false,
  }
  if (withIcon) {
    const icon = desktopNotificationIcon()
    if (icon) options.icon = icon
  }

  const n = new Notification(opts.title, options)
  n.onclick = () => {
    window.focus()
    n.close()
    opts.onClick?.()
  }
  return n
}

export async function showDesktopNotification(opts: {
  title: string
  body: string
  tag?: string
  onClick?: () => void
}): Promise<DesktopNotifyResult> {
  if (!desktopNotifySupported()) {
    return { ok: false, reason: 'This browser does not support desktop notifications.' }
  }
  if (Notification.permission === 'denied') {
    return {
      ok: false,
      reason: 'Notifications are blocked. Click the lock icon in the address bar, open Notifications, and choose Allow.',
    }
  }
  if (Notification.permission !== 'granted') {
    return { ok: false, reason: 'Click Enable message alerts first, then Allow in the browser prompt.' }
  }

  // new Notification() often does not draw a Windows corner banner while this tab is focused.
  // A service worker notification does.
  try {
    const registration = await notificationServiceWorkerRegistration()
    if (registration) {
      await registration.showNotification(opts.title, {
        body: opts.body,
        tag: opts.tag,
        silent: false,
        data: { href: window.location.href },
        ...(opts.tag ? { renotify: true } : {}),
      } as NotificationOptions)
      return { ok: true }
    }
  } catch (err) {
    console.warn('[desktop-notify] service worker notify failed', err)
  }

  try {
    createDesktopNotification(opts, false)
    return { ok: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[desktop-notify] show failed:', err)
    return {
      ok: false,
      reason: `Could not show alert (${msg}). In Windows Settings, allow notifications for Chrome or Edge.`,
    }
  }
}

export function sendTestDesktopNotification(): Promise<DesktopNotifyResult> {
  return showDesktopNotification({
    title: 'JuwaLoot test alert',
    body: 'Desktop alerts are working. New player messages will pop up like this.',
    tag: `relay-test-alert-${Date.now()}`,
  })
}

export function messagePreview(body: string, hasImage?: boolean): string {
  const t = body.trim()
  if (t) return t.length > 160 ? `${t.slice(0, 157)}…` : t
  return hasImage ? '📷 Image' : 'New message'
}

/** e.g. "James message" for staff desktop popups when a customer texts. */
export function customerMessagePopupTitle(
  senderLabel: string | null | undefined,
  fallback = 'New message'
): string {
  const trimmed = senderLabel?.trim()
  if (!trimmed) return fallback
  const first = trimmed.split(/\s+/)[0] || trimmed
  return `${first} message`
}

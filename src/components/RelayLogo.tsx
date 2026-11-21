import { useId } from 'react'
import clsx from 'clsx'

type RelayLogoProps = {
  theme?: 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
  showWordmark?: boolean
  /** Kept so existing headers can ask for the gold treatment. The mark is the same seal. */
  accent?: 'brand' | 'gold'
  className?: string
}

const sizeMap = {
  sm: {
    wrap: 'w-9 h-9 rounded-[10px]',
    word: 'text-lg',
  },
  md: {
    wrap: 'w-11 h-11 rounded-xl',
    word: 'text-[1.35rem]',
  },
  lg: {
    wrap: 'w-16 h-16 rounded-[1.15rem]',
    word: 'text-[1.85rem]',
  },
}

export default function RelayLogo({
  theme = 'dark',
  size = 'md',
  showWordmark = true,
  accent = 'brand',
  className,
}: RelayLogoProps) {
  const s = sizeMap[size]
  const isLight = theme === 'light'
  const goldWord = accent === 'gold' && !isLight
  const rawId = useId().replace(/:/g, '')
  const rimId = `${rawId}-rim`
  const faceId = `${rawId}-face`
  const metalId = `${rawId}-metal`

  return (
    <div className={clsx('inline-flex items-center gap-2.5', className)}>
      <div
        className={clsx(
          'relative flex shrink-0 items-center justify-center overflow-hidden shadow-[0_10px_22px_-16px_rgba(201,146,46,0.95)]',
          s.wrap
        )}
        style={{
          background: 'linear-gradient(155deg, #fff6d4 0%, #e7b84a 42%, #8a5a16 100%)',
        }}
        aria-hidden
      >
        <svg viewBox="0 0 48 48" className="h-[86%] w-[86%]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id={faceId} x1="10" y1="4" x2="40" y2="46" gradientUnits="userSpaceOnUse">
              <stop stopColor="#17362a" />
              <stop offset="1" stopColor="#07140f" />
            </linearGradient>
            <linearGradient id={rimId} x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff4cc" />
              <stop offset="0.48" stopColor="#e7b84a" />
              <stop offset="1" stopColor="#a87422" />
            </linearGradient>
            <linearGradient id={metalId} x1="16" y1="11" x2="34" y2="39" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff6d4" />
              <stop offset="0.42" stopColor="#f0c86a" />
              <stop offset="1" stopColor="#c9922e" />
            </linearGradient>
          </defs>
          <rect width="48" height="48" rx="11" fill={`url(#${faceId})`} />
          <rect x="1.15" y="1.15" width="45.7" height="45.7" rx="10" stroke={`url(#${rimId})`} strokeWidth="1.4" />
          <path
            d="M16.2 13.2H32.2V26.4C32.2 33.1 27 36.8 20.2 36.8"
            stroke={`url(#${metalId})`}
            strokeWidth="4.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showWordmark ? (
        <span
          className={clsx(
            'relay-wordmark font-extrabold leading-none tracking-[-0.035em]',
            s.word,
            goldWord && 'drop-shadow-[0_1px_0_rgba(0,0,0,0.25)]'
          )}
        >
          <span className={isLight ? 'text-slate-900' : 'text-white'}>Juwa</span>
          <span className={isLight ? 'text-[#0e8f6a]' : 'relay-gold-type'}>Loot</span>
        </span>
      ) : null}
    </div>
  )
}

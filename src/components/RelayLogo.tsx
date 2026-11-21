import clsx from 'clsx'

type RelayLogoProps = {
  theme?: 'dark' | 'light'
  size?: 'sm' | 'md' | 'lg'
  showWordmark?: boolean
  /** Gold wordmark and mark, matching the lucky-spin lobby. */
  accent?: 'brand' | 'gold'
  className?: string
}

const sizeMap = {
  sm: {
    wrap: 'w-9 h-9 rounded-xl',
    mark: 'w-5 h-5',
    word: 'text-lg',
  },
  md: {
    wrap: 'w-11 h-11 rounded-2xl',
    mark: 'w-6 h-6',
    word: 'text-[1.35rem]',
  },
  lg: {
    wrap: 'w-16 h-16 rounded-[1.25rem]',
    mark: 'w-9 h-9',
    word: 'text-3xl',
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
  const gold = accent === 'gold' && !isLight

  return (
    <div className={clsx('inline-flex items-center gap-2.5', className)}>
      <div
        className={clsx(
          'relative flex items-center justify-center',
          gold
            ? 'shadow-[0_16px_35px_-18px_rgba(201,146,46,0.85)]'
            : 'shadow-[0_16px_35px_-18px_rgba(14,143,106,0.75)]',
          s.wrap
        )}
        style={{
          background: gold
            ? 'linear-gradient(145deg, #fff6d4 0%, #e7b84a 46%, #a87422 100%)'
            : isLight
              ? 'linear-gradient(145deg, #d9ffe9 0%, #1fbf8a 42%, #0c6b4d 100%)'
              : 'linear-gradient(145deg, #7dffc3 0%, #12a36e 46%, #c9a227 100%)',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          className={clsx(s.mark, gold || isLight ? 'text-[#123024]' : 'text-[#06281c]')}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M12 3.2L19.2 8.2L12 20.8L4.8 8.2L12 3.2Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M4.8 8.2H19.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12 3.2L9.4 8.2L12 20.8L14.6 8.2L12 3.2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </div>

      {showWordmark ? (
        <span
          className={clsx(
            'relay-wordmark font-extrabold leading-none',
            s.word,
            gold
              ? 'relay-gold-type inline-block tracking-[0.01em]'
              : isLight
                ? 'tracking-tight text-slate-900'
                : 'tracking-tight text-white'
          )}
        >
          JuwaLoot
        </span>
      ) : null}
    </div>
  )
}

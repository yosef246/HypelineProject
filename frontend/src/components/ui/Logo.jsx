export function Logo({ className = 'h-8' }) {
  return (
    <svg className={className} viewBox="0 0 320 80" xmlns="http://www.w3.org/2000/svg" fill="none">
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <g transform="translate(8, 12)">
        <rect width="56" height="56" rx="16" fill="url(#logo-grad)" />
        <path d="M18 18 L18 38 M18 28 L30 28 M30 18 L30 38" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="42" cy="20" r="4" fill="white" />
        <path d="M38 32 L42 24 L46 32 L42 40 Z" fill="white" />
      </g>
      <text x="80" y="52" fontFamily="Heebo, system-ui, sans-serif" fontSize="34" fontWeight="800" fill="currentColor" letterSpacing="-1">Hypeline</text>
    </svg>
  );
}

export function LogoMark({ className = 'h-10 w-10' }) {
  return (
    <svg className={className} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mark-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="url(#mark-grad)" />
      <path d="M20 18 L20 46 M20 32 L34 32 M34 18 L34 46" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="46" cy="20" r="4" fill="white" />
      <path d="M42 36 L46 28 L50 36 L46 44 Z" fill="white" />
    </svg>
  );
}

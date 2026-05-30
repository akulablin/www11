export function TunaLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body */}
      <ellipse cx="32" cy="32" rx="24" ry="14" className="fill-primary" />
      
      {/* Tail */}
      <path
        d="M8 32 L2 22 Q6 32 2 42 Z"
        className="fill-tuna-cyan"
      />
      
      {/* Dorsal fin */}
      <path
        d="M28 18 Q32 8 36 18"
        className="stroke-tuna-cyan"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Eye */}
      <circle cx="46" cy="30" r="4" className="fill-background" />
      <circle cx="47" cy="29" r="2" className="fill-foreground" />
      
      {/* Gill */}
      <path
        d="M40 26 Q38 32 40 38"
        className="stroke-tuna-cyan"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Belly shine */}
      <ellipse cx="30" cy="38" rx="12" ry="4" className="fill-secondary opacity-50" />
      
      {/* Side fin */}
      <path
        d="M36 38 L42 46 L32 42 Z"
        className="fill-tuna-cyan opacity-70"
      />
    </svg>
  )
}

export function TunaIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="12" cy="12" rx="9" ry="5" className="fill-current" />
      <path d="M3 12 L1 8 Q2.5 12 1 16 Z" className="fill-current" />
      <circle cx="17" cy="11" r="1.5" className="fill-background" />
    </svg>
  )
}

export function SubraLogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 140"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Blue top chevron */}
      <path
        d="M10 20 L45 20 L70 50 L35 50 Z"
        fill="#2563EB"
      />
      {/* Green middle-bottom chevron */}
      <path
        d="M30 70 L65 70 L90 100 L90 120 L55 120 L30 90 Z"
        fill="#10B981"
      />
      {/* Blue connector */}
      <path
        d="M35 50 L55 70 L30 70 L10 50 Z"
        fill="#2563EB"
      />
    </svg>
  );
}

export function SubraLogoText({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <SubraLogo className="w-12 h-12 -mr-2" />
      <span className="text-5xl font-bold tracking-tighter text-gray-900">UBRA</span>
    </div>
  );
}

export function SubraLogoTextLarge({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <SubraLogo className="w-24 h-24 md:w-32 md:h-32 -mr-4" />
      <span className="text-8xl md:text-9xl font-bold tracking-tighter text-gray-900">UBRA</span>
    </div>
  );
}

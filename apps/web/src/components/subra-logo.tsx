export function SubraLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Blue top part */}
      <path
        d="M50 40 L120 40 L140 70 L100 70 L80 100 L50 100 Z"
        fill="#2563EB"
      />
      {/* Green bottom part */}
      <path
        d="M80 100 L150 100 L150 130 L120 160 L50 160 L50 130 Z"
        fill="#10B981"
      />
    </svg>
  );
}


// Original SVG art. WHY SVG: sharp on any screen, tiny, no copyright, no network.
type P = { className?: string };

export function CafeteriaArt({ className = "" }: P) {
  return (
    <svg viewBox="0 0 200 140" className={className} role="img" aria-label="Cafeteria illustration">
      <rect width="200" height="140" fill="#FEF3C7" />
      <ellipse cx="100" cy="112" rx="62" ry="9" fill="#F59E0B" opacity=".25" />
      <circle cx="100" cy="74" r="38" fill="#fff" stroke="#F59E0B" strokeWidth="4" />
      <circle cx="100" cy="74" r="24" fill="#FDE68A" />
      <path d="M88 68c4-8 20-8 24 0" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M40 38v46M34 38v14a6 6 0 0 0 12 0V38" stroke="#B45309" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M160 38c-8 10-8 24 0 30v18" stroke="#B45309" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M90 22c-4 6 4 8 0 14M106 18c-4 6 4 8 0 14" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".6" />
    </svg>
  );
}

export function LibraryArt({ className = "" }: P) {
  const top = [
    [38, 14, 34, "#0EA5E9"], [54, 12, 28, "#6366F1"], [68, 16, 38, "#F59E0B"], [86, 12, 30, "#10B981"],
    [100, 14, 36, "#EF4444"], [116, 12, 26, "#0EA5E9"], [130, 16, 34, "#8B5CF6"],
  ] as const;
  const bottom = [
    [38, 16, 32, "#EF4444"], [56, 12, 38, "#10B981"], [70, 14, 28, "#8B5CF6"], [86, 16, 36, "#0EA5E9"],
    [104, 12, 30, "#F59E0B"], [118, 14, 36, "#6366F1"], [134, 12, 26, "#EF4444"],
  ] as const;
  return (
    <svg viewBox="0 0 200 140" className={className} role="img" aria-label="Library illustration">
      <rect width="200" height="140" fill="#E0F2FE" />
      <rect x="30" y="14" width="140" height="116" rx="6" fill="#fff" stroke="#0369A1" strokeWidth="3" />
      {top.map(([x, w, h, c]) => <rect key={`t${x}`} x={x} y={62 - h} width={w} height={h} rx="2" fill={c} />)}
      <rect x="30" y="62" width="140" height="6" fill="#0369A1" />
      {bottom.map(([x, w, h, c]) => <rect key={`b${x}`} x={x} y={112 - h} width={w} height={h} rx="2" fill={c} />)}
      <rect x="30" y="112" width="140" height="6" fill="#0369A1" />
    </svg>
  );
}

export function ItArt({ className = "" }: P) {
  return (
    <svg viewBox="0 0 200 140" className={className} role="img" aria-label="IT lab illustration">
      <rect width="200" height="140" fill="#EDE9FE" />
      <rect x="48" y="18" width="104" height="68" rx="8" fill="#4C1D95" />
      <rect x="55" y="25" width="90" height="54" rx="4" fill="#C4B5FD" />
      <path d="M66 40h40M66 52h58M66 64h28" stroke="#6D28D9" strokeWidth="4" strokeLinecap="round" />
      <path d="M118 36a14 14 0 0 1 18 0M122 42a8 8 0 0 1 10 0" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
      <rect x="94" y="86" width="12" height="14" fill="#4C1D95" />
      <rect x="76" y="100" width="48" height="6" rx="3" fill="#4C1D95" />
      <rect x="54" y="114" width="92" height="14" rx="5" fill="#7C3AED" opacity=".55" />
    </svg>
  );
}

export function TeachingArt({ className = "" }: P) {
  return (
    <svg viewBox="0 0 200 140" className={className} role="img" aria-label="Classroom illustration">
      <rect width="200" height="140" fill="#D1FAE5" />
      <rect x="26" y="16" width="148" height="86" rx="8" fill="#92400E" />
      <rect x="32" y="22" width="136" height="74" rx="4" fill="#065F46" />
      <path d="M46 42h58M46 56h80M46 70h40" stroke="#ECFDF5" strokeWidth="4" strokeLinecap="round" />
      <rect x="128" y="64" width="10" height="22" rx="2" fill="#34D399" />
      <rect x="142" y="52" width="10" height="34" rx="2" fill="#6EE7B7" />
      <rect x="156" y="42" width="8" height="44" rx="2" fill="#A7F3D0" />
      <path d="M60 102v26M140 102v26" stroke="#92400E" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

// Large campus picture for the banner and the login side panel
export function HeroArt({ className = "" }: P) {
  return (
    <svg viewBox="0 0 400 240" className={className} role="img" aria-label="Campus illustration">
      <defs>
        <linearGradient id="campus-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E0E7FF" />
          <stop offset="1" stopColor="#F0F9FF" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="20" fill="url(#campus-sky)" />
      <circle cx="338" cy="48" r="24" fill="#FDE68A" />
      <rect y="192" width="400" height="48" fill="#C7D2FE" />
      <path d="M182 240l14-48h8l14 48z" fill="#E0E7FF" />
      <path d="M96 114L200 62l104 52z" fill="#4F46E5" />
      <rect x="112" y="114" width="176" height="78" fill="#fff" stroke="#6366F1" strokeWidth="3" />
      {[128, 156, 232, 260].map((x) => <rect key={x} x={x} y="126" width="12" height="66" rx="2" fill="#C7D2FE" />)}
      <rect x="186" y="148" width="28" height="44" rx="4" fill="#4338CA" />
      <path d="M200 62V34" stroke="#4338CA" strokeWidth="3" />
      <path d="M200 34h22l-6 7 6 7h-22z" fill="#EF4444" />
      <circle cx="58" cy="172" r="22" fill="#34D399" />
      <rect x="55" y="184" width="6" height="12" fill="#92400E" />
      <circle cx="350" cy="176" r="18" fill="#6EE7B7" />
      <rect x="347" y="186" width="6" height="12" fill="#92400E" />
      <rect x="22" y="34" width="116" height="46" rx="12" fill="#fff" stroke="#6366F1" strokeWidth="2.5" />
      <circle cx="46" cy="57" r="12" fill="#10B981" />
      <path d="M40 57l5 5 9-10" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M66 50h56M66 62h38" stroke="#C7D2FE" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

// Small picture for "no complaints yet" screens
export function EmptyArt({ className = "" }: P) {
  return (
    <svg viewBox="0 0 120 100" className={className} role="img" aria-label="Nothing here yet">
      <ellipse cx="60" cy="88" rx="36" ry="6" fill="#E0E7FF" />
      <rect x="30" y="14" width="60" height="70" rx="8" fill="#fff" stroke="#6366F1" strokeWidth="3" />
      <rect x="48" y="8" width="24" height="12" rx="4" fill="#6366F1" />
      <path d="M42 40h36M42 52h36M42 64h20" stroke="#C7D2FE" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
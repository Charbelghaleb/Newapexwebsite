interface FlameLogoProps {
  size?: number;
  className?: string;
}

export default function FlameLogo({ size = 48, className = "" }: FlameLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Apex Prometheus flame logo"
    >
      <defs>
        <linearGradient id="flameGrad1" x1="50" y1="95" x2="50" y2="5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff2200" />
          <stop offset="25%" stopColor="#ff6b00" />
          <stop offset="55%" stopColor="#ffaa00" />
          <stop offset="85%" stopColor="#00e5ff" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="flameGrad2" x1="50" y1="90" x2="50" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c44200" />
          <stop offset="50%" stopColor="#ff6b00" />
          <stop offset="100%" stopColor="#ffaa00" />
        </linearGradient>
        <linearGradient id="circuitGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00e5ff" />
          <stop offset="100%" stopColor="#ff6b00" />
        </linearGradient>
        <filter id="flameGlow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Outer flame */}
      <path
        d="M50 5 C50 5,18 38,18 62 C18 82,32 95,50 95 C68 95,82 82,82 62 C82 38,50 5,50 5Z"
        stroke="url(#flameGrad1)"
        strokeWidth="2"
        fill="none"
        opacity="0.7"
        filter="url(#flameGlow)"
      >
        <animate
          attributeName="d"
          values="M50 5 C50 5,18 38,18 62 C18 82,32 95,50 95 C68 95,82 82,82 62 C82 38,50 5,50 5Z;M50 3 C50 3,16 36,16 60 C16 81,31 97,50 97 C69 97,84 81,84 60 C84 36,50 3,50 3Z;M50 5 C50 5,18 38,18 62 C18 82,32 95,50 95 C68 95,82 82,82 62 C82 38,50 5,50 5Z"
          dur="4s"
          repeatCount="indefinite"
        />
      </path>
      {/* Inner flame */}
      <path
        d="M50 22 C50 22,28 48,28 65 C28 80,38 90,50 90 C62 90,72 80,72 65 C72 48,50 22,50 22Z"
        stroke="url(#flameGrad2)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      >
        <animate
          attributeName="d"
          values="M50 22 C50 22,28 48,28 65 C28 80,38 90,50 90 C62 90,72 80,72 65 C72 48,50 22,50 22Z;M50 20 C50 20,26 46,26 63 C26 79,37 92,50 92 C63 92,74 79,74 63 C74 46,50 20,50 20Z;M50 22 C50 22,28 48,28 65 C28 80,38 90,50 90 C62 90,72 80,72 65 C72 48,50 22,50 22Z"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>
      {/* Central data line */}
      <path
        d="M50 88 L50 30"
        stroke="url(#circuitGrad)"
        strokeWidth="1.5"
        opacity="0.6"
        filter="url(#flameGlow)"
        strokeDasharray="5 3"
      >
        <animate attributeName="stroke-dashoffset" values="0;-48" dur="2s" repeatCount="indefinite" />
      </path>
      {/* Left branch */}
      <path
        d="M50 75 L38 70 L32 60"
        stroke="url(#circuitGrad)"
        strokeWidth="1"
        opacity="0.4"
        strokeDasharray="4 3"
      >
        <animate attributeName="stroke-dashoffset" values="0;-42" dur="3s" repeatCount="indefinite" />
      </path>
      {/* Right branch */}
      <path
        d="M50 75 L62 70 L68 60"
        stroke="url(#circuitGrad)"
        strokeWidth="1"
        opacity="0.4"
        strokeDasharray="4 3"
      >
        <animate attributeName="stroke-dashoffset" values="0;42" dur="3s" repeatCount="indefinite" />
      </path>
      {/* Data nodes */}
      <circle cx="50" cy="88" r="2.5" fill="#ff6b00" opacity="0.7">
        <animate attributeName="opacity" values=".7;.3;.7" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="50" cy="30" r="3" fill="#00e5ff" opacity="0.8" filter="url(#flameGlow)">
        <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values=".8;.4;.8" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Traveling data pulse */}
      <circle r="2" fill="#00e5ff" filter="url(#flameGlow)">
        <animateMotion path="M50,88 L50,70 L50,50 L50,30" dur="2.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;.3;1;0" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

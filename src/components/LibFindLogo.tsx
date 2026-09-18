import React from 'react';

interface LibFindLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  textColor?: string;
}

export const LibFindLogo: React.FC<LibFindLogoProps> = ({
  className = '',
  size = 'md',
  withText = false,
  textColor = 'text-on-surface',
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className={`relative ${sizeMap[size]} shrink-0 flex items-center justify-center`}>
        {/* Crisp vector recreation of the Stitch LibFind logo emblem (Image 5 & 6) */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Rounded Dark Indigo Badge Container */}
          <rect
            x="2"
            y="2"
            width="96"
            height="96"
            rx="26"
            fill="#0b1326"
            stroke="#1d2948"
            strokeWidth="3"
          />
          
          {/* Soft Beacon Aura */}
          <circle cx="50" cy="24" r="16" fill="#f59e0b" fillOpacity="0.25" filter="blur(4px)" />
          
          {/* Beacon Ray Marks */}
          <line x1="50" y1="12" x2="50" y2="17" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
          <line x1="39" y1="24" x2="44" y2="24" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
          <line x1="56" y1="24" x2="61" y2="24" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="24" r="7" fill="#f59e0b" />

          {/* Book Spine / Central Stalk */}
          <rect x="48" y="30" width="4" height="36" rx="2" fill="#ffffff" />

          {/* Left Book Page (Blue/Purple Gradient) */}
          <path
            d="M 48 35 C 38 34, 28 36, 22 38 L 22 66 C 28 64, 38 62, 48 64 Z"
            fill="url(#leftPageGrad)"
          />
          {/* Right Book Page */}
          <path
            d="M 52 35 C 62 34, 72 36, 78 38 L 78 66 C 72 64, 62 62, 52 64 Z"
            fill="url(#rightPageGrad)"
          />

          {/* Bookmark Ribbon */}
          <path
            d="M 64 63 L 74 63 L 74 74 L 69 70 L 64 74 Z"
            fill="#f43f5e"
          />

          <defs>
            <linearGradient id="leftPageGrad" x1="22" y1="35" x2="48" y2="66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" />
              <stop offset="1" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="rightPageGrad" x1="52" y1="35" x2="78" y2="66" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4f46e5" />
              <stop offset="1" stopColor="#2563eb" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {withText && (
        <div className="flex flex-col">
          <span className={`font-headline-sm text-lg font-bold tracking-tight leading-none ${textColor}`}>
            LibFind
          </span>
          <span className="font-caption text-[11px] font-semibold text-primary tracking-wider uppercase">
            Stacks v2.4
          </span>
        </div>
      )}
    </div>
  );
};

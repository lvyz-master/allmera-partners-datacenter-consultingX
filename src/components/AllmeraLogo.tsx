import React from 'react';

interface AllmeraLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: 'dark' | 'light';
  className?: string;
}

export const AllmeraLogo: React.FC<AllmeraLogoProps> = ({
  size = 'md',
  showText = true,
  textColor = 'dark',
  className = '',
}) => {
  // Dimensions for emblem
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
  };

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
    xl: 'text-xs sm:text-sm',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {/* Elegant Green "A" Emblem */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-b from-white to-emerald-50/40 p-1 border border-emerald-600/20 shadow-xs hover:border-emerald-500/40 transition-all shrink-0`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Primary rich emerald gradient */}
            <linearGradient id="allmeraGreenGrad" x1="15%" y1="0%" x2="85%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Accent light emerald / mint highlight */}
            <linearGradient id="allmeraHighlight" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Deep forest shadow for dimension */}
            <linearGradient id="allmeraDeepGreen" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="100%" stopColor="#064E3B" />
            </linearGradient>
          </defs>

          {/* Background subtle micro-ring */}
          <circle
            cx="50"
            cy="50"
            r="44"
            stroke="#059669"
            strokeWidth="1.5"
            strokeDasharray="2 3"
            strokeOpacity="0.25"
          />

          {/* Elegant Architectural "A" Monogram */}
          {/* Left sweeping ascending stroke */}
          <path
            d="M 23 80 L 46 19 C 47.5 15.5 52.5 15.5 54 19 L 77 80 C 78 82.5 76 85 73 85 C 70.5 85 68.5 83.5 67.5 81 L 59 58 L 33 58 L 27.5 81 C 26.5 83.5 24.5 85 22 85 C 19 85 17 82.5 18 80 Z"
            fill="url(#allmeraGreenGrad)"
          />

          {/* Left bevel highlight creating refined 3D facet */}
          <path
            d="M 50 17 L 23 80 C 20 83 23 85 26 83 L 50 25 Z"
            fill="url(#allmeraHighlight)"
            opacity="0.85"
          />

          {/* Right architectural shadow facet */}
          <path
            d="M 50 17 L 77 80 C 80 83 77 85 74 83 L 50 25 Z"
            fill="url(#allmeraDeepGreen)"
            opacity="0.45"
          />

          {/* Refined Emerald Crossbar with Precision Apex Diamond */}
          <path
            d="M 33 58 L 67 58 L 64 52 L 36 52 Z"
            fill="url(#allmeraGreenGrad)"
          />
          <path
            d="M 36 55 L 64 55"
            stroke="#34D399"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Crown Jewel: Modern Data & Energy Nexus Diamond at the A's inner space */}
          <polygon
            points="50,33 55,42 50,51 45,42"
            fill="#10B981"
            className="animate-pulse"
          />
          <circle cx="50" cy="42" r="2" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-display ${titleSizes[size]} font-bold tracking-tight ${
                textColor === 'light' ? 'text-white' : 'text-slate-900'
              }`}
            >
              ALLMERA
            </span>
            <span
              className={`font-display text-[11px] sm:text-xs font-semibold tracking-widest uppercase ${
                textColor === 'light' ? 'text-emerald-400' : 'text-emerald-700'
              }`}
            >
              PARTNERS
            </span>
          </div>
          <span
            className={`${subSizes[size]} font-medium tracking-[0.18em] uppercase ${
              textColor === 'light' ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Data Center Consulting
          </span>
        </div>
      )}
    </div>
  );
};

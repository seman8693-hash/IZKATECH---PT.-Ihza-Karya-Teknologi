import React from 'react';

interface LogoProps {
  className?: string;
  showSubtitle?: boolean;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'cyan-gold' | 'white-cyan';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  showSubtitle = true,
  showText = true,
  size = 'md',
  variant = 'cyan-gold'
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-18 h-18 sm:w-20 sm:h-20'
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-3xl sm:text-4xl'
  };

  const subtitleSizes = {
    sm: 'text-[9px] tracking-wider',
    md: 'text-[10px] tracking-widest',
    lg: 'text-xs tracking-widest',
    xl: 'text-xs sm:text-sm tracking-widest'
  };

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* Precision SVG Logo reproduction of the IZKATECH sphere and orbit waves */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_16px_rgba(6,182,212,0.45)]">
          {/* Background subtle dark glow ring */}
          <circle cx="50" cy="50" r="44" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.35" />
          
          {/* Wireframe longitude & latitude ellipses matching brand PDF */}
          <ellipse cx="50" cy="50" rx="40" ry="22" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 2.5" transform="rotate(-25 50 50)" opacity="0.95" />
          <ellipse cx="50" cy="50" rx="38" ry="18" stroke="#38bdf8" strokeWidth="2" transform="rotate(35 50 50)" opacity="0.9" />
          <circle cx="50" cy="50" r="30" stroke="#0284c7" strokeWidth="1.5" opacity="0.6" />
          
          {/* Inner mesh tech lines */}
          <path d="M20 50 Q50 25 80 50" stroke="#fbbf24" strokeWidth="2.2" fill="none" opacity="0.95" />
          <path d="M20 50 Q50 75 80 50" stroke="#06b6d4" strokeWidth="2" fill="none" opacity="0.85" />
          
          {/* Smooth dynamic dual wave in cyan and blue - cupping the globe */}
          <path d="M22 68 C35 60, 50 82, 78 68 C68 84, 38 84, 22 68 Z" fill="url(#waveGradBlue)" />
          <path d="M24 74 C40 68, 54 84, 76 72 C64 88, 36 88, 24 74 Z" fill="url(#waveGradCyan)" opacity="0.9" />

          {/* Glowing node vertices */}
          <circle cx="34" cy="36" r="2.5" fill="#fbbf24" />
          <circle cx="68" cy="40" r="2.5" fill="#38bdf8" />
          <circle cx="50" cy="50" r="3" fill="#ffffff" />
          <circle cx="62" cy="62" r="2.5" fill="#06b6d4" />

          <defs>
            <linearGradient id="waveGradBlue" x1="20" y1="65" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0284c7" />
              <stop offset="1" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="waveGradCyan" x1="20" y1="70" x2="80" y2="85" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className={`font-display font-extrabold tracking-tight leading-none ${titleSizes[size]} ${
            variant === 'cyan-gold' ? 'text-cyan-400' : 'text-white'
          }`}>
            IZKATECH
          </span>
          {showSubtitle && (
            <span className={`font-semibold uppercase mt-1 leading-tight ${subtitleSizes[size]} ${
              variant === 'cyan-gold' ? 'text-amber-400' : 'text-cyan-400'
            }`}>
              ICT SYSTEM INTEGRATOR &amp; ME
            </span>
          )}
        </div>
      )}
    </div>
  );
};

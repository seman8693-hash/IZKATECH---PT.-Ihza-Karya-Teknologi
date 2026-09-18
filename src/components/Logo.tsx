import React, { useState, useEffect } from 'react';
import { useBrandIdentity } from '../hooks/useBrandIdentity.ts';
import { getCustomLogo } from '../data/adminStore';

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
  const [customLogo, setCustomLogoState] = useState<string | null>(null);
  const identity = useBrandIdentity();

  useEffect(() => {
    setCustomLogoState(getCustomLogo());
    const handleUpdate = () => {
      setCustomLogoState(getCustomLogo());
    };
    window.addEventListener('izkatech_logo_updated', handleUpdate);
    window.addEventListener('izkatech_brand_updated', handleUpdate);
    return () => {
      window.removeEventListener('izkatech_logo_updated', handleUpdate);
      window.removeEventListener('izkatech_brand_updated', handleUpdate);
    };
  }, []);

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
      {/* Precision 3D Sphere & Wave Logo / Custom Uploaded Logo */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 flex items-center justify-center overflow-hidden rounded-full shadow-[0_0_20px_rgba(6,182,212,0.35)] bg-slate-950/90 border border-cyan-500/30`}>
        {customLogo ? (
          <img src={customLogo} alt="IZKATECH Logo" className="w-full h-full object-cover" />
        ) : (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform scale-110">
          {/* Glass sphere radial lighting base */}
          <circle cx="50" cy="50" r="48" fill="url(#sphereBase)" />
          <radialGradient id="sphereBase" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#e0f2fe" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#7dd3fc" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.85" />
          </radialGradient>

          {/* 3D Curved Globe Meridian & Parallel Grids (Yellow-Green top, Cyan right) */}
          <ellipse cx="50" cy="50" rx="42" ry="24" stroke="url(#gridYellowGrad)" strokeWidth="2.8" transform="rotate(-30 50 50)" />
          <ellipse cx="50" cy="50" rx="40" ry="20" stroke="url(#gridCyanGrad)" strokeWidth="2.5" transform="rotate(40 50 50)" />
          <circle cx="50" cy="50" r="34" stroke="#0284c7" strokeWidth="1.8" opacity="0.65" />
          
          {/* Upper arch latitude curves */}
          <path d="M15 50 C25 22, 75 22, 85 50" stroke="#bef264" strokeWidth="2.5" fill="none" />
          <path d="M22 38 C35 15, 65 15, 78 38" stroke="#facc15" strokeWidth="2.2" fill="none" />

          {/* Bottom Glossy 3D Blue Wave / Leaf Cupping Shape */}
          <path d="M14 74 C30 55, 52 88, 86 64 C74 86, 38 90, 14 74 Z" fill="url(#waveDeepBlue)" />
          <path d="M18 78 C34 62, 54 90, 82 70 C70 88, 42 90, 18 78 Z" fill="url(#waveBrightCyan)" />
          {/* Wave highlight overlay */}
          <path d="M26 72 C40 60, 58 78, 74 68" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.85" />

          {/* Node intersection glints */}
          <circle cx="36" cy="32" r="3" fill="#facc15" />
          <circle cx="68" cy="35" r="2.8" fill="#38bdf8" />
          <circle cx="78" cy="52" r="2.5" fill="#22d3ee" />
          <circle cx="50" cy="50" r="3.5" fill="#ffffff" />

          {/* Gradients */}
          <defs>
            <linearGradient id="gridYellowGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#84cc16" />
            </linearGradient>
            <linearGradient id="gridCyanGrad" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <linearGradient id="waveDeepBlue" x1="15" y1="70" x2="85" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
            <linearGradient id="waveBrightCyan" x1="18" y1="75" x2="82" y2="88" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
        </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className={`font-display font-extrabold tracking-tight leading-none ${titleSizes[size]} ${
            variant === 'cyan-gold' ? 'text-cyan-400' : 'text-white'
          }`}>
            {identity.brandName || 'IZKATECH'}
          </span>
          {showSubtitle && (
            <span className={`font-semibold uppercase mt-1 leading-tight ${subtitleSizes[size]} ${
              variant === 'cyan-gold' ? 'text-amber-400' : 'text-cyan-400'
            }`}>
              {identity.subBrand2 || 'ICT SYSTEM INTEGRATOR & ME'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};


import React from 'react';

interface ConcentricRingsArtProps {
  className?: string;
}

export const ConcentricRingsArt: React.FC<ConcentricRingsArtProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-full max-w-[420px] aspect-[16/10] select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 500 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible drop-shadow-[0_0_40px_rgba(6,182,212,0.4)]"
      >
        <defs>
          {/* Ambient Indigo/Violet Glow */}
          <radialGradient id="ringPlatformGlow" cx="60%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#4f46e5" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>

          {/* Cyan Core Beam Glow */}
          <linearGradient id="cyanVerticalBeam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
          </linearGradient>

          {/* Angled Polygon Platform Gradients */}
          <linearGradient id="platformTopGrad" x1="180" y1="20" x2="440" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="45%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#312e81" />
          </linearGradient>

          <linearGradient id="platformFrontSide" x1="180" y1="80" x2="380" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3730a3" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>

          <linearGradient id="pedestalGrad" x1="280" y1="60" x2="420" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#1d4ed8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.9" />
          </linearGradient>

          {/* Concentric Neon Rings Gradients */}
          <linearGradient id="ringGrad1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>

          <linearGradient id="ringGrad2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="40%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          <filter id="neonRingBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient background aura */}
        <circle cx="360" cy="110" r="150" fill="url(#ringPlatformGlow)" />

        {/* Top-Right Angled 3D Isometric Platform (matching PDF Page 3) */}
        <g id="isometric-platform" opacity="0.95">
          {/* Top polygon facet */}
          <path
            d="M 230 15 L 480 20 L 495 140 L 330 175 Z"
            fill="url(#platformTopGrad)"
            stroke="#818cf8"
            strokeWidth="1.2"
          />
          {/* Front extrusion facet */}
          <path
            d="M 230 15 L 330 175 L 330 215 L 210 50 Z"
            fill="url(#platformFrontSide)"
            opacity="0.9"
          />
        </g>

        {/* 3D Isometric Pedestal Base */}
        <g transform="translate(45, -5)">
          <ellipse cx="320" cy="150" rx="90" ry="38" fill="url(#pedestalGrad)" />
          <ellipse cx="320" cy="150" rx="90" ry="38" stroke="#38bdf8" strokeWidth="1.5" opacity="0.4" />
        </g>

        {/* Vertical Light Axis Beam */}
        <g opacity="0.85">
          <ellipse cx="365" cy="140" rx="35" ry="14" fill="#22d3ee" opacity="0.3" />
          <path
            d="M 345 50 L 385 50 L 395 210 L 335 210 Z"
            fill="url(#cyanVerticalBeam)"
            opacity="0.65"
          />
        </g>

        {/* Layer 1: Lowest Concentric Ring (Outer Cyan Glow) */}
        <g filter="url(#neonRingBlur)" transform="rotate(-15 365 140)">
          <ellipse
            cx="365"
            cy="150"
            rx="105"
            ry="46"
            stroke="url(#ringGrad1)"
            strokeWidth="7"
            fill="rgba(6, 182, 212, 0.08)"
          />
          <ellipse
            cx="365"
            cy="150"
            rx="105"
            ry="46"
            stroke="#ffffff"
            strokeWidth="1.5"
            opacity="0.8"
          />
        </g>

        {/* Layer 2: Middle Concentric Ring (Vibrant Neon Cyan & Blue) */}
        <g filter="url(#neonRingBlur)" transform="rotate(-15 365 110)">
          <ellipse
            cx="365"
            cy="115"
            rx="85"
            ry="38"
            stroke="url(#ringGrad2)"
            strokeWidth="8"
            fill="rgba(56, 189, 248, 0.12)"
          />
          {/* Specular highlight arc */}
          <path
            d="M 295 110 A 85 38 0 0 1 435 110"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.9"
          />
        </g>

        {/* Layer 3: Top Concentric Ring (High Elevation Glowing Halo) */}
        <g filter="url(#neonRingBlur)" transform="rotate(-15 365 80)">
          <ellipse
            cx="365"
            cy="80"
            rx="65"
            ry="30"
            stroke="url(#ringGrad1)"
            strokeWidth="6.5"
            fill="rgba(103, 232, 249, 0.16)"
          />
          <ellipse
            cx="365"
            cy="80"
            rx="65"
            ry="30"
            stroke="#cffafe"
            strokeWidth="2"
            opacity="0.95"
          />
        </g>

        {/* Floating Particle Sparkles */}
        <circle cx="365" cy="50" r="2.5" fill="#ffffff" />
        <circle cx="430" cy="95" r="2" fill="#67e8f9" />
        <circle cx="280" cy="130" r="2" fill="#38bdf8" />

        {/* Descending Cyan Laser Trails (exact match to Page 3 & 4 artwork) */}
        <g filter="url(#neonRingBlur)">
          {/* Left laser drop line */}
          <line x1="390" y1="180" x2="390" y2="235" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
          <circle cx="390" cy="235" r="2" fill="#a5f3fc" />

          {/* Right longer laser drop line */}
          <line x1="450" y1="170" x2="450" y2="295" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          <circle cx="450" cy="295" r="2" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
};

import React from 'react';

interface GeometricPrismArtProps {
  className?: string;
}

export const GeometricPrismArt: React.FC<GeometricPrismArtProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-full max-w-[420px] aspect-[16/10] select-none pointer-events-none ${className}`}>
      <svg 
        viewBox="0 0 500 320" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-full overflow-visible drop-shadow-[0_0_35px_rgba(59,130,246,0.35)]"
      >
        <defs>
          {/* Glowing blue sphere radial gradient */}
          <radialGradient id="prismSphereGrad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="1" />
            <stop offset="25%" stopColor="#3b82f6" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#1d4ed8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>

          {/* Ambient outer blue halo */}
          <radialGradient id="prismGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#2563eb" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
          </radialGradient>

          {/* Sparkle star filter */}
          <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Node cyan glow */}
          <filter id="cyanNodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient background soft light glow behind polyhedron */}
        <circle cx="340" cy="140" r="140" fill="url(#prismGlow)" opacity="0.75" />

        {/* 3D Glowing Blue Orb inside wireframe prism cage */}
        <g transform="translate(40, -10)">
          <circle cx="300" cy="140" r="85" fill="url(#prismSphereGrad)" />
          {/* Subtle specular sheen */}
          <ellipse cx="280" cy="115" rx="35" ry="20" fill="#ffffff" opacity="0.22" transform="rotate(-20 280 115)" />
        </g>

        {/* 3D Wireframe Cage Polyhedron matching page 2 PDF image */}
        {/* Back depth lines */}
        <line x1="200" y1="35" x2="350" y2="40" stroke="#818cf8" strokeWidth="1.2" opacity="0.35" strokeDasharray="3 3" />
        <line x1="350" y1="40" x2="475" y2="135" stroke="#818cf8" strokeWidth="1.2" opacity="0.35" strokeDasharray="3 3" />
        <line x1="350" y1="40" x2="405" y2="275" stroke="#818cf8" strokeWidth="1.2" opacity="0.3" strokeDasharray="3 3" />

        {/* Front Wireframe Faces (crisp white & pale cyan lines with gradient light) */}
        {/* Top polygon facet */}
        <polygon 
          points="70,95 200,35 375,15 285,115" 
          fill="rgba(56, 189, 248, 0.03)" 
          stroke="#e0e7ff" 
          strokeWidth="2" 
          strokeLinejoin="round" 
        />

        {/* Bottom front structural lines */}
        <line x1="70" y1="95" x2="285" y2="115" stroke="#f8fafc" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="70" y1="95" x2="340" y2="285" stroke="#e0e7ff" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
        <line x1="285" y1="115" x2="340" y2="285" stroke="#f1f5f9" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="285" y1="115" x2="475" y2="265" stroke="#e0e7ff" strokeWidth="2" strokeLinecap="round" />
        <line x1="340" y1="285" x2="475" y2="265" stroke="#f8fafc" strokeWidth="2.2" strokeLinecap="round" />
        
        {/* Right facet lines */}
        <line x1="375" y1="15" x2="475" y2="265" stroke="#c7d2fe" strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
        <line x1="375" y1="15" x2="435" y2="190" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
        <line x1="435" y1="190" x2="475" y2="265" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />

        {/* Cyan glowing vertex node (exactly positioned on wireframe facet edge as shown in image) */}
        <g filter="url(#cyanNodeGlow)">
          <circle cx="435" cy="190" r="7" fill="#67e8f9" />
          <circle cx="435" cy="190" r="14" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
          <circle cx="435" cy="190" r="2.5" fill="#ffffff" />
        </g>

        {/* Brilliant 4-point Sparkle Star on top vertex (x: 285, y: 115) */}
        <g transform="translate(285, 115)" filter="url(#starGlow)">
          {/* Star flare rays */}
          <path 
            d="M 0 -24 Q 0 0 -24 0 Q 0 0 0 24 Q 0 0 24 0 Q 0 0 0 -24 Z" 
            fill="#ffffff" 
          />
          {/* Diagonal subtle cross rays */}
          <path 
            d="M -10 -10 L 10 10 M 10 -10 L -10 10" 
            stroke="#67e8f9" 
            strokeWidth="1.5" 
            opacity="0.8" 
          />
          {/* Intense center core */}
          <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
          <circle cx="0" cy="0" r="9" fill="#38bdf8" opacity="0.35" />
        </g>

        {/* Minor secondary sparkle on top-left edge */}
        <g transform="translate(70, 95)" opacity="0.8">
          <circle cx="0" cy="0" r="3" fill="#e0e7ff" />
          <circle cx="0" cy="0" r="7" stroke="#38bdf8" strokeWidth="1" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
};

import React, { useState } from 'react';

interface IsometricCoverTechArtProps {
  className?: string;
  interactive?: boolean;
}

export const IsometricCoverTechArt: React.FC<IsometricCoverTechArtProps> = ({ 
  className = '',
  interactive = true 
}) => {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <div className={`relative w-full aspect-[16/10] sm:aspect-[16/11] max-w-2xl mx-auto flex items-center justify-center select-none ${className}`}>
      
      {/* Background radial dual glow: Blue on left, Orange on right */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 via-indigo-950/40 to-orange-600/25 rounded-3xl blur-2xl -z-10" />
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[90px] -z-10" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-blue-600/25 rounded-full blur-[90px] -z-10" />

      {/* SVG Container holding the 3D isometric blue-to-orange scene */}
      <svg 
        viewBox="0 0 900 650" 
        className="w-full h-full drop-shadow-[0_15px_40px_rgba(234,88,12,0.25)] overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* ==================== 3D GRADIENTS: BLUE TO ORANGE ==================== */}
          
          {/* Upward Beams: Left Blue, Right Flame Orange */}
          <linearGradient id="cyanBeamGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#0284c7" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="orangeBeamGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#ff7b00" stopOpacity="0.85" />
            <stop offset="35%" stopColor="#f97316" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </linearGradient>

          {/* Central 3D Core Block Gradients: Blue-to-Orange Hybrid Fusion */}
          <linearGradient id="coreTopGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="45%" stopColor="#4f46e5" />
            <stop offset="80%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          <linearGradient id="coreLeftGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="60%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>

          <linearGradient id="coreRightGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="50%" stopColor="#9a3412" />
            <stop offset="100%" stopColor="#1c1917" />
          </linearGradient>

          {/* 3D Extruded Lettering WE / ME: Blue with Orange Highlight Sheen */}
          <linearGradient id="weTopGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
          <linearGradient id="weSideGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#7c2d12" />
          </linearGradient>

          {/* Circuit Gradient Lines (Blue to Orange) */}
          <linearGradient id="circuitBlueOrange" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#ff7700" />
          </linearGradient>

          {/* 3D Neon Glow Filters */}
          <filter id="neonBlueGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="neonOrangeGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="strongBeamGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ========================================================
            LAYER 0: 3D VERTICAL LIGHT BEAMS (BLUE & ORANGE)
            ======================================================== */}
        {/* Left Server Beam - Electric Blue */}
        <g className="animate-pulse" style={{ animationDuration: '4s' }}>
          <polygon 
            points="230,240 280,240 305,40 205,40" 
            fill="url(#cyanBeamGrad)" 
            filter="url(#strongBeamGlow)"
          />
          <polygon 
            points="245,230 265,230 275,60 235,60" 
            fill="#e0f2fe" 
            opacity="0.65"
          />
        </g>

        {/* Right Server Beam - Vibrant Flame Orange */}
        <g className="animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '0.6s' }}>
          <polygon 
            points="620,240 670,240 695,40 595,40" 
            fill="url(#orangeBeamGrad)" 
            filter="url(#strongBeamGlow)"
          />
          <polygon 
            points="635,230 655,230 665,60 625,60" 
            fill="#ffedd5" 
            opacity="0.65"
          />
        </g>


        {/* ========================================================
            LAYER 1: 3D ISOMETRIC DUAL CIRCUITS ON FLOOR (BLUE & ORANGE)
            ======================================================== */}
        {/* Outer and Main Connecting Circuits */}
        <g strokeLinejoin="round" strokeLinecap="round">
          {/* Cyan/Blue Circuit Traces on Left Half */}
          <g stroke="#00f0ff" strokeWidth="2.5" fill="none" filter="url(#neonBlueGlow)">
            <path d="M 450,560 L 150,400 L 150,330 L 260,265" opacity="0.7" />
            <path d="M 230,470 L 320,520 L 400,475 L 400,430" />
            <path d="M 170,410 L 250,365 L 350,420" opacity="0.8" />
            <path d="M 270,300 L 360,350 L 360,370" />
            <path d="M 120,380 L 150,400 L 220,360" opacity="0.4" />
          </g>

          {/* Fiery Orange Circuit Traces on Right Half */}
          <g stroke="#ff7700" strokeWidth="2.5" fill="none" filter="url(#neonOrangeGlow)">
            <path d="M 450,560 L 750,400 L 750,330 L 640,265" opacity="0.75" />
            <path d="M 670,470 L 580,520 L 500,475 L 500,430" />
            <path d="M 730,410 L 650,365 L 550,420" opacity="0.85" />
            <path d="M 630,300 L 540,350 L 540,370" />
            <path d="M 780,380 L 750,400 L 680,360" opacity="0.4" />
          </g>

          {/* Central Convergence Line (Blue to Orange gradient) */}
          <path d="M 370,550 L 450,600 L 530,550" stroke="url(#circuitBlueOrange)" strokeWidth="3" fill="none" />
        </g>

        {/* Animated Data Packets in Blue & Orange */}
        <circle cx="320" cy="520" r="4" fill="#00f0ff" filter="url(#neonBlueGlow)">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="580" cy="520" r="4" fill="#ff7700" filter="url(#neonOrangeGlow)">
          <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="360" cy="350" r="3.5" fill="#38bdf8" filter="url(#neonBlueGlow)">
          <animate attributeName="cx" values="270;360" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="cy" values="300;350" dur="1.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="540" cy="350" r="3.5" fill="#f97316" filter="url(#neonOrangeGlow)">
          <animate attributeName="cx" values="630;540" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="cy" values="300;350" dur="1.6s" repeatCount="indefinite" />
        </circle>


        {/* ========================================================
            LAYER 2: TOP-LEFT SERVER RACK CLUSTER (BLUE ACCENT)
            ======================================================== */}
        <g 
          className="cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
          onMouseEnter={() => interactive && setActiveNode('cluster-a')}
          onMouseLeave={() => interactive && setActiveNode(null)}
          id="isometric-server-cluster-left"
        >
          {/* Base Platform Ring */}
          <polygon points="255,270 330,310 255,350 180,310" fill="#071330" stroke="#00f0ff" strokeWidth="2" filter="url(#neonBlueGlow)" />
          
          {/* Intermediate Tier Platform */}
          <polygon points="255,255 315,290 255,325 195,290" fill="#0c1e4d" stroke="#38bdf8" strokeWidth="1.5" />
          
          {/* Left Sub-Server Node (Deep Blue 3D faces) */}
          <polygon points="195,280 220,295 220,265 195,250" fill="#0b1736" />
          <polygon points="220,295 245,280 245,250 220,265" fill="#0284c7" />
          <polygon points="220,235 245,250 220,265 195,250" fill="#38bdf8" />
          <line x1="220" y1="265" x2="220" y2="295" stroke="#00ffff" strokeWidth="2" filter="url(#neonBlueGlow)" />

          {/* Right Sub-Server Node */}
          <polygon points="255,270 280,285 280,255 255,240" fill="#0b1736" />
          <polygon points="280,285 305,270 305,240 280,255" fill="#0284c7" />
          <polygon points="280,225 305,240 280,255 255,240" fill="#38bdf8" />
          <line x1="280" y1="255" x2="280" y2="285" stroke="#00ffff" strokeWidth="2" filter="url(#neonBlueGlow)" />

          {/* Upper Stack Modules with Cyan glowing aperture */}
          <polygon points="245,215 270,230 255,240 230,225" fill="#00f0ff" filter="url(#neonBlueGlow)" />
          <polygon points="265,205 290,220 275,230 250,215" fill="#00f0ff" filter="url(#neonBlueGlow)" />

          {activeNode === 'cluster-a' && (
            <g>
              <rect x="150" y="160" width="210" height="40" rx="8" fill="#030712" stroke="#00f0ff" strokeWidth="1.5" />
              <text x="165" y="184" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">
                CLUSTER A: ICT NETWORK
              </text>
            </g>
          )}
        </g>


        {/* ========================================================
            LAYER 3: TOP-RIGHT SERVER RACK CLUSTER (ORANGE ACCENT)
            ======================================================== */}
        <g 
          className="cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
          onMouseEnter={() => interactive && setActiveNode('cluster-b')}
          onMouseLeave={() => interactive && setActiveNode(null)}
          id="isometric-server-cluster-right"
        >
          {/* Base Platform Ring with Warm Orange Glow */}
          <polygon points="645,270 720,310 645,350 570,310" fill="#200d02" stroke="#ff7700" strokeWidth="2" filter="url(#neonOrangeGlow)" />
          
          {/* Intermediate Tier Platform */}
          <polygon points="645,255 705,290 645,325 585,290" fill="#3d1704" stroke="#f97316" strokeWidth="1.5" />
          
          {/* Left Sub-Server Node (Warm Orange 3D faces) */}
          <polygon points="610,265 635,280 635,250 610,235" fill="#291103" />
          <polygon points="635,280 660,265 660,235 635,250" fill="#ea580c" />
          <polygon points="635,220 660,235 635,250 610,235" fill="#fb923c" />
          <line x1="635" y1="250" x2="635" y2="280" stroke="#ff9900" strokeWidth="2" filter="url(#neonOrangeGlow)" />

          {/* Right Sub-Server Node */}
          <polygon points="645,270 670,285 670,255 645,240" fill="#291103" />
          <polygon points="670,285 695,270 695,240 670,255" fill="#ea580c" />
          <polygon points="670,225 695,240 670,255 645,240" fill="#fb923c" />
          <line x1="670" y1="255" x2="670" y2="285" stroke="#ff9900" strokeWidth="2" filter="url(#neonOrangeGlow)" />

          {/* Upper Stack Modules with Neon Orange glowing aperture */}
          <polygon points="635,210 660,225 645,235 620,220" fill="#ff7700" filter="url(#neonOrangeGlow)" />
          <polygon points="655,200 680,215 665,225 640,210" fill="#ff9900" filter="url(#neonOrangeGlow)" />

          {activeNode === 'cluster-b' && (
            <g>
              <rect x="540" y="160" width="220" height="40" rx="8" fill="#030712" stroke="#ff7700" strokeWidth="1.5" />
              <text x="555" y="184" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">
                CLUSTER B: ME POWER CORE
              </text>
            </g>
          )}
        </g>


        {/* ========================================================
            LAYER 4: CENTRAL 3D HYBRID CYBER BLOCK (BLUE TO ORANGE)
            ======================================================== */}
        <g 
          className="cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
          onMouseEnter={() => interactive && setActiveNode('core-hub')}
          onMouseLeave={() => interactive && setActiveNode(null)}
          id="isometric-core-hub"
        >
          {/* Base Grounding Glow (Blue-Orange Dual Reflection) */}
          <polygon points="450,330 550,385 450,440 350,385" fill="#ea580c" opacity="0.3" filter="url(#strongBeamGlow)" />

          {/* 3D Prism Faces */}
          {/* Left Vertical Face (Electric Blue Lighting) */}
          <polygon points="350,385 450,440 450,510 350,455" fill="url(#coreLeftGrad)" stroke="#2563eb" strokeWidth="2" />
          {/* Right Vertical Face (Radiant Orange Lighting) */}
          <polygon points="450,440 550,385 550,455 450,510" fill="url(#coreRightGrad)" stroke="#f97316" strokeWidth="2" />
          {/* Top Diamond Face (Blue transitioning to Orange 3D sheen) */}
          <polygon points="450,315 550,370 450,425 350,370" fill="url(#coreTopGrad)" stroke="#93c5fd" strokeWidth="2" />

          {/* DUAL 3D GLOWING APERTURE WINDOWS: Left is Blue, Right is Orange */}
          {/* Front Left Glowing Cyan/Blue Core Window */}
          <polygon 
            points="375,410 425,438 425,468 375,440" 
            fill="#00f0ff" 
            filter="url(#neonBlueGlow)"
          />
          {/* Front Right Glowing Flame Orange Core Window */}
          <polygon 
            points="475,438 525,410 525,440 475,468" 
            fill="#ff7700" 
            filter="url(#neonOrangeGlow)"
          />

          {/* 3D Extruded "WE" / "ME" on Top Diamond Face with Blue-Orange Sheen */}
          <g transform="translate(400, 335)">
            {/* Letter 'W' (Isometric 3D) */}
            <path 
              d="M 15,35 L 25,18 L 36,32 L 47,18 L 57,35 L 48,35 L 42,26 L 36,34 L 30,26 L 24,35 Z" 
              fill="url(#weTopGrad)" 
              stroke="#fb923c" 
              strokeWidth="1.5"
            />
            {/* 3D Thickness side faces for W */}
            <path d="M 15,35 L 24,35 L 24,39 L 15,39 Z" fill="url(#weSideGrad)" />
            <path d="M 48,35 L 57,35 L 57,39 L 48,39 Z" fill="url(#weSideGrad)" />

            {/* Letter 'E' (Isometric 3D) */}
            <path 
              d="M 68,16 L 96,28 L 91,33 L 78,28 L 76,33 L 88,38 L 84,43 L 72,38 L 70,44 L 84,50 L 79,55 L 63,48 Z" 
              fill="url(#weTopGrad)" 
              stroke="#fb923c" 
              strokeWidth="1.5"
            />
          </g>

          {/* Center 3D Dividing Seam (Dual tone glow line) */}
          <line x1="450" y1="425" x2="450" y2="510" stroke="#fbbf24" strokeWidth="2.5" filter="url(#neonOrangeGlow)" />
          <polyline points="350,370 450,425 550,370" stroke="#fde047" strokeWidth="1.8" fill="none" opacity="0.8" />

          {activeNode === 'core-hub' && (
            <g>
              <rect x="320" y="265" width="260" height="40" rx="8" fill="#030712" stroke="#ea580c" strokeWidth="1.5" />
              <text x="335" y="289" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">
                CORE: ICT &amp; ME INTEGRATION
              </text>
            </g>
          )}
        </g>


        {/* ========================================================
            LAYER 5: BOTTOM-LEFT OPERATOR CONSOLE (BLUE HOLOGRAPHIC)
            ======================================================== */}
        <g 
          className="cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
          onMouseEnter={() => interactive && setActiveNode('operator-a')}
          onMouseLeave={() => interactive && setActiveNode(null)}
          id="isometric-operator-left"
        >
          {/* Base Platform Ring */}
          <polygon points="240,440 295,470 240,500 185,470" fill="#071430" stroke="#00f0ff" strokeWidth="2" filter="url(#neonBlueGlow)" />

          {/* Vertical Cyan-Blue Holographic Console Screen */}
          <g>
            <polygon points="245,450 260,458 260,490 245,482" fill="#1e293b" />
            <polygon 
              points="250,380 275,395 275,445 250,430" 
              fill="#00e5ff" 
              stroke="#ffffff" 
              strokeWidth="1"
              filter="url(#neonBlueGlow)"
              opacity="0.95"
            />
            <line x1="255" y1="395" x2="270" y2="403" stroke="#0369a1" strokeWidth="2" />
            <line x1="255" y1="405" x2="270" y2="413" stroke="#0369a1" strokeWidth="2" />
            <line x1="255" y1="415" x2="265" y2="421" stroke="#0369a1" strokeWidth="2" />
          </g>

          {/* Operator Figure (Purple-Blue Shirt) */}
          <g transform="translate(230, 400)">
            <circle cx="20" cy="18" r="7" fill="#f87171" opacity="0.9" />
            <ellipse cx="20" cy="15" rx="7" ry="5" fill="#1e1b4b" />
            <polygon points="12,25 28,25 32,55 8,55" fill="#3b82f6" stroke="#2563eb" strokeWidth="1" />
            <line x1="26" y1="30" x2="35" y2="35" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
            <circle cx="37" cy="36" r="2.5" fill="#f87171" />
            <polygon points="10,55 18,55 16,80 8,80" fill="#0f172a" />
            <polygon points="22,55 30,55 32,80 24,80" fill="#0f172a" />
            <polygon points="7,78 17,78 18,84 6,84" fill="#0284c7" />
            <polygon points="23,78 33,78 34,84 22,84" fill="#0284c7" />
          </g>

          {activeNode === 'operator-a' && (
            <g>
              <rect x="150" y="340" width="190" height="35" rx="8" fill="#030712" stroke="#00f0ff" strokeWidth="1.5" />
              <text x="165" y="362" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">
                NOC: ICT NETWORK &amp; CCTV
              </text>
            </g>
          )}
        </g>


        {/* ========================================================
            LAYER 6: BOTTOM-RIGHT OPERATOR CONSOLE (ORANGE HOLOGRAPHIC)
            ======================================================== */}
        <g 
          className="cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
          onMouseEnter={() => interactive && setActiveNode('operator-b')}
          onMouseLeave={() => interactive && setActiveNode(null)}
          id="isometric-operator-right"
        >
          {/* Base Platform Ring with Flame Orange Glow */}
          <polygon points="660,440 715,470 660,500 605,470" fill="#200d02" stroke="#ff7700" strokeWidth="2" filter="url(#neonOrangeGlow)" />

          {/* Vertical Warm Orange Holographic Console Screen */}
          <g>
            <polygon points="650,450 665,458 665,490 650,482" fill="#1e293b" />
            <polygon 
              points="645,380 670,395 670,445 645,430" 
              fill="#ff7700" 
              stroke="#fff7ed" 
              strokeWidth="1"
              filter="url(#neonOrangeGlow)"
              opacity="0.95"
            />
            <line x1="650" y1="395" x2="665" y2="403" stroke="#7c2d12" strokeWidth="2" />
            <line x1="650" y1="405" x2="665" y2="413" stroke="#7c2d12" strokeWidth="2" />
            <line x1="650" y1="415" x2="660" y2="421" stroke="#7c2d12" strokeWidth="2" />
          </g>

          {/* Operator Figure (Warm Orange Accent Shirt) */}
          <g transform="translate(680, 400)">
            <circle cx="15" cy="18" r="7" fill="#f87171" opacity="0.9" />
            <ellipse cx="15" cy="15" rx="7" ry="5" fill="#1e1b4b" />
            <polygon points="7,25 23,25 27,55 3,55" fill="#ea580c" stroke="#c2410c" strokeWidth="1" />
            <line x1="9" y1="30" x2="-2" y2="35" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" />
            <circle cx="-3" cy="36" r="2.5" fill="#f87171" />
            <polygon points="5,55 13,55 11,80 3,80" fill="#0f172a" />
            <polygon points="17,55 25,55 27,80 19,80" fill="#0f172a" />
            <polygon points="2,78 12,78 13,84 1,84" fill="#c2410c" />
            <polygon points="18,78 28,78 29,84 17,84" fill="#c2410c" />
          </g>

          {activeNode === 'operator-b' && (
            <g>
              <rect x="560" y="340" width="190" height="35" rx="8" fill="#030712" stroke="#ff7700" strokeWidth="1.5" />
              <text x="575" y="362" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">
                NOC: ME &amp; AUTOMATION
              </text>
            </g>
          )}
        </g>


        {/* ========================================================
            LAYER 7: 3D DUAL-COLOR SPARKLES & STARS
            ======================================================== */}
        {/* Sparkle 1 near left operator (Cyan) */}
        <g transform="translate(205, 385)" className="animate-spin" style={{ animationDuration: '8s', transformOrigin: '205px 385px' }}>
          <path d="M 0,-14 L 3,-4 L 14,0 L 3,4 L 0,14 L -3,4 L -14,0 L -3,-4 Z" fill="#ffffff" filter="url(#neonBlueGlow)" />
          <circle cx="0" cy="0" r="2.5" fill="#38bdf8" />
        </g>

        {/* Sparkle 2 (Warm Orange) between right server and central hub */}
        <g transform="translate(530, 240)" className="animate-spin" style={{ animationDuration: '7s', transformOrigin: '530px 240px' }}>
          <path d="M 0,-13 L 3,-3 L 13,0 L 3,3 L 0,13 L -3,3 L -13,0 L -3,-3 Z" fill="#ffedd5" filter="url(#neonOrangeGlow)" />
          <circle cx="0" cy="0" r="2.5" fill="#ff7700" />
        </g>

        {/* Sparkle 3 near right server node (Amber Orange) */}
        <g transform="translate(710, 260)">
          <path d="M 0,-9 L 2.5,-2 L 9,0 L 2.5,2 L 0,9 L -2.5,2 L -9,0 L -2.5,-2 Z" fill="#fb923c" filter="url(#neonOrangeGlow)" />
        </g>

        {/* Sparkle 4 (Electric Blue) */}
        <g transform="translate(370, 240)">
          <path d="M 0,-10 L 2,-3 L 10,0 L 2,3 L 0,10 L -2,3 L -10,0 L -2,-3 Z" fill="#ffffff" opacity="0.85" filter="url(#neonBlueGlow)" />
        </g>
      </svg>

      {/* Floating 3D Blue-to-Orange Status Indicator */}
      <div className="absolute bottom-1 right-2 sm:right-6 bg-slate-950/90 border border-orange-500/40 text-orange-300 text-[10px] font-mono px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-2 shadow-lg shadow-orange-950/60 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-orange-500 animate-pulse" />
        <span>3D BLUE-TO-ORANGE // ICT &amp; ME ACTIVE</span>
      </div>
    </div>
  );
};

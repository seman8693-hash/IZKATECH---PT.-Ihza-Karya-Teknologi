import React from 'react';

export interface EquipmentItemProps {
  type: 'cctv' | 'access-control' | 'network-security' | 'telecom' | 'hardware';
  className?: string;
}

export const EquipmentVisualShowcase: React.FC<EquipmentItemProps> = ({ type, className = '' }) => {
  switch (type) {
    case 'cctv':
      return (
        <div className={`relative flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-slate-900/95 via-cyan-950/40 to-slate-950 border border-cyan-500/40 shadow-xl shadow-cyan-950/30 group hover:border-cyan-400 transition-all ${className}`}>
          {/* Subtle Glow */}
          <div className="absolute inset-0 bg-cyan-500/10 rounded-2xl blur-lg pointer-events-none" />
          
          <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24 sm:h-28 overflow-visible">
            <defs>
              <linearGradient id="cctvBody" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="60%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
              <linearGradient id="lensGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="50%" stopColor="#0369a1" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <radialGradient id="irGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="scanBeam" x1="0" y1="0" x2="1" y2="0.8">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Ceiling / Wall Mount Bracket */}
            <rect x="25" y="10" width="30" height="12" rx="3" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
            <path d="M 40 22 L 40 42 L 65 52" stroke="#64748b" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

            {/* Scanning Laser Beam */}
            <polygon points="75,55 155,20 155,100" fill="url(#scanBeam)" />

            {/* CCTV Bullet Camera Housing */}
            <g transform="rotate(18 75 55)">
              {/* Sunshield */}
              <rect x="35" y="36" width="65" height="8" rx="2" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />
              {/* Camera Cylinder Body */}
              <rect x="42" y="44" width="55" height="32" rx="6" fill="url(#cctvBody)" stroke="#94a3b8" strokeWidth="1" />
              {/* Front Dark Bezel */}
              <rect x="85" y="44" width="12" height="32" rx="4" fill="#0f172a" />
              
              {/* Optical Glass Lens */}
              <circle cx="91" cy="60" r="10" fill="url(#lensGrad)" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="91" cy="60" r="5" fill="#020617" />
              <circle cx="93" cy="58" r="2" fill="#ffffff" opacity="0.8" />

              {/* Infrared LEDs */}
              <circle cx="88" cy="48" r="1.5" fill="#ef4444" />
              <circle cx="94" cy="48" r="1.5" fill="#ef4444" />
              <circle cx="88" cy="72" r="1.5" fill="#ef4444" />
              <circle cx="94" cy="72" r="1.5" fill="#ef4444" />
            </g>

            {/* Status LED & Badge */}
            <circle cx="108" cy="85" r="3" fill="#10b981" />
            <circle cx="108" cy="85" r="5" stroke="#10b981" strokeWidth="0.8" opacity="0.6" />
          </svg>

          <div className="text-center mt-1">
            <div className="text-xs font-bold text-white tracking-wide">CCTV Surveillance</div>
            <div className="text-[10px] text-cyan-400 font-mono">Hikvision • Dahua • Uniview</div>
          </div>
        </div>
      );

    case 'access-control':
      return (
        <div className={`relative flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-slate-900/95 via-indigo-950/40 to-slate-950 border border-indigo-500/40 shadow-xl shadow-indigo-950/30 group hover:border-indigo-400 transition-all ${className}`}>
          <div className="absolute inset-0 bg-indigo-500/10 rounded-2xl blur-lg pointer-events-none" />

          <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24 sm:h-28 overflow-visible">
            <defs>
              <linearGradient id="terminalBody" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#090d16" />
              </linearGradient>
              <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>

            {/* Terminal Main Unit */}
            <rect x="42" y="10" width="56" height="98" rx="8" fill="url(#terminalBody)" stroke="#475569" strokeWidth="1.5" />
            <rect x="45" y="13" width="50" height="92" rx="6" stroke="#334155" strokeWidth="0.8" />

            {/* Terminal Camera / Face Scan Header */}
            <circle cx="70" cy="22" r="3" fill="#020617" stroke="#38bdf8" strokeWidth="1" />
            <circle cx="60" cy="22" r="1.5" fill="#ef4444" />
            <circle cx="80" cy="22" r="1.5" fill="#10b981" />

            {/* LCD Screen Display */}
            <rect x="49" y="30" width="42" height="28" rx="3" fill="url(#screenGrad)" stroke="#0284c7" strokeWidth="0.8" />
            {/* User Avatar Silhouette on screen */}
            <circle cx="70" cy="40" r="5" fill="#e2e8f0" />
            <path d="M 62 52 C 62 47 78 47 78 52 Z" fill="#e2e8f0" />
            {/* Access Granted Badge */}
            <rect x="54" y="52" width="32" height="4" rx="2" fill="#10b981" />

            {/* Optical Fingerprint Scanner Prism */}
            <rect x="54" y="64" width="32" height="24" rx="4" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.2" />
            {/* Fingerprint biometric grooves */}
            <path d="M 70 70 A 3 3 0 0 1 70 76 A 6 6 0 0 1 70 82" stroke="#67e8f9" strokeWidth="1" fill="none" strokeLinecap="round" />
            <path d="M 66 72 A 6 6 0 0 1 74 72" stroke="#67e8f9" strokeWidth="1" fill="none" strokeLinecap="round" />
            <path d="M 63 76 A 9 9 0 0 1 77 76" stroke="#67e8f9" strokeWidth="1" fill="none" strokeLinecap="round" />

            {/* Smart RFID Badge Floating on right */}
            <g transform="translate(100, 45) rotate(14)">
              <rect x="0" y="0" width="40" height="26" rx="4" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))" />
              <rect x="4" y="5" width="10" height="7" rx="1.5" fill="#eab308" />
              <line x1="18" y1="8" x2="34" y2="8" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="18" y1="13" x2="30" y2="13" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
              {/* Wireless RFID Waves */}
              <path d="M -4 8 A 6 6 0 0 0 -4 18" stroke="#38bdf8" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M -8 5 A 11 11 0 0 0 -8 21" stroke="#38bdf8" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
            </g>
          </svg>

          <div className="text-center mt-1">
            <div className="text-xs font-bold text-white tracking-wide">Access Control & RFID</div>
            <div className="text-[10px] text-indigo-400 font-mono">HID • Suprema • Entry Pass</div>
          </div>
        </div>
      );

    case 'network-security':
      return (
        <div className={`relative flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-slate-900/95 via-sky-950/40 to-slate-950 border border-sky-500/40 shadow-xl shadow-sky-950/30 group hover:border-sky-400 transition-all ${className}`}>
          <div className="absolute inset-0 bg-sky-500/10 rounded-2xl blur-lg pointer-events-none" />

          <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24 sm:h-28 overflow-visible">
            <defs>
              <linearGradient id="firewallChassis" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#4338ca" />
              </linearGradient>
            </defs>

            {/* Rack Appliance 1: Top Gateway */}
            <rect x="15" y="24" width="130" height="28" rx="4" fill="url(#firewallChassis)" stroke="#475569" strokeWidth="1.2" />
            {/* Rack Mount Ears */}
            <rect x="10" y="24" width="5" height="28" fill="#64748b" />
            <rect x="145" y="24" width="5" height="28" fill="#64748b" />
            <circle cx="12.5" cy="30" r="1.5" fill="#0f172a" />
            <circle cx="12.5" cy="46" r="1.5" fill="#0f172a" />
            <circle cx="147.5" cy="30" r="1.5" fill="#0f172a" />
            <circle cx="147.5" cy="46" r="1.5" fill="#0f172a" />

            {/* Front Panel Ports & LEDs */}
            {/* Fortinet Red / Watchguard Orange Accent Stripe */}
            <rect x="18" y="27" width="4" height="22" fill="#ea580c" />
            {/* RJ45 Ethernet Port Bank */}
            <g transform="translate(30, 32)">
              {[0, 8, 16, 24, 32, 40, 48, 56].map((x) => (
                <g key={x} transform={`translate(${x}, 0)`}>
                  <rect x="0" y="0" width="6" height="8" rx="1" fill="#020617" stroke="#64748b" strokeWidth="0.6" />
                  <circle cx="3" cy="-3" r="1" fill={x % 16 === 0 ? '#10b981' : '#38bdf8'} />
                </g>
              ))}
            </g>
            {/* SFP Fiber Ports */}
            <rect x="94" y="32" width="14" height="8" rx="1" fill="#020617" stroke="#eab308" strokeWidth="0.8" />
            <circle cx="101" cy="29" r="1" fill="#10b981" />

            {/* Rack Appliance 2: Bottom Switch / Firewall */}
            <rect x="15" y="58" width="130" height="28" rx="4" fill="url(#firewallChassis)" stroke="#475569" strokeWidth="1.2" />
            <rect x="10" y="58" width="5" height="28" fill="#64748b" />
            <rect x="145" y="58" width="5" height="28" fill="#64748b" />
            {/* Ventilation Grille */}
            <g transform="translate(30, 68)">
              {[0, 6, 12, 18, 24, 30, 36].map((x) => (
                <line key={x} x1={x} y1="0" x2={x} y2="10" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
              ))}
            </g>
            {/* Status Screen */}
            <rect x="80" y="64" width="34" height="14" rx="2" fill="#0284c7" opacity="0.3" stroke="#38bdf8" strokeWidth="0.8" />
            <line x1="84" y1="71" x2="108" y2="71" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 2" />

            {/* Floating Security Shield with Padlock */}
            <g transform="translate(112, 60)">
              <path d="M 18 2 L 32 8 C 32 20 25 28 18 32 C 11 28 4 20 4 8 Z" fill="url(#shieldGrad)" stroke="#ffffff" strokeWidth="1.2" />
              {/* Padlock Icon in Shield */}
              <rect x="13" y="16" width="10" height="8" rx="2" fill="#ffffff" />
              <path d="M 15 16 L 15 13 C 15 11 21 11 21 13 L 21 16" stroke="#ffffff" strokeWidth="1.5" fill="none" />
            </g>
          </svg>

          <div className="text-center mt-1">
            <div className="text-xs font-bold text-white tracking-wide">Network Security</div>
            <div className="text-[10px] text-sky-400 font-mono">Fortinet • Watchguard • Sangfor</div>
          </div>
        </div>
      );

    case 'telecom':
      return (
        <div className={`relative flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-slate-900/95 via-blue-950/40 to-slate-950 border border-blue-500/40 shadow-xl shadow-blue-950/30 group hover:border-blue-400 transition-all ${className}`}>
          <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-lg pointer-events-none" />

          <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24 sm:h-28 overflow-visible">
            <defs>
              <linearGradient id="phoneBody" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="phoneScreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
            </defs>

            {/* IP PBX Desktop Base */}
            <path d="M 45 25 L 125 25 L 132 95 L 38 95 Z" fill="url(#phoneBody)" stroke="#475569" strokeWidth="1.5" />

            {/* Handset on Left Cradle */}
            <rect x="25" y="15" width="22" height="90" rx="9" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
            <rect x="27" y="20" width="18" height="22" rx="6" fill="#334155" />
            <rect x="27" y="78" width="18" height="22" rx="6" fill="#334155" />
            {/* Cord curl indication */}
            <path d="M 36 105 C 36 115 48 115 48 100" stroke="#475569" strokeWidth="2" fill="none" />

            {/* Color Display Screen on Base */}
            <rect x="58" y="32" width="60" height="28" rx="4" fill="url(#phoneScreen)" stroke="#38bdf8" strokeWidth="1" />
            {/* Call Info text line */}
            <line x1="64" y1="40" x2="100" y2="40" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <line x1="64" y1="47" x2="88" y2="47" stroke="#bae6fd" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="108" cy="46" r="4" fill="#10b981" />

            {/* Keypad Buttons (Grid of 12 keys) */}
            <g transform="translate(62, 66)">
              {[
                { x: 0, y: 0 }, { x: 14, y: 0 }, { x: 28, y: 0 },
                { x: 0, y: 8 }, { x: 14, y: 8 }, { x: 28, y: 8 },
                { x: 0, y: 16 }, { x: 14, y: 16 }, { x: 28, y: 16 },
              ].map((btn, i) => (
                <rect key={i} x={btn.x} y={btn.y} width="10" height="6" rx="1.5" fill="#334155" stroke="#475569" strokeWidth="0.5" />
              ))}
            </g>

            {/* Navigation / Volume Dial */}
            <circle cx="114" cy="74" r="8" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
            <circle cx="114" cy="74" r="3" fill="#38bdf8" />
          </svg>

          <div className="text-center mt-1">
            <div className="text-xs font-bold text-white tracking-wide">Telecom & IP PBX</div>
            <div className="text-[10px] text-blue-400 font-mono">Panasonic • Cisco • Polycom</div>
          </div>
        </div>
      );

    case 'hardware':
      return (
        <div className={`relative flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-slate-900/95 via-amber-950/40 to-slate-950 border border-amber-500/40 shadow-xl shadow-amber-950/30 group hover:border-amber-400 transition-all ${className}`}>
          <div className="absolute inset-0 bg-amber-500/10 rounded-2xl blur-lg pointer-events-none" />

          <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24 sm:h-28 overflow-visible">
            <defs>
              <linearGradient id="driveMetal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f1f5f9" />
                <stop offset="70%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
              <linearGradient id="softwareBox" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
            </defs>

            {/* Enterprise Hard Disk Drive (Seagate / WD Enterprise) */}
            <g transform="translate(20, 20)">
              {/* Drive Enclosure Top Plate */}
              <rect x="0" y="0" width="70" height="85" rx="6" fill="url(#driveMetal)" stroke="#64748b" strokeWidth="1.2" />
              {/* Corner Screws */}
              <circle cx="6" cy="6" r="2" fill="#334155" />
              <circle cx="64" cy="6" r="2" fill="#334155" />
              <circle cx="6" cy="79" r="2" fill="#334155" />
              <circle cx="64" cy="79" r="2" fill="#334155" />

              {/* Spindle Motor Recess */}
              <circle cx="35" cy="45" r="26" fill="#0f172a" stroke="#475569" strokeWidth="1" />
              {/* Magnetic Platter mirror finish */}
              <circle cx="35" cy="45" r="20" fill="#38bdf8" opacity="0.4" stroke="#67e8f9" strokeWidth="1" />
              <circle cx="35" cy="45" r="8" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />

              {/* Label Sticker Header */}
              <rect x="8" y="10" width="54" height="16" rx="2" fill="#ffffff" />
              <rect x="12" y="14" width="20" height="3" fill="#0284c7" />
              <rect x="12" y="19" width="36" height="2" fill="#64748b" />
            </g>

            {/* Licensed Software Box (Microsoft / Notifier) on Right */}
            <g transform="translate(95, 25)">
              {/* 3D Isometric Software Box */}
              <polygon points="12,0 48,10 48,75 12,65" fill="url(#softwareBox)" stroke="#38bdf8" strokeWidth="1" />
              <polygon points="0,12 12,0 12,65 0,77" fill="#0369a1" stroke="#38bdf8" strokeWidth="1" />
              
              {/* Windows / Software 4-quadrant emblem */}
              <rect x="20" y="24" width="10" height="10" fill="#38bdf8" />
              <rect x="32" y="27" width="10" height="10" fill="#60a5fa" />
              <rect x="20" y="36" width="10" height="10" fill="#eab308" />
              <rect x="32" y="39" width="10" height="10" fill="#10b981" />

              {/* Brand text line on box */}
              <line x1="20" y1="56" x2="42" y2="62" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </svg>

          <div className="text-center mt-1">
            <div className="text-xs font-bold text-white tracking-wide">Hardware & Software</div>
            <div className="text-[10px] text-amber-400 font-mono">Seagate • Western Digital • Microsoft</div>
          </div>
        </div>
      );

    default:
      return null;
  }
};

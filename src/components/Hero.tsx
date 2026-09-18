import React from 'react';
import { Logo } from './Logo.tsx';
import { IsometricCoverTechArt } from './IsometricCoverTechArt.tsx';
import { 
  ArrowRight, 
  CheckCircle2, 
  ChevronDown
} from 'lucide-react';

interface HeroProps {
  lang: 'id' | 'en';
  onOpenEstimator: () => void;
  onOpenSlideDeck?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onOpenEstimator, onOpenSlideDeck }) => {
  return (
    <section 
      id="beranda" 
      className="relative min-h-[92vh] lg:min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-20 overflow-hidden flex flex-col justify-center bg-gradient-to-b from-[#030612] via-[#080c20] to-[#04050f]"
    >
      {/* Background Decorative 3D Blue-to-Orange Atmosphere */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        {/* Dual-color isometric coordinate dots (Cyan-Blue & Orange) */}
        <div 
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        />
        {/* Deep Sapphire Blue top-left 3D backlight */}
        <div className="absolute -top-24 -left-28 w-[620px] h-[620px] bg-blue-600/20 rounded-full blur-[170px]" />
        {/* Vibrant Sunset Orange right-side 3D backlight behind isometric scene */}
        <div className="absolute top-1/4 -right-28 w-[680px] h-[680px] bg-orange-600/22 rounded-full blur-[180px]" />
        {/* Bottom 3D floor blend (Blue to Orange) */}
        <div className="absolute -bottom-16 left-1/4 w-[850px] h-[280px] bg-gradient-to-r from-blue-600/15 via-indigo-600/10 to-orange-600/18 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Main Cover Slide Layout Grid (Matches image.png with 3D Blue-to-Orange Theme) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Cover Title & Company Identity (6 cols on lg) */}
          <div className="lg:col-span-6 space-y-6 text-left flex flex-col justify-center">
            
            {/* Top Brand Logo with Cyan Text & Golden Subtitle (Matching original cover) */}
            <div className="pb-1">
              <Logo size="xl" variant="cyan-gold" />
            </div>

            {/* Pill Container: PT. IHZA KARYA TEKNOLOGI (3D Blue-to-Orange Gradient with 3D Depth) */}
            <div className="pt-2">
              <div 
                id="hero-company-pill"
                className="inline-block px-7 py-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#1d4ed8] via-[#4338ca] to-[#ea580c] text-white shadow-[0_10px_35px_rgba(234,88,12,0.35),0_4px_16px_rgba(29,78,216,0.4)] border-t border-l border-cyan-400/40 border-b border-r border-orange-500/50 backdrop-blur-md transform transition-transform hover:scale-[1.01]"
              >
                <span className="block text-base sm:text-xl lg:text-2xl font-black tracking-wider font-display text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                  PT. IHZA KARYA TEKNOLOGI
                </span>
              </div>
            </div>

            {/* Giant Title: COMPANY PROFILE (3D High-Contrast Typography) */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase font-display leading-[1.04] drop-shadow-[0_6px_25px_rgba(234,88,12,0.25)]">
                COMPANY<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-orange-200">
                  PROFILE
                </span>
              </h1>
            </div>

            {/* Professional Corporate Tagline & Credential Statement Block */}
            <div className="relative rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/80 border border-slate-800/80 p-5 backdrop-blur-md shadow-xl shadow-black/40">
              {/* Dual-tone vertical accent neon line */}
              <div className="absolute top-0 left-0 bottom-0 w-1.5 rounded-l-2xl bg-gradient-to-b from-cyan-400 via-blue-500 to-orange-500 shadow-[0_0_12px_rgba(234,88,12,0.4)]" />

              <div className="pl-3 space-y-2.5">
                {/* Official Motto / Tagline */}
                <div className="flex items-baseline gap-2">
                  <span className="text-orange-400 text-lg font-serif select-none leading-none">“</span>
                  <p className="text-slate-100 font-bold text-sm sm:text-base tracking-wide font-sans leading-snug">
                    Delivering integrated, reliable, and scalable technology solutions.
                  </p>
                  <span className="text-cyan-400 text-lg font-serif select-none leading-none">”</span>
                </div>

                {/* Elaborated Strategic Value Proposition */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {lang === 'id' ? (
                    <>
                      Sinergi terpadu <strong className="text-cyan-300 font-semibold">ICT System Integrator</strong> <span className="text-slate-400">(Jaringan &amp; Keamanan)</span> dan <strong className="text-orange-400 font-semibold">Mechanical Electrical</strong> <span className="text-slate-400">(Catu Daya &amp; Otomasi)</span> untuk sektor korporasi, perbankan, pendidikan, infrastruktur &amp; pemerintahan.
                    </>
                  ) : (
                    <>
                      Integrated synergy of <strong className="text-cyan-300 font-semibold">ICT System Integration</strong> <span className="text-slate-400">(Network &amp; Security)</span> and <strong className="text-orange-400 font-semibold">Mechanical Electrical</strong> <span className="text-slate-400">(Power &amp; Automation)</span> across corporate, banking, education, infrastructure, and government sectors.
                    </>
                  )}
                </p>

                {/* Domain Focus Pills */}
                <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] font-mono">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-950/50 border border-cyan-500/30 text-cyan-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    ICT &amp; Cyber Security
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-950/50 border border-orange-500/30 text-orange-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    Mechanical &amp; Electrical
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/60 text-slate-300">
                    Enterprise Infrastructure
                  </span>
                </div>
              </div>
            </div>

            {/* Clean Single Primary CTA (Circled auxiliary buttons removed per request) */}
            <div className="pt-2 flex items-center gap-3.5">
              <a
                href="#layanan"
                id="hero-explore-btn"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-blue-400 to-orange-400 hover:from-cyan-300 hover:to-orange-300 shadow-[0_10px_25px_rgba(234,88,12,0.35)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{lang === 'id' ? 'Lihat Layanan & Solusi' : 'Explore Solutions'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Quick Proof Pills with Blue & Orange Accents */}
            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono text-slate-300">15+ Proyek Nasional</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
                <span className="font-mono text-slate-300">20+ Prinsipal Global</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-slate-300">10 Solusi Terpadu</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: 3D Isometric Cyber-Tech Scene (Exact match to image.png) (6 cols on lg) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            <div className="w-full relative">
              {/* Outer decorative glow frame */}
              <div className="relative rounded-3xl p-2 sm:p-4 bg-gradient-to-b from-slate-900/60 via-slate-950/90 to-[#06081c] border border-cyan-500/25 shadow-2xl shadow-cyan-950/40 backdrop-blur-sm">
                
                {/* Visual Top Status Indicator Bar */}
                <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-800/80 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-mono text-slate-300 tracking-wider">
                      SYSTEM_ACTIVE // INTEGRATED_INFRASTRUCTURE
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded">
                    3D VIEW
                  </div>
                </div>

                {/* 3D Isometric Vector Art reproduction */}
                <IsometricCoverTechArt />

                {/* Bottom Node Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800/80 text-[11px]">
                  <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-lg text-center">
                    <div className="text-cyan-400 font-bold font-mono">DATA CENTER</div>
                    <div className="text-slate-400 text-[10px]">Server &amp; Rack</div>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-lg text-center">
                    <div className="text-sky-400 font-bold font-mono">SECURITY</div>
                    <div className="text-slate-400 text-[10px]">CCTV &amp; Access</div>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-lg text-center">
                    <div className="text-amber-400 font-bold font-mono">ME POWER</div>
                    <div className="text-slate-400 text-[10px]">UPS &amp; Panel</div>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 p-2 rounded-lg text-center">
                    <div className="text-indigo-400 font-bold font-mono">TELECOM</div>
                    <div className="text-slate-400 text-[10px]">PABX &amp; Sound</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Metric Quick Strip at bottom */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-left">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-display">15+</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {lang === 'id' ? 'Proyek Skala Nasional' : 'National Projects'}
            </div>
          </div>
          <div className="text-left">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">10</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {lang === 'id' ? 'Pilar Layanan ICT & ME' : 'ICT & ME Solutions'}
            </div>
          </div>
          <div className="text-left">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-display">20+</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {lang === 'id' ? 'Prinsipal Brand Global' : 'Global Brands'}
            </div>
          </div>
          <div className="text-left">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-display">24/7</div>
            <div className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {lang === 'id' ? 'Dukungan & SLA Respons' : 'SLA & Support'}
            </div>
          </div>
        </div>

        {/* Scroll down indicator */}
        <div className="mt-10 flex justify-center">
          <a
            href="#tentang"
            className="group flex flex-col items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors"
            title="Scroll ke Tentang Kami"
          >
            <span className="font-mono tracking-wider uppercase text-[10px]">
              {lang === 'id' ? 'Gulir untuk profil lengkap' : 'Scroll to explore'}
            </span>
            <ChevronDown className="w-4 h-4 animate-bounce text-cyan-400" />
          </a>
        </div>

      </div>
    </section>
  );
};

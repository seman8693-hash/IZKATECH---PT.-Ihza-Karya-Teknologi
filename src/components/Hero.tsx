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
      className="relative min-h-[92vh] lg:min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-20 overflow-hidden flex flex-col justify-center bg-gradient-to-b from-white via-slate-50 to-slate-100"
    >
      {/* Background ambient terang (tema dashboard: slate + cyan) */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        {/* Isometric coordinate dots (cyan halus) */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #06b6d4 1px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        />
        {/* Backlight cyan kiri-atas */}
        <div className="absolute -top-24 -left-28 w-[620px] h-[620px] bg-cyan-400/25 rounded-full blur-[170px]" />
        {/* Backlight biru kanan */}
        <div className="absolute top-1/4 -right-28 w-[680px] h-[680px] bg-blue-400/25 rounded-full blur-[180px]" />
        {/* Floor blend bawah */}
        <div className="absolute -bottom-16 left-1/4 w-[850px] h-[280px] bg-gradient-to-r from-cyan-300/25 via-sky-300/20 to-blue-300/25 rounded-full blur-[140px]" />
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
                className="inline-block px-7 py-3.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 text-white shadow-[0_10px_35px_rgba(6,182,212,0.35),0_4px_16px_rgba(30,58,93,0.4)] border-t border-l border-cyan-400/50 border-b border-r border-blue-600/50 backdrop-blur-md transform transition-transform hover:scale-[1.01]"
              >
                <span className="block text-base sm:text-xl lg:text-2xl font-black tracking-wider font-display text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                  PT. IHZA KARYA TEKNOLOGI
                </span>
              </div>
            </div>

            {/* Giant Title: COMPANY PROFILE (3D High-Contrast Typography) */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 uppercase font-display leading-[1.04] drop-shadow-[0_2px_10px_rgba(14,58,93,0.15)]">
                COMPANY<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700">
                  PROFILE
                </span>
              </h1>
            </div>

            {/* Professional Corporate Tagline & Credential Statement Block */}
            <div className="relative rounded-2xl bg-white/85 border border-slate-200/80 p-5 backdrop-blur-md shadow-xl shadow-slate-300/50">
              {/* Dual-tone vertical accent line */}
              <div className="absolute top-0 left-0 bottom-0 w-1.5 rounded-l-2xl bg-gradient-to-b from-cyan-500 via-sky-500 to-blue-600" />

              <div className="pl-3 space-y-2.5">
                {/* Official Motto / Tagline */}
                <div className="flex items-baseline gap-2">
                  <span className="text-cyan-700 text-lg font-serif select-none leading-none">“</span>
                  <p className="text-slate-900 font-bold text-sm sm:text-base tracking-wide font-sans leading-snug">
                    Delivering integrated, reliable, and scalable technology solutions.
                  </p>
                  <span className="text-cyan-600 text-lg font-serif select-none leading-none">”</span>
                </div>

                {/* Elaborated Strategic Value Proposition */}
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {lang === 'id' ? (
                    <>
                      Sinergi terpadu <strong className="text-cyan-700 font-semibold">ICT System Integrator</strong> <span className="text-slate-500">(Jaringan &amp; Keamanan)</span> dan <strong className="text-cyan-700 font-semibold">Mechanical Electrical</strong> <span className="text-slate-500">(Catu Daya &amp; Otomasi)</span> untuk sektor korporasi, perbankan, pendidikan, infrastruktur &amp; pemerintahan.
                    </>
                  ) : (
                    <>
                      Integrated synergy of <strong className="text-cyan-700 font-semibold">ICT System Integration</strong> <span className="text-slate-500">(Network &amp; Security)</span> and <strong className="text-cyan-700 font-semibold">Mechanical Electrical</strong> <span className="text-slate-500">(Power &amp; Automation)</span> across corporate, banking, education, infrastructure, and government sectors.
                    </>
                  )}
                </p>

                {/* Domain Focus Pills */}
                <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] font-mono">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-50 border border-cyan-200 text-cyan-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                    ICT &amp; Cyber Security
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Mechanical &amp; Electrical
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200/60 text-slate-600">
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
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 shadow-[0_10px_25px_rgba(6,182,212,0.35)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{lang === 'id' ? 'Lihat Layanan & Solusi' : 'Explore Solutions'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Quick Proof Pills with Blue & Orange Accents */}
            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
                <span className="font-mono text-slate-600">15+ Proyek Nasional</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-700" />
                <span className="font-mono text-slate-600">20+ Prinsipal Global</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-mono text-slate-600">10 Solusi Terpadu</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: 3D Isometric Cyber-Tech Scene (Exact match to image.png) (6 cols on lg) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            <div className="w-full relative">
              {/* Outer decorative glow frame */}
              <div className="relative rounded-3xl p-2 sm:p-4 bg-gradient-to-b from-white via-slate-50 to-slate-100 border border-slate-200 shadow-2xl shadow-slate-300/60 backdrop-blur-sm">
                
                {/* Visual Top Status Indicator Bar */}
                <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-200/80 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-mono text-slate-600 tracking-wider">
                      SYSTEM_ACTIVE // INTEGRATED_INFRASTRUCTURE
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-cyan-700 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded">
                    3D VIEW
                  </div>
                </div>

                {/* 3D Isometric Vector Art reproduction */}
                <IsometricCoverTechArt />

                {/* Bottom Node Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-200/80 text-[11px]">
                  <div className="bg-white/85 border border-slate-200 p-2 rounded-lg text-center">
                    <div className="text-cyan-600 font-bold font-mono">DATA CENTER</div>
                    <div className="text-slate-500 text-[10px]">Server &amp; Rack</div>
                  </div>
                  <div className="bg-white/85 border border-slate-200 p-2 rounded-lg text-center">
                    <div className="text-sky-600 font-bold font-mono">SECURITY</div>
                    <div className="text-slate-500 text-[10px]">CCTV &amp; Access</div>
                  </div>
                  <div className="bg-white/85 border border-slate-200 p-2 rounded-lg text-center">
                    <div className="text-amber-600 font-bold font-mono">ME POWER</div>
                    <div className="text-slate-500 text-[10px]">UPS &amp; Panel</div>
                  </div>
                  <div className="bg-white/85 border border-slate-200 p-2 rounded-lg text-center">
                    <div className="text-indigo-600 font-bold font-mono">TELECOM</div>
                    <div className="text-slate-500 text-[10px]">PABX &amp; Sound</div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Metric Quick Strip at bottom */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-left">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-600 font-display">15+</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {lang === 'id' ? 'Proyek Skala Nasional' : 'National Projects'}
            </div>
          </div>
          <div className="text-left">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">10</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {lang === 'id' ? 'Pilar Layanan ICT & ME' : 'ICT & ME Solutions'}
            </div>
          </div>
          <div className="text-left">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-display">20+</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {lang === 'id' ? 'Prinsipal Brand Global' : 'Global Brands'}
            </div>
          </div>
          <div className="text-left">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-display">24/7</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {lang === 'id' ? 'Dukungan & SLA Respons' : 'SLA & Support'}
            </div>
          </div>
        </div>

        {/* Scroll down indicator */}
        <div className="mt-10 flex justify-center">
          <a
            href="#tentang"
            className="group flex flex-col items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-600 transition-colors"
            title="Scroll ke Tentang Kami"
          >
            <span className="font-mono tracking-wider uppercase text-[10px]">
              {lang === 'id' ? 'Gulir untuk profil lengkap' : 'Scroll to explore'}
            </span>
            <ChevronDown className="w-4 h-4 animate-bounce text-cyan-600" />
          </a>
        </div>

      </div>
    </section>
  );
};

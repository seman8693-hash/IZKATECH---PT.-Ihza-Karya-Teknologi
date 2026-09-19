import React from 'react';
import { Logo } from './Logo.tsx';
import { GeometricPrismArt } from './GeometricPrismArt.tsx';
import { COMPANY_INFO } from '../data/companyData.ts';
import { 
  Target, 
  Compass, 
  Award, 
  Clock, 
  Users, 
  ShieldCheck 
} from 'lucide-react';

interface AboutSectionProps {
  lang: 'id' | 'en';
}

export const AboutSection: React.FC<AboutSectionProps> = ({ lang }) => {
  return (
    <section id="tentang" className="py-20 lg:py-28 bg-white/60 relative border-t border-slate-200/80">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 text-xs font-semibold uppercase tracking-wider">
            {lang === 'id' ? 'Tentang PT. Ihza Karya Teknologi' : 'About PT. Ihza Karya Teknologi'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            {lang === 'id' 
              ? 'Mitra Strategis Transformasi Teknologi & Utilitas Bisnis Anda' 
              : 'Your Strategic Partner in Technology Transformation & Utilities'}
          </h2>
          <p className="text-slate-500 text-base leading-relaxed">
            {lang === 'id'
              ? 'Memadukan keahlian teknologi informasi modern dan ketangguhan mekanikal elektrikal untuk menghadirkan ekosistem operasional yang aman, stabil, dan siap bertumbuh.'
              : 'Combining modern information technology expertise with mechanical electrical resilience to build safe, stable, and future-proof enterprise ecosystems.'}
          </p>
        </div>

        {/* Official Page 2 Showcase Card (Exact match to Company Profile Page 2) */}
        <div className="bg-gradient-to-b from-slate-100 via-[#060c26] to-slate-100 border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-cyan-950/20 mb-16 relative overflow-hidden">
          {/* Subtle ambient light aura */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Top Bar: Brand Lockup on Left, 3D Glowing Wireframe Prism on Right */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-200/70 pb-6 mb-8 relative z-10">
            <div className="space-y-1">
              <Logo size="md" variant="cyan-gold" />
            </div>

            <div className="w-full sm:w-72 md:w-88 flex justify-end -my-4 sm:-my-6">
              <GeometricPrismArt className="w-full max-w-[320px]" />
            </div>
          </div>

          {/* 2-Column Side-by-Side: Welcome Message & About Us */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 relative z-10">
            {/* Left Column: Welcome Message */}
            <div className="space-y-3.5">
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
                Welcome Message
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm lg:text-[15px] leading-relaxed text-justify sm:text-left">
                {COMPANY_INFO.welcomeMessage}
              </p>
            </div>

            {/* Right Column: About Us */}
            <div className="space-y-3.5">
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
                About Us
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm lg:text-[15px] leading-relaxed text-justify sm:text-left">
                {COMPANY_INFO.about}
              </p>
            </div>
          </div>

          {/* Bottom Pillars Summary */}
          <div className="mt-10 pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs relative z-10">
            <div className="bg-white/85 border border-slate-200/80 p-3 rounded-xl text-center">
              <div className="text-cyan-600 font-bold text-sm">ICT &amp; ME</div>
              <div className="text-slate-500 text-xs mt-0.5">Integrasi Sistem Penuh</div>
            </div>
            <div className="bg-white/85 border border-slate-200/80 p-3 rounded-xl text-center">
              <div className="text-cyan-700 font-bold text-sm">Prinsipal Resmi</div>
              <div className="text-slate-500 text-xs mt-0.5">Garansi &amp; Lisensi Sah</div>
            </div>
            <div className="bg-white/85 border border-slate-200/80 p-3 rounded-xl text-center">
              <div className="text-cyan-600 font-bold text-sm">Respon Cepat</div>
              <div className="text-slate-500 text-xs mt-0.5">Layanan &amp; SLA Andal</div>
            </div>
            <div className="bg-white/85 border border-slate-200/80 p-3 rounded-xl text-center">
              <div className="text-cyan-700 font-bold text-sm">Profesional</div>
              <div className="text-slate-500 text-xs mt-0.5">Berpengalaman &amp; Teruji</div>
            </div>
          </div>
        </div>

        {/* Vision & Mission Cards Grid (page 7 of PDF) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Vision Card */}
          <div className="bg-gradient-to-br from-slate-100 to-slate-100 border border-slate-200 hover:border-cyan-500/40 transition-all rounded-2xl p-6 sm:p-8 relative group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wider">
                  {lang === 'id' ? 'Arah Strategis' : 'Strategic Compass'}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                  {lang === 'id' ? 'Visi Perusahaan' : 'Company Vision'}
                </h3>
              </div>
            </div>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed pl-1">
              "{COMPANY_INFO.vision}"
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-gradient-to-br from-slate-100 to-slate-100 border border-slate-200 hover:border-cyan-500/40 transition-all rounded-2xl p-6 sm:p-8 relative group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-600 group-hover:scale-105 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">
                  {lang === 'id' ? 'Komitmen Pelaksanaan' : 'Execution Commitments'}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
                  {lang === 'id' ? 'Misi Perusahaan' : 'Company Mission'}
                </h3>
              </div>
            </div>
            <ul className="space-y-3 pl-1 text-sm text-slate-600">
              {COMPANY_INFO.mission.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 border border-cyan-500/30 text-cyan-600 text-[11px] font-bold flex items-center justify-center mt-0.5">
                    {index + 1}
                  </span>
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4 Core Pillars of Service Excellence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/75 border border-slate-200/80 p-5 rounded-xl hover:border-slate-200 transition-colors">
            <Award className="w-6 h-6 text-cyan-600 mb-3" />
            <h4 className="text-base font-bold text-white mb-1">
              {lang === 'id' ? 'Standar Kualitas Terbaik' : 'Supreme Quality Standards'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === 'id' 
                ? 'Seluruh pengerjaan dan produk mengacu pada standar industri ICT dan keselamatan elektrikal.'
                : 'All deployments and equipment adhere to enterprise ICT standards and safety certifications.'}
            </p>
          </div>

          <div className="bg-white/75 border border-slate-200/80 p-5 rounded-xl hover:border-slate-200 transition-colors">
            <Clock className="w-6 h-6 text-sky-600 mb-3" />
            <h4 className="text-base font-bold text-white mb-1">
              {lang === 'id' ? 'Respon Cepat & Tepat' : 'Fast & Accurate Response'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === 'id'
                ? 'Tim tanggap siap melayani konsultasi pra-proyek, penanganan kendala, dan maintenance terjadwal.'
                : 'Responsive technical engineering for pre-project advisory, rapid troubleshooting, and SLAs.'}
            </p>
          </div>

          <div className="bg-white/75 border border-slate-200/80 p-5 rounded-xl hover:border-slate-200 transition-colors">
            <Users className="w-6 h-6 text-blue-600 mb-3" />
            <h4 className="text-base font-bold text-white mb-1">
              {lang === 'id' ? 'SDM Tersertifikasi' : 'Certified Human Resources'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === 'id'
                ? 'Didukung engineer dan teknisi berpengalaman, berintegritas, dan bersertifikasi prinsipal.'
                : 'Backed by experienced, certified system engineers with a high level of integrity and precision.'}
            </p>
          </div>

          <div className="bg-white/75 border border-slate-200/80 p-5 rounded-xl hover:border-slate-200 transition-colors">
            <ShieldCheck className="w-6 h-6 text-emerald-600 mb-3" />
            <h4 className="text-base font-bold text-white mb-1">
              {lang === 'id' ? 'Solusi Terintegrasi Penuh' : 'Fully Integrated Solution'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {lang === 'id'
                ? 'Sinergi sistem ICT dan Mechanical Electrical memastikan kehandalan sistem tanpa friksi vendor.'
                : 'Seamless synergy of ICT networks and Mechanical Electrical utilities under one unified provider.'}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

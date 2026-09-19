import React from 'react';
import { TARGET_MARKETS, COMPANY_INFO } from '../data/companyData.ts';
import { 
  Building2, 
  Factory, 
  GraduationCap, 
  Hotel, 
  TrainTrack, 
  Landmark, 
  CheckCircle2, 
  TrendingUp, 
  Award
} from 'lucide-react';

interface MarketSectionProps {
  lang: 'id' | 'en';
}

export const MarketSection: React.FC<MarketSectionProps> = ({ lang }) => {
  const getMarketIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6 text-cyan-600' };
    switch (iconName) {
      case 'Building2': return <Building2 {...props} />;
      case 'Factory': return <Factory {...props} />;
      case 'GraduationCap': return <GraduationCap {...props} />;
      case 'Hotel': return <Hotel {...props} />;
      case 'TrainTrack': return <TrainTrack {...props} />;
      case 'Landmark': return <Landmark {...props} />;
      default: return <Building2 {...props} />;
    }
  };

  return (
    <section id="keunggulan" className="py-20 lg:py-28 bg-slate-505 border-t border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 text-xs font-semibold uppercase tracking-wider">
            {lang === 'id' ? 'Posisi Pasar & Keunggulan Kompetitif' : 'Market Position & Competitive Edge'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            {lang === 'id' 
              ? 'Mengapa Memilih PT. Ihza Karya Teknologi?' 
              : 'Why Partner with PT. Ihza Karya Teknologi?'}
          </h2>
          <p className="text-slate-500 text-base leading-relaxed">
            {lang === 'id'
              ? 'Sinergi unik antara kemampuan sistem informasi (ICT) terdepan dan dukungan Mechanical & Electrical (ME) menjadikan kami mitra komprehensif bagi akselerasi bisnis Anda.'
              : 'The unique synergy between ICT systems integration and Mechanical & Electrical support makes us the single-source partner for enterprise expansion.'}
          </p>
        </div>

        {/* Industry Overview & Competitive Advantage Cards (page 8) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Industry Overview */}
          <div className="bg-gradient-to-br from-slate-100 to-slate-100 border border-slate-200 rounded-2xl p-6 sm:p-8 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                {lang === 'id' ? 'Tinjauan Industri (Industry Overview)' : 'Industry Overview'}
              </h3>
            </div>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed text-justify sm:text-left">
              {COMPANY_INFO.industryOverview}
            </p>
            <div className="mt-5 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
              <span className="text-cyan-600 font-semibold">Transformasi Digital Berkelanjutan</span>
              <span>Skala Nasional</span>
            </div>
          </div>

          {/* Competitive Advantage */}
          <div className="bg-gradient-to-br from-slate-100 to-slate-100 border border-slate-200 rounded-2xl p-6 sm:p-8 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-600">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                {lang === 'id' ? 'Keunggulan Kompetitif (Competitive Advantage)' : 'Competitive Advantage'}
              </h3>
            </div>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed text-justify sm:text-left">
              {COMPANY_INFO.competitiveAdvantage}
            </p>
            <div className="mt-5 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
              <span className="text-sky-600 font-semibold">Sinergi ICT + Dukungan ME</span>
              <span>Fast &amp; Professional</span>
            </div>
          </div>
        </div>

        {/* 5 Key Points & Conclusions (page 9) */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white font-display">
              {lang === 'id' ? '5 Nilai Kunci & Kesimpulan Komitmen' : '5 Core Strategic Key Points'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {lang === 'id' ? 'Prinsip kerja yang senantiasa kami jaga dalam setiap penugasan proyek.' : 'The foundational principles driving every deployment.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {COMPANY_INFO.keyPoints.map((kp, idx) => (
              <div 
                key={idx}
                className="bg-white/90 border border-slate-200 hover:border-cyan-500/40 rounded-xl p-5 flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="text-2xl font-extrabold text-slate-700 group-hover:text-cyan-600 transition-colors font-mono mb-2">
                    0{idx + 1}
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2 leading-snug group-hover:text-cyan-700 transition-colors">
                    {kp.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {kp.desc}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-300 flex items-center gap-1.5 text-[11px] text-cyan-600 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Komitmen Penuh</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Target Market Sectors & Demographics (page 6) */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-bold text-white font-display">
              {lang === 'id' ? 'Sektor Industri yang Kami Layani' : 'Target Market Sectors & Demographics'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {lang === 'id' 
                ? 'Organisasi skala kecil hingga besar di wilayah perkotaan maupun kawasan berkembang yang membutuhkan sistem teknologi andal, aman, dan terintegrasi.'
                : 'Small to enterprise-scale organizations in urban and developing economic corridors seeking secure, scalable technology.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TARGET_MARKETS.map((tm, idx) => (
              <div
                key={idx}
                className="bg-white/75 border border-slate-200/80 hover:border-slate-200 rounded-2xl p-6 transition-all"
              >
                <div className="p-3 w-fit rounded-xl bg-white border border-slate-200 mb-4">
                  {getMarketIcon(tm.icon)}
                </div>
                <h4 className="text-base font-bold text-white mb-2 font-display">
                  {tm.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 mb-4 leading-relaxed">
                  {tm.description}
                </p>
                <div className="text-xs text-slate-500 pt-3 border-t border-slate-200/60">
                  <span className="font-semibold text-cyan-600/90">Contoh Proyek:</span> {tm.examples}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

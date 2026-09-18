import React, { useState } from 'react';
import { Logo } from './Logo.tsx';
import { ConcentricRingsArt } from './ConcentricRingsArt.tsx';
import { SERVICES, COMPANY_INFO } from '../data/companyData.ts';
import { ServiceItem } from '../types/site.ts';
import { 
  Server, 
  ShieldCheck, 
  PhoneCall, 
  Camera, 
  Fingerprint, 
  Flame, 
  Volume2, 
  Zap, 
  Cpu, 
  Wrench,
  ArrowRight,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface ServicesSectionProps {
  lang: 'id' | 'en';
  onSelectService: (service: ServiceItem) => void;
  onOpenEstimatorWithService: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  lang,
  onSelectService,
  onOpenEstimatorWithService
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', labelId: 'Semua Solusi (10)', labelEn: 'All Solutions (10)' },
    { id: 'network', labelId: 'Jaringan & Data Center', labelEn: 'Network & DC' },
    { id: 'security', labelId: 'Keamanan & Surveillance', labelEn: 'Security & CCTV' },
    { id: 'telecom', labelId: 'Telekomunikasi & Audio', labelEn: 'Telecom & Sound' },
    { id: 'me', labelId: 'Mechanical Electrical (ME)', labelEn: 'Mechanical Electrical' },
    { id: 'hardware', labelId: 'Pengadaan Hardware & SW', labelEn: 'Supply & Hardware' },
    { id: 'maintenance', labelId: 'Maintenance & SLA', labelEn: 'Maintenance & SLA' }
  ];

  const filteredServices = activeCategory === 'all'
    ? SERVICES
    : SERVICES.filter((s) => s.category === activeCategory);

  const getServiceIcon = (iconName: string) => {
    const props = { className: 'w-6 h-6' };
    switch (iconName) {
      case 'Server': return <Server {...props} />;
      case 'ShieldCheck': return <ShieldCheck {...props} />;
      case 'PhoneCall': return <PhoneCall {...props} />;
      case 'Camera': return <Camera {...props} />;
      case 'Fingerprint': return <Fingerprint {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Volume2': return <Volume2 {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      case 'Wrench': return <Wrench {...props} />;
      default: return <Server {...props} />;
    }
  };

  return (
    <section id="layanan" className="py-20 lg:py-28 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 -right-36 w-80 h-80 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            {lang === 'id' ? 'Katalog Produk & Layanan' : 'Products & Services Catalog'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            {lang === 'id' 
              ? 'Solusi Teknologi & Utilitas Terintegrasi' 
              : 'Integrated Technology & Utility Solutions'}
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            {lang === 'id'
              ? 'Kami menyediakan berbagai solusi teknologi terintegrasi yang mencakup sistem jaringan, keamanan, komunikasi, serta dukungan Mechanical & Electrical untuk memenuhi kebutuhan operasional modern.'
              : 'Delivering end-to-end integrated technology solutions covering networking, security, communications, and Mechanical & Electrical support for modern operational demands.'}
          </p>
        </div>

        {/* Official Page 3 Showcase Card (Matching Company Profile Page 3) */}
        <div className="bg-gradient-to-b from-slate-950 via-[#070b24] to-slate-950 border border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-cyan-950/20 mb-16 relative overflow-hidden">
          {/* Subtle ambient light aura */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Top Bar: Brand Lockup on Left, 3D Glowing Concentric Rings on Right */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-800/70 pb-6 mb-8 relative z-10">
            <div>
              <Logo size="md" variant="cyan-gold" />
            </div>

            <div className="w-full sm:w-72 md:w-88 flex justify-end -my-4 sm:-my-6">
              <ConcentricRingsArt className="w-full max-w-[320px]" />
            </div>
          </div>

          {/* Main Content: Left Column (Title & Description), Right Column (White Card with 10 Services) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Column: Heading & Paragraph */}
            <div className="lg:col-span-5 space-y-4 text-left">
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-sans leading-[1.1]">
                Products and<br />Services
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm lg:text-[15px] leading-relaxed font-sans">
                {lang === 'id'
                  ? 'Kami menyediakan berbagai solusi teknologi terintegrasi yang mencakup sistem jaringan, keamanan, komunikasi, serta dukungan Mechanical & Electrical untuk memenuhi kebutuhan operasional modern.'
                  : 'We deliver comprehensive integrated technology solutions covering network systems, security, communications, and Mechanical & Electrical support to satisfy modern operational requirements.'}
              </p>
            </div>

            {/* Right Column: Clean White Rounded Card with 10 Official Bullet Points */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-6 sm:p-8 lg:p-9 shadow-2xl text-slate-900">
                <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-[13px] lg:text-sm font-bold tracking-wide font-sans leading-tight">
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950 shrink-0" />
                    <span>DATA CENTER &amp; NETWORK INFRASTRUCTURE</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950 shrink-0" />
                    <span>NETWORK SECURITY</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950 shrink-0" />
                    <span>TELECOMMUNICATION EQUIPMENT</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950 shrink-0" />
                    <span>SURVEILLANCE</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950 shrink-0" />
                    <span>ACCESS CONTROL, FINGERPRINT, RFID, &amp; SMART CARD</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950 shrink-0" />
                    <span>FIRE ALARM SYSTEM</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950 shrink-0" />
                    <span>SOUND SYSTEM</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950 shrink-0" />
                    <span>MECHANICAL ELECTRICAL</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950 shrink-0" />
                    <span>HARDWARE &amp; SOFTWARE EQUIPMENT</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950 shrink-0" />
                    <span>MAINTENANCE SERVICES</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 scale-105'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {lang === 'id' ? cat.labelId : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Services Grid (10 Core Pillars) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className="bg-slate-900/80 border border-slate-800/90 hover:border-cyan-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/30 group hover:-translate-y-1 relative"
            >
              {/* Card Top */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 group-hover:text-cyan-300 transition-all">
                    {getServiceIcon(service.iconName)}
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 group-hover:text-cyan-400 transition-colors">
                    #0{SERVICES.findIndex(s => s.id === service.id) + 1}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-display group-hover:text-cyan-300 transition-colors">
                  {lang === 'id' ? service.title : service.titleEn}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                  {lang === 'id' ? service.description : service.descriptionEn}
                </p>

                {/* Key features checklist */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80 mb-4">
                  {(lang === 'id' ? service.features : service.featuresEn).slice(0, 3).map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                  {service.features.length > 3 && (
                    <div className="text-[11px] text-cyan-400/80 pl-5">
                      +{service.features.length - 3} {lang === 'id' ? 'fitur lainnya...' : 'more features...'}
                    </div>
                  )}
                </div>

                {/* Associated Brand Badges */}
                {service.brands && service.brands.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {service.brands.slice(0, 4).map((brand, bIdx) => (
                      <span
                        key={bIdx}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectService(service)}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>{lang === 'id' ? 'Lihat Spesifikasi' : 'View Details'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onOpenEstimatorWithService(service.title)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-cyan-500/40 transition-colors cursor-pointer"
                >
                  {lang === 'id' ? 'Minta Penawaran' : 'Request Quote'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner for Custom Integration */}
        <div className="mt-14 bg-gradient-to-r from-slate-900 via-slate-900/95 to-cyan-950/40 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-lg sm:text-xl font-bold text-white font-display">
              {lang === 'id' 
                ? 'Membutuhkan Solusi Custom atau Konsultasi Spesifikasi Proyek?' 
                : 'Need Custom Integration or Project Tender Consulting?'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              {lang === 'id'
                ? 'Tim arsitek solusi dan teknisi IZKATECH siap membantu asesmen lokasi, perancangan diagram jaringan, Bill of Quantity (BoQ), hingga instalasi turn-key.'
                : 'IZKATECH solution architects provide on-site assessments, network topology schematics, Bill of Quantities (BoQ), and turn-key deployments.'}
            </p>
          </div>

          <a
            href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=Halo%20PT.%20Ihza%20Karya%20Teknologi,%20saya%20membutuhkan%20konsultasi%20solusi%20custom.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/20"
          >
            <span>{lang === 'id' ? 'Konsultasi Tim Ahli' : 'Consult Solution Architect'}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};

import React, { useState, useEffect } from 'react';
import { Logo } from './Logo.tsx';
import { ConcentricRingsArt } from './ConcentricRingsArt.tsx';
import { EquipmentVisualShowcase } from './EquipmentVisualShowcase.tsx';
import { BRAND_PARTNERS } from '../data/companyData.ts';
import { getPartnerLogo, getPartnerDisplayName } from '../data/adminStore.ts';
import { ShieldCheck, Award, Layers, Cpu, Radio, Camera, KeyRound } from 'lucide-react';

interface PartnersSectionProps {
  lang: 'id' | 'en';
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({ lang }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeDevice, setActiveDevice] = useState<'cctv' | 'access-control' | 'network-security' | 'telecom' | 'hardware'>('cctv');
  const [, setRefreshTick] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setRefreshTick((prev) => prev + 1);
    window.addEventListener('izkatech_brand_updated', handleUpdate);
    return () => window.removeEventListener('izkatech_brand_updated', handleUpdate);
  }, []);

  const categories = [
    { id: 'all', labelId: 'Semua Brand (20+)', labelEn: 'All Brands (20+)' },
    { id: 'cctv', labelId: 'Surveillance & CCTV', labelEn: 'CCTV & Surveillance' },
    { id: 'access', labelId: 'Access Control & Biometric', labelEn: 'Access & Biometrics' },
    { id: 'security', labelId: 'Network Security & Firewall', labelEn: 'Network Security' },
    { id: 'telecom', labelId: 'Telekomunikasi & Unified Comms', labelEn: 'Telecommunications' },
    { id: 'supply', labelId: 'Hardware, Audio & Alarm Supply', labelEn: 'Hardware, Alarm & Sound' },
  ];

  const filteredBrands = selectedCategory === 'all'
    ? BRAND_PARTNERS
    : BRAND_PARTNERS.filter((b) => b.categoryKey === selectedCategory);

  const getCategoryIcon = (key: string) => {
    switch (key) {
      case 'cctv': return <Camera className="w-4 h-4 text-cyan-600" />;
      case 'access': return <KeyRound className="w-4 h-4 text-sky-600" />;
      case 'security': return <ShieldCheck className="w-4 h-4 text-blue-600" />;
      case 'telecom': return <Radio className="w-4 h-4 text-indigo-600" />;
      case 'supply': return <Cpu className="w-4 h-4 text-teal-400" />;
      default: return <Layers className="w-4 h-4 text-cyan-600" />;
    }
  };

  return (
    <section id="partner" className="py-20 lg:py-28 bg-white/70 border-y border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 text-xs font-semibold uppercase tracking-wider">
            {lang === 'id' ? 'Ekosistem Teknologi & Prinsipal' : 'Technology Ecosystem & Principals'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            {lang === 'id' 
              ? 'Didukung Brand Global Terkemuka & Terpercaya' 
              : 'Backed by World-Class Global Enterprise Brands'}
          </h2>
          <p className="text-slate-500 text-base leading-relaxed">
            {lang === 'id'
              ? 'PT. Ihza Karya Teknologi bermitra dengan prinsipal teknologi kelas dunia untuk menjamin keaslian perangkat, standar ketahanan industri, dan garansi resmi purna jual.'
              : 'PT. Ihza Karya Teknologi partners with tier-1 technology principals ensuring genuine equipment, enterprise-grade resilience, and direct manufacturer support.'}
          </p>
        </div>

        {/* Official Page 4 Showcase Card (Matching Company Profile Page 4) */}
        <div className="bg-gradient-to-b from-slate-100 via-[#070b24] to-slate-100 border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-cyan-950/20 mb-16 relative overflow-hidden">
          {/* Subtle ambient light aura */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Top Bar: Framed Logo with geometric lines on Left, 3D Concentric Rings Art on Right */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-200/70 pb-6 mb-8 relative z-10">
            <div className="relative pl-3.5 pt-1">
              {/* Purple vertical line going down past the globe */}
              <div className="absolute left-0 -top-6 bottom-0 w-[2px] bg-gradient-to-b from-purple-400 via-indigo-400 to-indigo-600/40" />
              
              <Logo size="md" variant="cyan-gold" />
              
              {/* Cyan horizontal underline bar directly below ICT SYSTEM INTEGRATOR & ME */}
              <div className="mt-2 w-48 sm:w-56 h-[2px] bg-gradient-to-r from-cyan-600 via-cyan-300 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
            </div>

            <div className="w-full sm:w-72 md:w-88 flex justify-end -my-4 sm:-my-6">
              <ConcentricRingsArt className="w-full max-w-[320px]" />
            </div>
          </div>

          {/* Main Content: Left Column (Signature Modern White Card - Desain Kekinian), Right Column (Interactive Equipment Showcase) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Column: Signature Modern White Rounded Card (Desain Kekinian matching uploaded photo) */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl sm:rounded-[36px] p-6 sm:p-8 shadow-2xl text-slate-900 border border-slate-100">
                <div className="space-y-3.5 text-left">
                  {/* 1. CCTV */}
                  <div 
                    onClick={() => setActiveDevice('cctv')}
                    className={`p-3 rounded-2xl transition-all cursor-pointer ${
                      activeDevice === 'cctv'
                        ? 'bg-slate-100/90 shadow-sm ring-2 ring-cyan-500/40'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 transition-colors ${
                        activeDevice === 'cctv' ? 'bg-cyan-600' : 'bg-white'
                      }`} />
                      <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-wide font-sans">
                        CCTV
                      </span>
                      {activeDevice === 'cctv' && (
                        <span className="ml-auto text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold">
                          PREVIEW VISUAL
                        </span>
                      )}
                    </div>
                    <div className="pl-5 text-xs sm:text-sm lg:text-[15px] text-slate-600 font-sans tracking-wide leading-relaxed mt-1 font-medium">
                      (Hikvision, Dahua, Avigilon, Samsung, Uniview)
                    </div>
                  </div>

                  {/* 2. ACCESS CONTROL */}
                  <div 
                    onClick={() => setActiveDevice('access-control')}
                    className={`p-3 rounded-2xl transition-all cursor-pointer ${
                      activeDevice === 'access-control'
                        ? 'bg-slate-100/90 shadow-sm ring-2 ring-indigo-500/40'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 transition-colors ${
                        activeDevice === 'access-control' ? 'bg-indigo-600' : 'bg-white'
                      }`} />
                      <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-wide font-sans">
                        ACCESS CONTROL
                      </span>
                      {activeDevice === 'access-control' && (
                        <span className="ml-auto text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
                          PREVIEW VISUAL
                        </span>
                      )}
                    </div>
                    <div className="pl-5 text-xs sm:text-sm lg:text-[15px] text-slate-600 font-sans tracking-wide leading-relaxed mt-1 font-medium">
                      (HID, Suprema, Entry Pass)
                    </div>
                  </div>

                  {/* 3. NETWORK SECURITY */}
                  <div 
                    onClick={() => setActiveDevice('network-security')}
                    className={`p-3 rounded-2xl transition-all cursor-pointer ${
                      activeDevice === 'network-security'
                        ? 'bg-slate-100/90 shadow-sm ring-2 ring-sky-500/40'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 transition-colors ${
                        activeDevice === 'network-security' ? 'bg-sky-600' : 'bg-white'
                      }`} />
                      <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-wide font-sans">
                        NETWORK SECURITY
                      </span>
                      {activeDevice === 'network-security' && (
                        <span className="ml-auto text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold">
                          PREVIEW VISUAL
                        </span>
                      )}
                    </div>
                    <div className="pl-5 text-xs sm:text-sm lg:text-[15px] text-slate-600 font-sans tracking-wide leading-relaxed mt-1 font-medium">
                      (Watchguard, Fortinet, Sangfor)
                    </div>
                  </div>

                  {/* 4. TELECOMMUNICATION EQUIPMENT */}
                  <div 
                    onClick={() => setActiveDevice('telecom')}
                    className={`p-3 rounded-2xl transition-all cursor-pointer ${
                      activeDevice === 'telecom'
                        ? 'bg-slate-100/90 shadow-sm ring-2 ring-blue-500/40'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 transition-colors ${
                        activeDevice === 'telecom' ? 'bg-blue-600' : 'bg-white'
                      }`} />
                      <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-wide font-sans">
                        TELECOMMUNICATION EQUIPMENT
                      </span>
                      {activeDevice === 'telecom' && (
                        <span className="ml-auto text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                          PREVIEW VISUAL
                        </span>
                      )}
                    </div>
                    <div className="pl-5 text-xs sm:text-sm lg:text-[15px] text-slate-600 font-sans tracking-wide leading-relaxed mt-1 font-medium">
                      (Panasonic, Polycom, NEC, Cisco, Alcatel-Lucent)
                    </div>
                  </div>

                  {/* 5. HARDWARE & SOFTWARE SUPPLY */}
                  <div 
                    onClick={() => setActiveDevice('hardware')}
                    className={`p-3 rounded-2xl transition-all cursor-pointer ${
                      activeDevice === 'hardware'
                        ? 'bg-slate-100/90 shadow-sm ring-2 ring-amber-500/40'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 transition-colors ${
                        activeDevice === 'hardware' ? 'bg-amber-600' : 'bg-white'
                      }`} />
                      <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-wide font-sans">
                        HARDWARE &amp; SOFTWARE SUPPLY
                      </span>
                      {activeDevice === 'hardware' && (
                        <span className="ml-auto text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                          PREVIEW VISUAL
                        </span>
                      )}
                    </div>
                    <div className="pl-5 text-xs sm:text-sm lg:text-[15px] text-slate-600 font-sans tracking-wide leading-relaxed mt-1 font-medium">
                      (Seagate, Linksys, Western Digital, Notifier, Microsoft, HP, Hooseki, TOA)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Hardware Graphic Showcase & Selector */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white/90 border border-slate-200 rounded-3xl p-5 shadow-2xl relative">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                  <span className="text-xs font-mono text-cyan-600 font-bold uppercase tracking-wider">
                    Equipment Showcase
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    High-Tech Illustration
                  </span>
                </div>

                {/* Vector Visual */}
                <EquipmentVisualShowcase 
                  type={activeDevice} 
                  className="w-full"
                />

                {/* Quick Thumbnail Switcher Strip */}
                <div className="grid grid-cols-5 gap-1.5 pt-4 border-t border-slate-200/80 mt-4">
                  {(['cctv', 'access-control', 'network-security', 'telecom', 'hardware'] as const).map((dev) => (
                    <button
                      key={dev}
                      onClick={() => setActiveDevice(dev)}
                      className={`px-1.5 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer text-center ${
                        activeDevice === dev
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30 scale-105'
                          : 'bg-white text-slate-500 hover:text-white hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {dev === 'cctv' ? 'CCTV' : dev === 'access-control' ? 'Access' : dev === 'network-security' ? 'Security' : dev === 'telecom' ? 'Telecom' : 'HW/SW'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-white text-slate-500 hover:text-white hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {lang === 'id' ? cat.labelId : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Brand Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredBrands.map((brand, index) => {
            const customLogo = getPartnerLogo(brand.name);
            const displayName = getPartnerDisplayName(brand.name);

            return (
              <div
                key={index}
                className="bg-white/95 border border-slate-200/90 hover:border-cyan-500/50 rounded-xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:shadow-cyan-950/20 group text-left"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center min-w-[36px] min-h-[36px]">
                    {customLogo ? (
                      <img src={customLogo} alt={displayName} className="w-8 h-8 object-contain rounded" />
                    ) : (
                      getCategoryIcon(brand.categoryKey)
                    )}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 group-hover:text-cyan-600 transition-colors font-mono">
                    Official
                  </span>
                </div>

                <div>
                  <div className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors font-display leading-tight">
                    {displayName}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-tight line-clamp-2">
                    {brand.category}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center gap-1.5 text-[10px] text-slate-500">
                  <Award className="w-3 h-3 text-cyan-600/80" />
                  <span>Enterprise Certified</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Assurance Banner */}
        <div className="mt-12 bg-white/75 border border-slate-200 rounded-xl p-5 flex flex-wrap items-center justify-around gap-6 text-center text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>100% Produk Original &amp; Berlisensi Resmi</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>Garansi Prinsipal &amp; Purna Jual SLA</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Engineer Tersertifikasi Vendor Spesifik</span>
          </div>
        </div>

      </div>
    </section>
  );
};

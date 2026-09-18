import React, { useState } from 'react';
import { Logo } from './Logo.tsx';
import { IsometricCoverTechArt } from './IsometricCoverTechArt.tsx';
import { GeometricPrismArt } from './GeometricPrismArt.tsx';
import { ConcentricRingsArt } from './ConcentricRingsArt.tsx';
import { EquipmentVisualShowcase } from './EquipmentVisualShowcase.tsx';
import { COMPANY_INFO, PROJECTS, BRAND_PARTNERS } from '../data/companyData.ts';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  Mail, 
  MapPin
} from 'lucide-react';

interface PresentationSlideDeckProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'id' | 'en';
}

export const PresentationSlideDeck: React.FC<PresentationSlideDeckProps> = ({ 
  isOpen, 
  onClose,
  lang 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [page4ActiveDevice, setPage4ActiveDevice] = useState<'cctv' | 'access-control' | 'network-security' | 'telecom' | 'hardware'>('cctv');

  if (!isOpen) return null;

  const totalSlides = 8;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-3 sm:p-6 select-none animate-fadeIn">
      {/* Slide Navigation Top Control Bar */}
      <div className="w-full max-w-6xl flex items-center justify-between py-2 px-4 bg-slate-900/90 border border-slate-800 rounded-xl mb-3 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <Logo size="sm" variant="cyan-gold" />
          <span className="hidden sm:inline font-mono text-cyan-400">|</span>
          <span className="font-mono text-[11px] text-slate-400">
            SLIDE {currentSlide + 1} OF {totalSlides}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Slide dots */}
          <div className="hidden md:flex items-center gap-1.5 mr-3">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? 'w-6 bg-cyan-400' : 'bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
            title="Slide Sebelumnya (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
            title="Slide Berikutnya (Right Arrow)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 ml-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
            title="Tutup Mode Presentasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 16:9 Presentation Stage Card */}
      <div className="w-full max-w-6xl aspect-[16/9] bg-gradient-to-br from-[#06081c] via-[#090b27] to-[#040514] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden relative flex flex-col justify-between p-6 sm:p-10 lg:p-12">
        
        {/* ========================================================
            SLIDE 0: EXACT COVER SLIDE (Matching image.png)
            ======================================================== */}
        {currentSlide === 0 && (
          <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-fadeIn">
            {/* Left Cover Details */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <Logo size="xl" variant="cyan-gold" />
              
              <div>
                <div className="inline-block px-7 py-2.5 rounded-3xl bg-gradient-to-r from-[#1d4ed8] via-[#4338ca] to-[#ea580c] text-white shadow-[0_10px_30px_rgba(234,88,12,0.35)] border-t border-l border-cyan-400/40 border-b border-r border-orange-500/50">
                  <span className="text-lg sm:text-xl font-bold tracking-wider font-display drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
                    PT. IHZA KARYA TEKNOLOGI
                  </span>
                </div>
              </div>

              <div>
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase font-display leading-[1.05] drop-shadow-[0_4px_20px_rgba(234,88,12,0.25)]">
                  COMPANY<br />PROFILE
                </h1>
              </div>

              <div className="relative pl-4 py-1 space-y-1.5">
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-cyan-400 via-blue-500 to-orange-500" />
                <p className="text-white font-bold text-xs sm:text-sm font-sans">
                  “Delivering integrated, reliable, and scalable technology solutions.”
                </p>
                <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed">
                  Sinergi terpadu <span className="text-cyan-300 font-semibold">ICT System Integrator</span> &amp; <span className="text-orange-400 font-semibold">Mechanical Electrical</span> untuk korporasi, perbankan, pendidikan, infrastruktur &amp; pemerintahan.
                </p>
              </div>
            </div>

            {/* Right Isometric Art */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="w-full max-w-lg">
                <IsometricCoverTechArt interactive={false} />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            SLIDE 1: ABOUT US & GREETINGS (PAGE 02 EXACT MATCH)
            ======================================================== */}
        {currentSlide === 1 && (
          <div className="w-full h-full flex flex-col justify-between text-left animate-fadeIn relative z-10">
            {/* Top Bar: Logo on Left, 3D Wireframe Glowing Prism Art on Right */}
            <div className="flex items-start justify-between gap-6 -mt-2 sm:-mt-4">
              <div className="pt-2">
                <Logo size="md" variant="cyan-gold" />
              </div>
              
              <div className="w-48 sm:w-64 md:w-80 lg:w-96 flex justify-end">
                <GeometricPrismArt className="w-full max-w-[340px] -mt-4 sm:-mt-6" />
              </div>
            </div>

            {/* Main Content: 2-Column Side-by-Side (Welcome Message & About Us) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 pt-1 sm:pt-3">
              {/* Left Column: Welcome Message */}
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
                  Welcome Message
                </h2>
                <p className="text-xs sm:text-[13px] lg:text-sm text-slate-200/95 leading-relaxed text-justify">
                  {COMPANY_INFO.welcomeMessage}
                </p>
              </div>

              {/* Right Column: About Us */}
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
                  About Us
                </h2>
                <p className="text-xs sm:text-[13px] lg:text-sm text-slate-200/95 leading-relaxed text-justify">
                  {COMPANY_INFO.about}
                </p>
              </div>
            </div>

            {/* Slide Footer */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span className="tracking-wider">IZKATECH COMPANY PROFILE</span>
              <span className="text-cyan-400 font-semibold">PAGE 02</span>
            </div>
          </div>
        )}

        {/* ========================================================
            SLIDE 2: PRODUCTS AND SERVICES (PAGE 03 EXACT MATCH)
            ======================================================== */}
        {currentSlide === 2 && (
          <div className="w-full h-full flex flex-col justify-between text-left animate-fadeIn relative z-10">
            {/* Top Bar: Logo on Left, 3D Concentric Rings Art on Right */}
            <div className="flex items-start justify-between gap-6 -mt-2 sm:-mt-4">
              <div className="pt-2">
                <Logo size="md" variant="cyan-gold" />
              </div>

              <div className="w-48 sm:w-64 md:w-80 lg:w-96 flex justify-end">
                <ConcentricRingsArt className="w-full max-w-[340px] -mt-5 sm:-mt-8" />
              </div>
            </div>

            {/* Main Content: Left Column (Title & Description), Right Column (White Card with 10 Services) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center pt-1 sm:pt-2">
              {/* Left Column: Heading & Paragraph */}
              <div className="lg:col-span-5 space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-sans leading-[1.1]">
                  Products and<br />Services
                </h1>
                <p className="text-xs sm:text-sm lg:text-[15px] text-slate-300 leading-relaxed font-sans max-w-md">
                  Kami menyediakan berbagai solusi teknologi terintegrasi yang mencakup sistem jaringan, keamanan, komunikasi, serta dukungan Mechanical &amp; Electrical untuk memenuhi kebutuhan operasional modern.
                </p>
              </div>

              {/* Right Column: Clean White Rounded Card with Bullet Points */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-5 sm:p-7 lg:p-8 shadow-2xl shadow-cyan-950/40 text-slate-900">
                  <ul className="space-y-1.5 sm:space-y-2 text-[11px] sm:text-xs lg:text-[13px] font-bold tracking-wide font-sans leading-tight">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                      <span>DATA CENTER &amp; NETWORK INFRASTRUCTURE</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                      <span>NETWORK SECURITY</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                      <span>TELECOMMUNICATION EQUIPMENT</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                      <span>SURVEILLANCE</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                      <span>ACCESS CONTROL, FINGERPRINT, RFID, &amp; SMART CARD</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                      <span>FIRE ALARM SYSTEM</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                      <span>SOUND SYSTEM</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                      <span>MECHANICAL ELECTRICAL</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                      <span>HARDWARE &amp; SOFTWARE EQUIPMENT</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                      <span>MAINTENANCE SERVICES</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Slide Footer */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span className="tracking-wider">IZKATECH COMPANY PROFILE</span>
              <span className="text-cyan-400 font-semibold">PAGE 03</span>
            </div>
          </div>
        )}

        {/* ========================================================
            SLIDE 3: SOLUTION & BRAND PRINCIPALS (PAGE 04 KEKINIAN WHITE CARD & VISUAL SHOWCASE)
            ======================================================== */}
        {currentSlide === 3 && (
          <div className="w-full h-full flex flex-col justify-between text-left animate-fadeIn relative z-10">
            {/* Top Bar: Framed Logo on Left, 3D Concentric Rings Art on Right */}
            <div className="flex items-start justify-between gap-6 -mt-2 sm:-mt-4">
              <div className="relative pl-3.5 pt-1">
                <div className="absolute left-0 -top-6 bottom-0 w-[2px] bg-gradient-to-b from-purple-400 via-indigo-400 to-indigo-600/40" />
                <Logo size="md" variant="cyan-gold" />
                <div className="mt-2 w-48 sm:w-56 h-[2px] bg-gradient-to-r from-cyan-400 via-cyan-300 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
              </div>

              <div className="w-48 sm:w-64 md:w-80 lg:w-96 flex justify-end">
                <ConcentricRingsArt className="w-full max-w-[340px] -mt-5 sm:-mt-8" />
              </div>
            </div>

            {/* Main Content: Left Column (Signature Modern White Card), Right Column (High-Tech Equipment Showcase) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-center pt-1">
              {/* Left Column: Signature Modern White Rounded Card (Desain Kekinian matching uploaded photo) */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-2xl sm:rounded-[32px] lg:rounded-[36px] p-5 sm:p-7 shadow-2xl text-slate-900 border border-slate-100">
                  <div className="space-y-3 sm:space-y-3.5">
                    {/* 1. CCTV */}
                    <div 
                      onClick={() => setPage4ActiveDevice('cctv')}
                      className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all cursor-pointer ${
                        page4ActiveDevice === 'cctv'
                          ? 'bg-slate-100/90 shadow-sm ring-2 ring-cyan-500/30'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                          page4ActiveDevice === 'cctv' ? 'bg-cyan-600' : 'bg-slate-950'
                        }`} />
                        <span className="font-extrabold text-slate-900 text-xs sm:text-sm lg:text-[15px] tracking-wide font-sans">
                          CCTV
                        </span>
                        {page4ActiveDevice === 'cctv' && (
                          <span className="ml-auto text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-semibold">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="pl-4 text-[11px] sm:text-xs text-slate-600 font-sans tracking-normal mt-0.5 font-medium">
                        (Hikvision, Dahua, Avigilon, Samsung, Uniview)
                      </div>
                    </div>

                    {/* 2. ACCESS CONTROL */}
                    <div 
                      onClick={() => setPage4ActiveDevice('access-control')}
                      className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all cursor-pointer ${
                        page4ActiveDevice === 'access-control'
                          ? 'bg-slate-100/90 shadow-sm ring-2 ring-indigo-500/30'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                          page4ActiveDevice === 'access-control' ? 'bg-indigo-600' : 'bg-slate-950'
                        }`} />
                        <span className="font-extrabold text-slate-900 text-xs sm:text-sm lg:text-[15px] tracking-wide font-sans">
                          ACCESS CONTROL
                        </span>
                        {page4ActiveDevice === 'access-control' && (
                          <span className="ml-auto text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-semibold">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="pl-4 text-[11px] sm:text-xs text-slate-600 font-sans tracking-normal mt-0.5 font-medium">
                        (HID, Suprema, Entry Pass)
                      </div>
                    </div>

                    {/* 3. NETWORK SECURITY */}
                    <div 
                      onClick={() => setPage4ActiveDevice('network-security')}
                      className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all cursor-pointer ${
                        page4ActiveDevice === 'network-security'
                          ? 'bg-slate-100/90 shadow-sm ring-2 ring-sky-500/30'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                          page4ActiveDevice === 'network-security' ? 'bg-sky-600' : 'bg-slate-950'
                        }`} />
                        <span className="font-extrabold text-slate-900 text-xs sm:text-sm lg:text-[15px] tracking-wide font-sans">
                          NETWORK SECURITY
                        </span>
                        {page4ActiveDevice === 'network-security' && (
                          <span className="ml-auto text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-semibold">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="pl-4 text-[11px] sm:text-xs text-slate-600 font-sans tracking-normal mt-0.5 font-medium">
                        (Watchguard, Fortinet, Sangfor)
                      </div>
                    </div>

                    {/* 4. TELECOMMUNICATION EQUIPMENT */}
                    <div 
                      onClick={() => setPage4ActiveDevice('telecom')}
                      className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all cursor-pointer ${
                        page4ActiveDevice === 'telecom'
                          ? 'bg-slate-100/90 shadow-sm ring-2 ring-blue-500/30'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                          page4ActiveDevice === 'telecom' ? 'bg-blue-600' : 'bg-slate-950'
                        }`} />
                        <span className="font-extrabold text-slate-900 text-xs sm:text-sm lg:text-[15px] tracking-wide font-sans">
                          TELECOMMUNICATION EQUIPMENT
                        </span>
                        {page4ActiveDevice === 'telecom' && (
                          <span className="ml-auto text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="pl-4 text-[11px] sm:text-xs text-slate-600 font-sans tracking-normal mt-0.5 font-medium">
                        (Panasonic, Polycom, NEC, Cisco, Alcatel-Lucent)
                      </div>
                    </div>

                    {/* 5. HARDWARE & SOFTWARE SUPPLY */}
                    <div 
                      onClick={() => setPage4ActiveDevice('hardware')}
                      className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all cursor-pointer ${
                        page4ActiveDevice === 'hardware'
                          ? 'bg-slate-100/90 shadow-sm ring-2 ring-amber-500/30'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                          page4ActiveDevice === 'hardware' ? 'bg-amber-600' : 'bg-slate-950'
                        }`} />
                        <span className="font-extrabold text-slate-900 text-xs sm:text-sm lg:text-[15px] tracking-wide font-sans">
                          HARDWARE &amp; SOFTWARE SUPPLY
                        </span>
                        {page4ActiveDevice === 'hardware' && (
                          <span className="ml-auto text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="pl-4 text-[11px] sm:text-xs text-slate-600 font-sans tracking-normal mt-0.5 font-medium">
                        (Seagate, Linksys, Western Digital, Notifier, Microsoft, HP, Hooseki, TOA)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Hardware Showcase with Glow & Modern Switcher */}
              <div className="lg:col-span-5 space-y-2.5">
                <div className="relative">
                  <EquipmentVisualShowcase 
                    type={page4ActiveDevice} 
                    className="w-full"
                  />
                </div>

                {/* Quick Switcher Buttons */}
                <div className="flex items-center justify-center gap-1 pt-1">
                  {(['cctv', 'access-control', 'network-security', 'telecom', 'hardware'] as const).map((dev) => (
                    <button
                      key={dev}
                      onClick={() => setPage4ActiveDevice(dev)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                        page4ActiveDevice === dev
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30 scale-105'
                          : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {dev === 'cctv' ? 'CCTV' : dev === 'access-control' ? 'Access' : dev === 'network-security' ? 'Security' : dev === 'telecom' ? 'Telecom' : 'HW/SW'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Slide Footer */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span className="tracking-wider">IZKATECH COMPANY PROFILE</span>
              <span className="text-cyan-400 font-semibold">PAGE 04</span>
            </div>
          </div>
        )}

        {/* ========================================================
            SLIDE 4: PARTNER BRANDS
            ======================================================== */}
        {currentSlide === 4 && (
          <div className="w-full h-full flex flex-col justify-between text-left animate-fadeIn">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
                <div>
                  <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">04 // ECOSYSTEM</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">Prinsipal &amp; Partner Brand</h2>
                </div>
                <Logo size="sm" variant="cyan-gold" />
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {BRAND_PARTNERS.slice(0, 18).map((p) => (
                  <div key={p.name} className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-center">
                    <div className="text-xs font-bold text-white">{p.name}</div>
                    <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{p.category}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>GLOBAL TECHNOLOGY PARTNERS</span>
              <span>PAGE 05</span>
            </div>
          </div>
        )}

        {/* ========================================================
            SLIDE 5: PROJECTS HIGHLIGHT
            ======================================================== */}
        {currentSlide === 5 && (
          <div className="w-full h-full flex flex-col justify-between text-left animate-fadeIn">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div>
                  <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">05 // EXPERIENCE</span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">Portofolio Proyek Skala Nasional</h2>
                </div>
                <Logo size="sm" variant="cyan-gold" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {PROJECTS.slice(0, 6).map((proj) => (
                  <div key={proj.id} className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
                    <div className="text-xs font-bold text-cyan-300">{proj.name}</div>
                    <div className="text-[11px] text-white font-medium mt-1">{proj.sectorLabel}</div>
                    <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">{proj.scope}</div>
                    <div className="text-[10px] font-mono text-emerald-400 mt-2">{proj.location} • {proj.status}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>15+ PROVEN NATIONAL PROJECTS</span>
              <span>PAGE 06</span>
            </div>
          </div>
        )}

        {/* ========================================================
            SLIDE 6: MARKET POSITION & ADVANTAGES
            ======================================================== */}
        {currentSlide === 6 && (
          <div className="w-full h-full flex flex-col justify-between text-left animate-fadeIn">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
                <div>
                  <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">06 // VALUE PROPOSITION</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">Posisi Pasar &amp; Keunggulan Kami</h2>
                </div>
                <Logo size="sm" variant="cyan-gold" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
                  <div className="text-cyan-400 font-bold font-mono text-sm">01. SINERGI LENGKAP ICT + ME</div>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Satu-satunya mitra yang mengintegrasikan infrastruktur IT data center dengan ketahanan kelistrikan &amp; mekanikal dalam satu pintu kontrak.
                  </p>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
                  <div className="text-sky-400 font-bold font-mono text-sm">02. KUALITAS &amp; BRAND RESMI</div>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Didukung langsung oleh 20+ prinsipal teknologi global terkemuka untuk garansi suku cadang dan pembaruan lisensi terjamin.
                  </p>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
                  <div className="text-amber-400 font-bold font-mono text-sm">03. DUKUNGAN SLA &amp; AFTER SALES</div>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Tim teknisi bersertifikasi dengan respons tanggap darurat 24/7 dan pemeliharaan preventif berkala.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>COMPETITIVE ADVANTAGES</span>
              <span>PAGE 07</span>
            </div>
          </div>
        )}

        {/* ========================================================
            SLIDE 7: CONTACT DETAILS & CLOSING
            ======================================================== */}
        {currentSlide === 7 && (
          <div className="w-full h-full flex flex-col justify-between text-left animate-fadeIn">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
                <div>
                  <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase">07 // CONTACT</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">Hubungi Kantor Resmi Kami</h2>
                </div>
                <Logo size="sm" variant="cyan-gold" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white">PT. IHZA KARYA TEKNOLOGI</h3>
                  <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{COMPANY_INFO.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>Telepon: {COMPANY_INFO.phoneLandline} | Mobile: {COMPANY_INFO.phoneMobile}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span>Email: {COMPANY_INFO.email}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-500/40 rounded-xl p-6 text-center space-y-4">
                  <div className="text-base font-bold text-white font-display">
                    Siap Membantu Proyek &amp; Pengadaan Anda
                  </div>
                  <a
                    href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=Halo%20PT.%20Ihza%20Karya%20Teknologi,%20saya%20tertarik%20bekerjasama`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 font-bold text-xs sm:text-sm text-slate-950 shadow-lg"
                  >
                    Konsultasi Cepat via WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>THANK YOU // PT. IHZA KARYA TEKNOLOGI</span>
              <span>END OF SLIDES</span>
            </div>
          </div>
        )}

      </div>

      {/* Presentation Keyboard / Click instruction */}
      <div className="mt-3 text-[11px] font-mono text-slate-400 flex items-center gap-4">
        <span>Gunakan tombol panah untuk berpindah slide</span>
        <span>•</span>
        <span>Tekan [ESC] atau tanda X untuk kembali ke tampilan web</span>
      </div>
    </div>
  );
};

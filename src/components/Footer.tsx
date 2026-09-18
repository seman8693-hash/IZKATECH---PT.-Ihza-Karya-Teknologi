import React from 'react';
import { Logo } from './Logo.tsx';
import { COMPANY_INFO } from '../data/companyData.ts';
import { FacebookIcon, TikTokIcon, InstagramIcon } from './SocialIcons.tsx';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  ArrowUp, 
  ShieldCheck, 
  ChevronRight,
  MessageSquare,
  Lock
} from 'lucide-react';

interface FooterProps {
  lang: 'id' | 'en';
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      {/* Top CTA Banner */}
      <div className="border-b border-slate-800/80 py-10 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-bold text-white font-display">
              {lang === 'id' 
                ? 'Mulai Konsultasi Kebutuhan ICT & ME Anda Hari Ini' 
                : 'Power Your ICT & ME Infrastructure Today'}
            </h4>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              {lang === 'id' 
                ? 'Tim engineer kami siap memberikan rekomendasi spesifikasi dan survei teknis.'
                : 'Our engineering team is prepared to provide technical surveys and BoQ recommendations.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=Halo%20PT.%20Ihza%20Karya%20Teknologi,%20saya%20ingin%20konsultasi`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-md"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp Hotline</span>
            </a>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/50 transition-colors"
              title="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Company Identity (5 cols) */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <Logo size="md" />
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm mt-3">
              <span className="font-semibold text-white">PT. IHZA KARYA TEKNOLOGI</span> adalah perusahaan ICT System Integrator dan penyedia solusi Mechanical &amp; Electrical (ME) terintegrasi, andal, dan terukur untuk berbagai industri di Indonesia.
            </p>
            <div className="text-[11px] font-mono text-cyan-400/90 pt-1">
              "Delivering integrated, reliable, and scalable technology solutions."
            </div>
            
            <div className="pt-2 flex items-center gap-3 text-slate-500 text-xs">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Official Registered Enterprise &amp; Certified Integrator</span>
            </div>

            {/* Official Social Media Channels */}
            <div className="pt-3 space-y-2">
              <div className="text-[11px] font-mono text-slate-400 font-semibold tracking-wider uppercase">
                {lang === 'id' ? 'Media Sosial Resmi' : 'Official Social Media'}
              </div>
              <div className="flex items-center gap-2.5">
                {/* Facebook */}
                <a
                  href={COMPANY_INFO.socialMedia.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500 hover:bg-blue-600/10 text-xs font-medium transition-all group cursor-pointer"
                  title="Facebook PT. Ihza Karya Teknologi"
                >
                  <FacebookIcon className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span>Facebook</span>
                </a>

                {/* Instagram */}
                <a
                  href={COMPANY_INFO.socialMedia.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-pink-500 hover:bg-pink-600/10 text-xs font-medium transition-all group cursor-pointer"
                  title="Instagram PT. Ihza Karya Teknologi"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                  <span>Instagram</span>
                </a>

                {/* TikTok */}
                <a
                  href={COMPANY_INFO.socialMedia.tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-400 hover:bg-cyan-500/10 text-xs font-medium transition-all group cursor-pointer"
                  title="TikTok PT. Ihza Karya Teknologi"
                >
                  <TikTokIcon className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
                  <span>TikTok</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Navigation Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <div className="text-xs font-bold text-white uppercase tracking-wider font-display">
              {lang === 'id' ? 'Navigasi' : 'Navigation'}
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#beranda" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Beranda</span>
                </a>
              </li>
              <li>
                <a href="#tentang" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Tentang Kami</span>
                </a>
              </li>
              <li>
                <a href="#layanan" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Layanan &amp; Solusi</span>
                </a>
              </li>
              <li>
                <a href="#partner" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Partner Brand</span>
                </a>
              </li>
              <li>
                <a href="#portofolio" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Portofolio Proyek</span>
                </a>
              </li>
              <li>
                <a href="#keunggulan" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Posisi Pasar</span>
                </a>
              </li>
              <li>
                <a href="#kontak" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Kontak Resmi</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Solutions Scope (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-left">
            <div className="text-xs font-bold text-white uppercase tracking-wider font-display">
              {lang === 'id' ? 'Layanan Unggulan' : 'Key Services'}
            </div>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-slate-200 transition-colors">Data Center &amp; Jaringan</li>
              <li className="hover:text-slate-200 transition-colors">Surveillance (CCTV HD)</li>
              <li className="hover:text-slate-200 transition-colors">Access Control &amp; RFID</li>
              <li className="hover:text-slate-200 transition-colors">Fire Alarm System MCFA</li>
              <li className="hover:text-slate-200 transition-colors">Mechanical Electrical ME</li>
              <li className="hover:text-slate-200 transition-colors">Public Address TOA</li>
              <li className="hover:text-slate-200 transition-colors">Maintenance SLA Support</li>
            </ul>
          </div>

          {/* Contact Details (3 cols) */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <div className="text-xs font-bold text-white uppercase tracking-wider font-display">
              {lang === 'id' ? 'Kantor & Kontak' : 'Contact Details'}
            </div>
            
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <a href="tel:02263729430" className="hover:text-white font-mono">{COMPANY_INFO.phoneLandline}</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <a href={`https://wa.me/${COMPANY_INFO.whatsappNumber}`} className="hover:text-white font-mono">{COMPANY_INFO.phoneMobile}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-white">{COMPANY_INFO.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <a href="https://www.izkatech.com" className="hover:text-white">{COMPANY_INFO.website}</a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Credits */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} <span className="text-slate-300 font-semibold">PT. IHZA KARYA TEKNOLOGI (IZKATECH)</span>. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Bandung, Jawa Barat</span>
            <span>•</span>
            <span>ICT System Integrator &amp; ME</span>
            <span>•</span>
            <button
              onClick={() => {
                if (onOpenAdmin) {
                  onOpenAdmin();
                } else {
                  window.location.hash = '/admin';
                }
              }}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-cyan-400 transition-colors cursor-pointer"
              title="Portal Staff Admin"
            >
              <Lock className="w-3 h-3" />
              <span>Portal Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

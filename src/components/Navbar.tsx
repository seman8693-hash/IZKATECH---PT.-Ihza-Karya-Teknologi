import React, { useState, useEffect } from 'react';
import { Logo } from './Logo.tsx';
import { COMPANY_INFO } from '../data/companyData.ts';
import { FacebookIcon, TikTokIcon, InstagramIcon } from './SocialIcons.tsx';
import { getStoredChatSessions } from '../data/adminStore.ts';
import { Menu, X, Phone, MessageSquare, Calculator, ChevronRight, Lock } from 'lucide-react';

interface NavbarProps {
  lang: 'id' | 'en';
  setLang: (lang: 'id' | 'en') => void;
  onOpenEstimator: () => void;
  onOpenSlideDeck?: () => void;
    onOpenAdmin?: () => void;
  onOpenLiveChat?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  lang, 
  setLang, 
  onOpenEstimator,
  onOpenSlideDeck,
  onOpenAdmin,
  onOpenLiveChat
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatBadgeCount, setChatBadgeCount] = useState(0);

  useEffect(() => {
    const checkChatBadge = () => {
      try {
        const sessions = getStoredChatSessions();
        const currentId = localStorage.getItem('izkatech_current_visitor_session_id');
        if (currentId) {
          const current = sessions.find(s => s.id === currentId);
          const unread = current?.unreadCountVisitor || 0;
          setChatBadgeCount(unread);
        }
      } catch {
        setChatBadgeCount(0);
      }
    };
    checkChatBadge();
    window.addEventListener('izkatech_chat_updated', checkChatBadge);
    return () => window.removeEventListener('izkatech_chat_updated', checkChatBadge);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#beranda', labelId: 'Beranda', labelEn: 'Home' },
    { href: '#tentang', labelId: 'Tentang', labelEn: 'About' },
    { href: '#layanan', labelId: 'Layanan', labelEn: 'Services' },
    { href: '#partner', labelId: 'Partner', labelEn: 'Partners' },
    { href: '#portofolio', labelId: 'Portofolio', labelEn: 'Projects' },
    { href: '#keunggulan', labelId: 'Keunggulan', labelEn: 'Why Us' },
    { href: '#kontak', labelId: 'Kontak', labelEn: 'Contact' },
  ];

  return (
    <header 
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 shadow-2xl py-2.5' 
          : 'bg-slate-950/70 backdrop-blur-sm border-b border-slate-800/40 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo (compact size for crisp navbar fit) */}
        <a href="#beranda" className="flex items-center shrink-0 group transition-transform hover:opacity-95" id="nav-brand-link">
          <Logo size="sm" />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 xl:gap-1.5 shrink-0">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              id={`nav-link-${link.href.replace('#', '')}`}
              className="px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-900/70 rounded-lg transition-colors whitespace-nowrap"
            >
              {lang === 'id' ? link.labelId : link.labelEn}
            </a>
          ))}
        </nav>

        {/* Action Buttons & Language Switch */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {/* Social Media Links in Navbar Header */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/80 border border-slate-800/90 rounded-lg px-1.5 py-1">
            <a
              href={COMPANY_INFO.socialMedia.facebook.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
              title="Facebook PT. Ihza Karya Teknologi"
              aria-label="Facebook"
            >
              <FacebookIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href={COMPANY_INFO.socialMedia.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-slate-400 hover:text-pink-400 hover:bg-slate-800 rounded transition-colors"
              title="Instagram PT. Ihza Karya Teknologi"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
            <a
              href={COMPANY_INFO.socialMedia.tiktok.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded transition-colors"
              title="TikTok PT. Ihza Karya Teknologi"
              aria-label="TikTok"
            >
              <TikTokIcon className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-0.5 text-xs font-semibold shrink-0">
            <button
              id="lang-btn-id"
              onClick={() => setLang('id')}
              className={`px-2 py-1 rounded transition-all whitespace-nowrap ${
                lang === 'id' 
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ID
            </button>
            <button
              id="lang-btn-en"
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded transition-all whitespace-nowrap ${
                lang === 'en' 
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Slide Deck 16:9 CTA (Ultra clean, single line) */}
          {onOpenSlideDeck && (
            <button
              id="nav-slidedeck-btn"
              onClick={onOpenSlideDeck}
              className="hidden 2xl:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-300 bg-orange-950/30 hover:bg-orange-900/50 border border-orange-500/40 rounded-lg transition-colors cursor-pointer shadow-sm whitespace-nowrap shrink-0"
              title="Tampilkan Slide Deck 16:9"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span>Slide (16:9)</span>
            </button>
          )}

          {/* Live Chat Pengunjung CTA (badge unread dari LiveChatWidget) */}
          {onOpenLiveChat && (
            <button
              id="nav-livechat-btn"
              onClick={onOpenLiveChat}
              className="relative hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900/90 hover:text-cyan-300 hover:border-cyan-500/50 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0"
              title="Live Chat dengan Tim IZKATECH"
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Live Chat</span>
              {chatBadgeCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {chatBadgeCount}
                </span>
              )}
            </button>
          )}

          {/* Portal Admin CTA */}
          <button
            id="nav-admin-btn"
            onClick={onOpenAdmin || (() => { window.location.hash = '/admin'; })}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900/90 hover:text-cyan-300 hover:border-cyan-500/50 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0"
            title="Masuk ke Portal Admin"
          >
            <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Portal Admin</span>
          </button>

          {/* RFP / Estimator CTA */}
          <button
            id="nav-estimator-btn"
            onClick={onOpenEstimator}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Calculator className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{lang === 'id' ? 'Kalkulator RFP' : 'RFP Estimator'}</span>
          </button>

          {/* Quick WhatsApp Contact CTA (Always on one line, never wraps) */}
          <a
            id="nav-whatsapp-cta"
            href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=Halo%20PT.%20Ihza%20Karya%20Teknologi%20(IZKATECH),%20saya%20tertarik%20konsultasi%20kebutuhan%20teknologi.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-blue-400 to-orange-400 hover:from-cyan-300 hover:to-orange-300 rounded-lg shadow-md shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 whitespace-nowrap shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-current shrink-0" />
            <span>{lang === 'id' ? 'Hubungi Kami' : 'Contact Us'}</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 xl:hidden">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-medium sm:hidden">
            <button
              onClick={() => setLang('id')}
              className={`px-2 py-1 rounded ${lang === 'id' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              ID
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded ${lang === 'en' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
            >
              EN
            </button>
          </div>
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg border border-slate-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-cyan-400" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="xl:hidden bg-slate-950/98 border-b border-slate-800 px-4 pt-4 pb-6 mt-3 space-y-3 shadow-2xl backdrop-blur-xl">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
            {lang === 'id' ? 'Menu Navigasi' : 'Navigation Menu'}
          </div>
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-900 hover:text-cyan-400 rounded-lg transition-colors"
              >
                <span>{lang === 'id' ? link.labelId : link.labelEn}</span>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2.5">
            {onOpenSlideDeck && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSlideDeck();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-xs font-semibold text-cyan-300"
              >
                <span>Buka Mode Slide Presentasi (16:9)</span>
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEstimator();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200"
            >
              <Calculator className="w-4 h-4 text-cyan-400" />
              {lang === 'id' ? 'Kalkulator Estimasi Kebutuhan (RFP)' : 'RFP Requirements Calculator'}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLiveChat?.();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900 border border-cyan-500/40 text-xs font-semibold text-cyan-300"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Live Chat dengan Tim IZKATECH</span>
              {chatBadgeCount > 0 && (
                <span className="px-1.5 rounded-full bg-rose-500 text-white text-[9px] font-bold">{chatBadgeCount}</span>
              )}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenAdmin) {
                  onOpenAdmin();
                } else {
                  window.location.hash = '/admin';
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-slate-900/90 border border-slate-700 text-xs font-semibold text-cyan-300 hover:bg-slate-800"
            >
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Masuk Portal Admin (Staff / Internal)</span>
            </button>

            <a
              href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=Halo%20PT.%20Ihza%20Karya%20Teknologi,%20saya%20ingin%20konsultasi`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20"
            >
              <Phone className="w-4 h-4 fill-current" />
              {lang === 'id' ? 'WhatsApp Konsultasi Cepat' : 'Instant WhatsApp Consultation'}
            </a>

            {/* Social Media in Mobile Menu */}
            <div className="pt-2 flex items-center justify-center gap-3">
              <span className="text-[11px] text-slate-400">Media Sosial:</span>
              <a
                href={COMPANY_INFO.socialMedia.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-blue-400 hover:bg-blue-600/10"
                aria-label="Facebook PT. Ihza Karya Teknologi"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href={COMPANY_INFO.socialMedia.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-pink-400 hover:bg-pink-600/10"
                aria-label="Instagram PT. Ihza Karya Teknologi"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={COMPANY_INFO.socialMedia.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 hover:bg-cyan-600/10"
                aria-label="TikTok PT. Ihza Karya Teknologi"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

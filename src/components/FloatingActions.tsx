import React, { useState, useEffect } from 'react';
import { COMPANY_INFO } from '../data/companyData.ts';
import { MessageSquare, Calculator, ArrowUp, Phone } from 'lucide-react';

interface FloatingActionsProps {
  onOpenEstimator: () => void;
  onOpenLiveChat?: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ onOpenEstimator, onOpenLiveChat }) => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Scroll to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="p-3 rounded-full bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700 shadow-xl backdrop-blur-md hover:border-cyan-500 transition-all cursor-pointer transform hover:scale-105"
          aria-label="Kembali ke atas"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Estimator Button */}
      <button
        onClick={onOpenEstimator}
        className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/95 text-slate-100 hover:text-white border border-cyan-500/50 shadow-xl backdrop-blur-md transition-all text-xs font-semibold cursor-pointer hover:bg-slate-800 hover:scale-105"
        title="Kalkulator Kebutuhan / RFP"
      >
        <Calculator className="w-4 h-4 text-cyan-400" />
        <span>Kalkulator RFP</span>
      </button>

      {/* Live Chat Button (membuka LiveChatWidget pengunjung) */}
      {onOpenLiveChat && (
        <button
          onClick={onOpenLiveChat}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/95 text-slate-100 hover:text-white border border-blue-500/50 shadow-xl backdrop-blur-md transition-all text-xs font-semibold cursor-pointer hover:bg-slate-800 hover:scale-105"
          title="Live Chat dengan Tim IZKATECH"
        >
          <MessageSquare className="w-4 h-4 text-blue-400" />
          <span>Live Chat</span>
        </button>
      )}

      {/* Main WhatsApp Direct Floating Button */}
      <a
        href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=Halo%20PT.%20Ihza%20Karya%20Teknologi%20(IZKATECH),%20saya%20tertarik%20untuk%20konsultasi.`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-2xl shadow-emerald-950 hover:from-emerald-400 hover:to-teal-400 transition-all transform hover:scale-105"
        aria-label="Hubungi WhatsApp"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-200"></span>
        </span>
        <Phone className="w-4 h-4 fill-current" />
        <span className="text-xs font-bold font-display tracking-wide">
          WhatsApp Fast Chat
        </span>
      </a>
    </div>
  );
};

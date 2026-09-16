import React from 'react';
import { ServiceItem } from '../types.ts';
import { COMPANY_INFO } from '../data/companyData.ts';
import { X, CheckCircle2, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  lang: 'id' | 'en';
  onConsult: (serviceTitle: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  lang,
  onConsult,
}) => {
  if (!service) return null;

  const whatsappMessage = encodeURIComponent(
    `Halo PT. Ihza Karya Teknologi (IZKATECH), saya ingin konsultasi mengenai layanan: *${service.title}*.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              {lang === 'id' ? 'Detail Solusi & Spesifikasi' : 'Solution & Specification Detail'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-left">
          <div>
            <h3 className="text-2xl font-bold text-white font-display">
              {lang === 'id' ? service.title : service.titleEn}
            </h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              {lang === 'id' ? service.description : service.descriptionEn}
            </p>
          </div>

          {/* Scope & Key Features */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'id' ? 'Cakupan Pekerjaan & Kapabilitas' : 'Scope of Work & Capabilities'}</span>
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {(lang === 'id' ? service.features : service.featuresEn).map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Associated Principal Brands */}
          {service.brands && service.brands.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-sky-400" />
                <span>{lang === 'id' ? 'Brand & Perangkat Terintegrasi' : 'Integrated Brands & Hardware'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {service.brands.map((brand, bIdx) => (
                  <span
                    key={bIdx}
                    className="px-3 py-1 text-xs font-medium rounded-lg bg-slate-800/90 text-cyan-300 border border-slate-700/80"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Trust guarantee banner */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/20 text-xs text-slate-300 flex items-center justify-between">
            <span>Garansi Resmi Prinsipal &amp; Pengerjaan Standard Enterprise</span>
            <span className="font-mono text-cyan-400 font-bold">PT. IHZA KARYA TEKNOLOGI</span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            {lang === 'id' ? 'Tutup' : 'Close'}
          </button>
          
          <button
            onClick={() => {
              onClose();
              onConsult(service.title);
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg transition-colors cursor-pointer"
          >
            {lang === 'id' ? 'Hitung di Kalkulator RFP' : 'Open RFP Calculator'}
          </button>

          <a
            href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 rounded-lg shadow-md shadow-cyan-500/20"
          >
            <span>{lang === 'id' ? 'Konsultasi via WhatsApp' : 'WhatsApp Inquiry'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

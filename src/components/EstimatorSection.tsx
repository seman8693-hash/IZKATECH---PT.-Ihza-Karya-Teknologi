import React, { useState } from 'react';
import { COMPANY_INFO, SERVICES } from '../data/companyData.ts';
import { saveInquiry } from '../data/adminStore.ts';
import { 
  Calculator, 
  Send, 
  Copy, 
  Check, 
  Building, 
  Sparkles, 
  MessageSquare, 
  Mail,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface EstimatorSectionProps {
  lang: 'id' | 'en';
  preselectedService?: string | null;
}

export const EstimatorSection: React.FC<EstimatorSectionProps> = ({ 
  lang, 
  preselectedService 
}) => {
  const [selectedServices, setSelectedServices] = useState<string[]>(
    preselectedService ? [preselectedService] : ['Data Center & Network Infrastructure', 'Surveillance (CCTV Systems)']
  );
  const [projectScale, setProjectScale] = useState<string>('medium');
  const [sectorType, setSectorType] = useState<string>('commercial');
  const [clientName, setClientName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [submittedMessage, setSubmittedMessage] = useState<boolean>(false);

  const toggleService = (title: string) => {
    setSelectedServices(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const scaleOptions = [
    { id: 'small', labelId: 'Skala Kecil (1 Gedung / <20 Titik)', labelEn: 'Small (<20 Nodes / Single Facility)', factor: 'Fasilitas 1 Lantai / Kantor Cabang' },
    { id: 'medium', labelId: 'Skala Menengah (Gedung 2-5 Lantai / 20-100 Titik)', labelEn: 'Medium (2-5 Floors / 20-100 Nodes)', factor: 'Gedung Kantor / Kampus Menengah' },
    { id: 'large', labelId: 'Skala Besar / Kawasan Industri (>100 Titik)', labelEn: 'Large / Multi-Floor (>100 Nodes)', factor: 'Gedung Tower / Kawasan / Bandara' },
  ];

  const sectorOptions = [
    { id: 'commercial', label: 'Gedung Kantor / Komersial' },
    { id: 'education', label: 'Institusi Pendidikan / Kampus' },
    { id: 'hospitality', label: 'Hotel / Resor / Wisata' },
    { id: 'infrastructure', label: 'Infrastruktur / Transportasi / Bandara' },
    { id: 'industrial', label: 'Kawasan Industri / Manufaktur' },
    { id: 'government', label: 'Instansi Pemerintah / BUMN' },
  ];

  const generateSummaryText = () => {
    const scaleObj = scaleOptions.find(s => s.id === projectScale);
    const sectorObj = sectorOptions.find(s => s.id === sectorType);

    return `*PERMINTAAN KONSULTASI & ESTIMASI PROYEK (RFP)*
*Kepada:* PT. Ihza Karya Teknologi (IZKATECH)
--------------------------------------
*Nama Klien:* ${clientName || 'Calon Klien'}
*Perusahaan / Institusi:* ${companyName || 'Instansi Terkait'}
*Kontak / Telepon:* ${phone || '-'}
*Sektor Proyek:* ${sectorObj?.label || sectorType}
*Skala Pekerjaan:* ${scaleObj?.labelId || projectScale}

*Layanan / Solusi yang Dibutuhkan (${selectedServices.length}):*
${selectedServices.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

*Catatan / Deskripsi Tambahan:*
${notes || 'Mohon dibantu penjadwalan survey lokasi atau estimasi BoQ.'}
--------------------------------------
Dikirim melalui Form Website IZKATECH (www.izkatech.com)`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateSummaryText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const recordToAdminStore = () => {
    saveInquiry({
      clientName: clientName.trim() || 'Calon Klien (Form Web)',
      companyName: companyName.trim() || 'Instansi Umum',
      phone: phone.trim() || '-',
      email: '-',
      serviceInterest: selectedServices.length > 0 ? selectedServices : ['Konsultasi Umum ICT & ME'],
      scale: projectScale,
      budgetEstimate: 'Permintaan Penawaran',
      notes: notes.trim() || 'Permintaan penawaran dan jadwal survei dari formulir kalkulator web.',
      source: 'kalkulator'
    });
  };

  const handleSendWhatsApp = () => {
    recordToAdminStore();
    const text = encodeURIComponent(generateSummaryText());
    window.open(`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${text}`, '_blank');
    setSubmittedMessage(true);
  };

  const handleSendEmail = () => {
    recordToAdminStore();
    const subject = encodeURIComponent(`Permintaan Penawaran Proyek: ${companyName || 'Inquiry Baru'}`);
    const body = encodeURIComponent(generateSummaryText());
    window.open(`mailto:${COMPANY_INFO.email}?subject=${subject}&body=${body}`, '_blank');
    setSubmittedMessage(true);
  };

  return (
    <section id="kalkulator" className="py-20 lg:py-28 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5" />
            <span>{lang === 'id' ? 'Kalkulator Kebutuhan & Konsultasi RFP' : 'RFP Estimator & Inquiry Builder'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            {lang === 'id' 
              ? 'Rancang Kebutuhan Teknologi Proyek Anda' 
              : 'Customize Your Project Technology Requirements'}
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            {lang === 'id'
              ? 'Pilih modul layanan yang dibutuhkan untuk mendapatkan rancangan solusi, estimasi awal, serta konsultasi teknis dari tim engineer PT. Ihza Karya Teknologi.'
              : 'Select the required solution modules to receive preliminary scoping and expert technical advisory from PT. Ihza Karya Teknologi.'}
          </p>
        </div>

        {/* Interactive Estimator Form & Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            
            {/* Step 1: Select Services */}
            <div>
              <label className="block text-sm font-bold text-white mb-2 font-display flex items-center justify-between">
                <span>1. Pilih Layanan yang Dibutuhkan</span>
                <span className="text-xs font-mono text-cyan-400">
                  {selectedServices.length} Dipilih
                </span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SERVICES.map((s) => {
                  const isChecked = selectedServices.includes(s.title);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleService(s.title)}
                      className={`text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-start gap-2.5 cursor-pointer ${
                        isChecked
                          ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-200 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800/90 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                        isChecked ? 'bg-cyan-500 text-slate-950' : 'border border-slate-700'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="leading-snug">{s.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Sektor & Skala Proyek */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  2. Sektor Industri
                </label>
                <select
                  value={sectorType}
                  onChange={(e) => setSectorType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  {sectorOptions.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  3. Estimasi Skala Fasilitas
                </label>
                <select
                  value={projectScale}
                  onChange={(e) => setProjectScale(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  {scaleOptions.map((scale) => (
                    <option key={scale.id} value={scale.id}>
                      {scale.labelId}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Step 3: Client Details */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                4. Data Kontak &amp; Perusahaan
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Nama Perusahaan / Instansi *"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Nama Penanggung Jawab (PIC) *"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nomor WhatsApp / HP Aktif (e.g. 08123456789) *"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Catatan kebutuhan spesifik (misal: butuh NVR 64 channel, kabel Cat6A 50 roll, panel LVMDP)..."
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

          </div>

          {/* Right Live Summary Preview (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Ringkasan Kebutuhan Proyek
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700 hover:border-cyan-500 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
              </button>
            </div>

            {/* Text Preview Display */}
            <div className="bg-slate-950/90 rounded-xl p-4 border border-slate-800 font-mono text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap max-h-72 overflow-y-auto">
              {generateSummaryText()}
            </div>

            {/* Quick action dispatch buttons */}
            <div className="space-y-3 pt-2">
              <button
                id="estimator-submit-whatsapp"
                onClick={handleSendWhatsApp}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Kirim Permintaan Langsung via WhatsApp</span>
              </button>

              <button
                id="estimator-submit-email"
                onClick={handleSendEmail}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm text-slate-200 bg-slate-850 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Kirim via Email Resmi ({COMPANY_INFO.email})</span>
              </button>
            </div>

            {/* SLA Trust Notice */}
            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Respon konsultasi teknis &amp; jadwal survei dalam 1x24 jam kerja.</span>
            </div>

            {submittedMessage && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Permintaan Anda telah disiapkan dan dialihkan ke saluran resmi IZKATECH!</span>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};

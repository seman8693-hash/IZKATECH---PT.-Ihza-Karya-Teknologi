import React, { useState } from 'react';
import { COMPANY_INFO } from '../data/companyData.ts';
import { saveInquiry } from '../data/adminStore.ts';
import { FacebookIcon, TikTokIcon, InstagramIcon } from './SocialIcons.tsx';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Navigation
} from 'lucide-react';

interface ContactSectionProps {
  lang: 'id' | 'en';
}

export const ContactSection: React.FC<ContactSectionProps> = ({ lang }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveInquiry({
      clientName: formData.name.trim() || 'Klien Website',
      companyName: 'Perorangan / Perusahaan',
      phone: formData.phone.trim() || '-',
      email: formData.email.trim() || '-',
      serviceInterest: [formData.subject || 'Konsultasi Umum ICT & ME'],
      notes: formData.message.trim(),
      source: 'kontak'
    });

    // Format message for WhatsApp or email dispatch
    const text = encodeURIComponent(
      `Halo PT. Ihza Karya Teknologi (IZKATECH),\n\nNama: ${formData.name}\nEmail: ${formData.email}\nNo Telp: ${formData.phone}\nSubjek: ${formData.subject}\nPesan: ${formData.message}`
    );
    window.open(`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${text}`, '_blank');
    setSubmitted(true);
  };

  return (
    <section id="kontak" className="py-20 lg:py-28 bg-slate-900/60 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            {lang === 'id' ? 'Kontak & Informasi Perusahaan' : 'Contact & Corporate Information'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            {lang === 'id' 
              ? 'Siap Melayani Kebutuhan Teknologi Anda' 
              : 'Ready to Power Your Technology Infrastructure'}
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            {lang === 'id'
              ? 'Hubungi kami untuk konsultasi perancangan, survei lokasi, permintaan penawaran harga (BoQ), atau kerja sama kemitraan strategis.'
              : 'Get in touch for engineering consultations, site surveys, formal quotations (BoQ), or strategic technology partnership.'}
          </p>
        </div>

        {/* Contact Info & Interactive Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Info Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Office Address Card */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 text-left hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {lang === 'id' ? 'Alamat Kantor' : 'Head Office Location'}
                  </div>
                  <div className="text-base font-bold text-white font-display">
                    {COMPANY_INFO.city}, Jawa Barat
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed pl-1">
                {COMPANY_INFO.address}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Bandung, Indonesia</span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY_INFO.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Buka di Google Maps</span>
                </a>
              </div>
            </div>

            {/* Phone & Mobile Card */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 text-left hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {lang === 'id' ? 'Nomor Telepon & WhatsApp' : 'Phone & Mobile Hotlines'}
                  </div>
                  <div className="text-base font-bold text-white font-display">
                    Direct Line
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-slate-300 pl-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Telepon Kantor (Landline):</span>
                  <a href="tel:02263729430" className="font-semibold text-white hover:text-cyan-400 font-mono">
                    {COMPANY_INFO.phoneLandline}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Mobile / WhatsApp:</span>
                  <a 
                    href={`https://wa.me/${COMPANY_INFO.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="font-semibold text-emerald-400 hover:text-emerald-300 font-mono"
                  >
                    {COMPANY_INFO.phoneMobile}
                  </a>
                </div>
              </div>
            </div>

            {/* Email & Website Card */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 text-left hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {lang === 'id' ? 'Email & Situs Resmi' : 'Email & Official Portal'}
                  </div>
                  <div className="text-base font-bold text-white font-display">
                    Online Channels
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-slate-300 pl-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Email Resmi:</span>
                  <a href={`mailto:${COMPANY_INFO.email}`} className="font-semibold text-cyan-400 hover:underline">
                    {COMPANY_INFO.email}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Website Portal:</span>
                  <a href="https://www.izkatech.com" className="font-semibold text-white hover:text-cyan-400">
                    {COMPANY_INFO.website}
                  </a>
                </div>
              </div>
            </div>

            {/* Operational Hours */}
            <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 flex items-center gap-3 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <div>
                <span className="font-semibold text-slate-200">Jam Operasional: </span>
                Senin - Jumat (08:30 - 17:00 WIB) • Emergency SLA On-Call 24/7
              </div>
            </div>

            {/* Official Social Media Channels (Facebook, Instagram, TikTok) */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-display">
                  {lang === 'id' ? 'Media Sosial Resmi' : 'Official Social Media'}
                </span>
                <span className="text-[10px] font-mono text-cyan-400">@izkatech</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={COMPANY_INFO.socialMedia.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 hover:bg-blue-600/10 text-slate-300 hover:text-white transition-all group cursor-pointer"
                >
                  <FacebookIcon className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform mb-1.5" />
                  <span className="text-xs font-semibold">Facebook</span>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5">@izkatech</span>
                </a>

                <a
                  href={COMPANY_INFO.socialMedia.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500 hover:bg-pink-600/10 text-slate-300 hover:text-white transition-all group cursor-pointer"
                >
                  <InstagramIcon className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform mb-1.5" />
                  <span className="text-xs font-semibold">Instagram</span>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5">@izkatech</span>
                </a>

                <a
                  href={COMPANY_INFO.socialMedia.tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400 hover:bg-cyan-500/10 text-slate-300 hover:text-white transition-all group cursor-pointer"
                >
                  <TikTokIcon className="w-5 h-5 text-cyan-300 group-hover:scale-110 transition-transform mb-1.5" />
                  <span className="text-xs font-semibold">TikTok</span>
                  <span className="text-[10px] text-slate-500 font-mono mt-0.5">@izkatech</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Direct Inquiry Message Form (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 text-left shadow-2xl">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white font-display">
                {lang === 'id' ? 'Kirim Pesan / Pertanyaan Langsung' : 'Send Direct Message'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {lang === 'id'
                  ? 'Isi formulir berikut dan tim kami akan segera menghubungi Anda kembali.'
                  : 'Fill in the form below and our team will get back to you promptly.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nama Anda"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Bisnis *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@perusahaan.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nomor Telepon / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Contoh: 081223839205"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Perihal / Kebutuhan
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Konsultasi CCTV, ME, Jaringan, dll."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Pesan / Rincian Kebutuhan Proyek *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Jelaskan kebutuhan sistem, lokasi proyek, atau jadwal survei yang diinginkan..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <button
                type="submit"
                id="contact-submit-btn"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Pesan ke Tim IZKATECH</span>
              </button>

              {submitted && (
                <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Pesan berhasil diteruskan ke WhatsApp representatif PT. Ihza Karya Teknologi!</span>
                </div>
              )}
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { X, Plus } from 'lucide-react';
import { saveInquiry } from '../../data/adminStore';

interface AddInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInquiryAdded: () => void;
}

export const AddInquiryModal: React.FC<AddInquiryModalProps> = ({ isOpen, onClose, onInquiryAdded }) => {
  const [form, setForm] = React.useState({
    clientName: '',
    companyName: '',
    phone: '',
    email: '',
    serviceInterest: '',
    scale: '',
    budgetEstimate: '',
    notes: '',
    source: 'manual'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientName.trim()) return;

    const selectedServices = form.serviceInterest
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    saveInquiry({
      clientName: form.clientName.trim(),
      companyName: form.companyName.trim() || '-',
      phone: form.phone.trim() || '-',
      email: form.email.trim() || '-',
      serviceInterest: selectedServices.length > 0 ? selectedServices : ['Konsultasi Umum ICT & ME'],
      scale: form.scale.trim() || '-',
      budgetEstimate: form.budgetEstimate.trim() || '-',
      notes: form.notes.trim() || '-',
      source: 'manual'
    });

    onInquiryAdded();
    setForm({
      clientName: '',
      companyName: '',
      phone: '',
      email: '',
      serviceInterest: '',
      scale: '',
      budgetEstimate: '',
      notes: '',
      source: 'manual'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <span className="text-[10px] font-mono text-cyan-600 uppercase">TAMBAH PROSPEK BARU</span>
            <h3 className="text-base font-bold text-slate-900">Input Data Klien</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-slate-100 text-slate-400 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-600 mb-1 text-xs font-semibold">Nama Klien *</label>
            <input type="text" required value={form.clientName} onChange={e => setForm({...form, clientName: e.target.value})}
              placeholder="Bpk. Ahmad Fauzi" className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-cyan-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 mb-1 text-xs font-semibold">Perusahaan</label>
              <input type="text" value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})}
                placeholder="PT. Contoh Maju" className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-cyan-400" />
            </div>
            <div>
              <label className="block text-slate-600 mb-1 text-xs font-semibold">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                placeholder="ahmad@contoh.co.id" className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-cyan-400" />
            </div>
          </div>
          <div>
            <label className="block text-slate-600 mb-1 text-xs font-semibold">Nomor Telepon / WhatsApp</label>
            <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
              placeholder="0812-2383-9205" className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-cyan-400" />
          </div>
          <div>
            <label className="block text-slate-600 mb-1 text-xs font-semibold">Layanan (pisahkan koma)</label>
            <input type="text" value={form.serviceInterest} onChange={e => setForm({...form, serviceInterest: e.target.value})}
              placeholder="Data Center, CCTV, Access Control" className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-cyan-400" />
          </div>
          <div>
            <label className="block text-slate-600 mb-1 text-xs font-semibold">Skala & Estimasi</label>
            <input type="text" value={form.scale} onChange={e => setForm({...form, scale: e.target.value})}
              placeholder="Gedung 4 Lantai / 50 Titik CCTV" className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-cyan-400" />
          </div>
          <div>
            <label className="block text-slate-600 mb-1 text-xs font-semibold">Catatan</label>
            <textarea rows={3} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
              placeholder="Jelaskan kebutuhan sistem..." className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-cyan-400 resize-none" />
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer text-xs">Batal</button>
            <button type="submit"
              className="px-5 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 shadow cursor-pointer text-xs">
              <Plus className="w-3.5 h-3.5 inline mr-1" /> Tambah Prospek
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
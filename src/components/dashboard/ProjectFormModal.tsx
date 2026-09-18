import React, { useState, useRef } from 'react';
import { AdminProject } from '../../types/admin.ts';
import { SERVICES } from '../../data/companyData.ts';
import { SECTOR_META, sectorPlaceholderImage } from '../../data/adminStore.ts';
import {
  X, ImagePlus, Trash2, Plus, Save, Camera, RefreshCw,
} from 'lucide-react';

interface ProjectFormModalProps {
  project: AdminProject | null; // null = tambah baru
  onSave: (project: AdminProject) => void;
  onClose: () => void;
}

const EMPTY: Omit<AdminProject, 'id'> = {
  title: '',
  clientName: '',
  category: 'Data Center & Network Infrastructure',
  year: new Date().getFullYear().toString(),
  status: 'in_progress',
  valueApprox: '',
  description: '',
  image: '',
  location: '',
  city: '',
  sector: 'commercial',
  sectorLabel: '',
  details: '',
  highlights: [],
};

/** Resize gambar via canvas agar hemat localStorage (maks lebar 1000px, JPEG 0.82) */
const resizeImage = (dataUrl: string): Promise<string> =>
  new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const maxW = 1000;
      if (img.width <= maxW && dataUrl.length < 450_000) return resolve(dataUrl);
      const scale = Math.min(1, maxW / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(dataUrl);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ project, onSave, onClose }) => {
  const [form, setForm] = useState<Omit<AdminProject, 'id'>>(() =>
    project ? { ...project } : { ...EMPTY }
  );
  const [highlightInput, setHighlightInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const set = <K extends keyof AdminProject>(key: K, value: AdminProject[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const resized = await resizeImage(String(reader.result));
      set('image', resized);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const addHighlight = () => {
    const v = highlightInput.trim();
    if (!v) return;
    set('highlights', [...(form.highlights || []), v]);
    setHighlightInput('');
  };

  const previewImage = form.image || sectorPlaceholderImage(
    form.sector,
    form.sectorLabel || SECTOR_META[form.sector || 'commercial']?.label
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.clientName.trim()) return;
    const sectorLabel = form.sectorLabel?.trim() || SECTOR_META[form.sector || 'commercial']?.label || form.category;
    const payload: AdminProject = {
      ...form,
      sectorLabel,
      details: form.details?.trim() || form.description,
      highlights: form.highlights || [],
      id: project?.id || '',
    };
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 shrink-0">
          <h3 className="text-sm font-bold text-slate-900">
            {project ? 'Edit Proyek Portofolio' : 'Tambah Proyek Portofolio Baru'}{' '}
            <span className="text-xs font-mono text-slate-400 font-normal">
              {project ? `• ${project.id}` : '• ID otomatis'}
            </span>
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Kolom Kiri: Form Fields */}
          <div className="lg:col-span-7 space-y-4">
            {/* Upload Gambar */}
            <div>
              <label className="text-[10px] font-mono text-slate-500 font-bold">FOTO PROYEK (DOKUMENTASI)</label>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) processFile(file);
                }}
                className={`mt-1.5 relative rounded-xl border-2 border-dashed p-3 flex items-center gap-4 transition-colors cursor-pointer ${
                  dragOver ? 'border-cyan-400 bg-cyan-50' : 'border-slate-300 bg-slate-50 hover:border-cyan-300'
                }`}
              >
                <img src={previewImage} alt="Preview" className="w-28 h-20 object-cover rounded-lg shadow-sm shrink-0" />
                <div className="text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-semibold text-teal-800">
                    <Camera className="w-3.5 h-3.5" />
                    {uploading ? 'Memproses gambar...' : 'Klik / tarik gambar ke sini'}
                  </div>
                  <div className="mt-0.5 text-[10px]">JPG/PNG/WebP — otomatis di-resize agar hemat penyimpanan</div>
                  {form.image && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); set('image', ''); }}
                      className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Hapus gambar
                    </button>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) processFile(file);
                    e.target.value = '';
                  }}
                />
              </div>
            </div>

            {/* Nama & Klien */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[10px] font-mono text-slate-500 font-bold">NAMA PROYEK *</span>
                <input required value={form.title} onChange={(e) => set('title', e.target.value)}
                  placeholder="mis. Beltway Office Tower"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400" />
              </label>
              <label className="block">
                <span className="text-[10px] font-mono text-slate-500 font-bold">KLIEN / PEMILIK PROYEK *</span>
                <input required value={form.clientName} onChange={(e) => set('clientName', e.target.value)}
                  placeholder="mis. PT. Summarecon"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400" />
              </label>
            </div>

            {/* Katalog fields */}
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[10px] font-mono text-slate-500 font-bold">SEKTOR KATALOG</span>
                <select value={form.sector} onChange={(e) => set('sector', e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-cyan-400">
                  {Object.entries(SECTOR_META).map(([key, meta]) => (
                    <option key={key} value={key}>{meta.label}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-[10px] font-mono text-slate-500 font-bold">LABEL SEKTOR (DI KARTU)</span>
                <input value={form.sectorLabel || ''} onChange={(e) => set('sectorLabel', e.target.value)}
                  placeholder={SECTOR_META[form.sector || 'commercial']?.label}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400" />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[10px] font-mono text-slate-500 font-bold">LOKASI / ALAMAT</span>
                <input value={form.location || ''} onChange={(e) => set('location', e.target.value)}
                  placeholder="mis. Bandung, Jawa Barat"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400" />
              </label>
              <label className="block">
                <span className="text-[10px] font-mono text-slate-500 font-bold">KOTA</span>
                <input value={form.city || ''} onChange={(e) => set('city', e.target.value)}
                  placeholder="mis. Bandung"
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400" />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[10px] font-mono text-slate-500 font-bold">KATEGORI LAYANAN</span>
                <select value={form.category} onChange={(e) => set('category', e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-cyan-400">
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">TAHUN</span>
                  <input value={form.year} onChange={(e) => set('year', e.target.value)} placeholder="2026"
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400" />
                </label>
                <label className="block">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">STATUS</span>
                  <select value={form.status} onChange={(e) => set('status', e.target.value as AdminProject['status'])}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-cyan-400">
                    <option value="completed">Completed</option>
                    <option value="in_progress">On Going</option>
                    <option value="tender">Tender</option>
                  </select>
                </label>
              </div>
            </div>

            <label className="block">
              <span className="text-[10px] font-mono text-slate-500 font-bold">ESTIMASI NILAI (OPSIONAL)</span>
              <input value={form.valueApprox || ''} onChange={(e) => set('valueApprox', e.target.value)}
                placeholder="mis. Rp 250.000.000+"
                className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400" />
            </label>

            {/* Deskripsi singkat */}
            <label className="block">
              <span className="text-[10px] font-mono text-slate-500 font-bold">DESKRIPSI SINGKAT (RINGKASAN KARTU)</span>
              <textarea rows={2} value={form.description} onChange={(e) => set('description', e.target.value)}
                placeholder="1-2 kalimat ringkasan yang tampil di kartu portofolio..."
                className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400" />
            </label>

            {/* Keterangan detail */}
            <label className="block">
              <span className="text-[10px] font-mono text-slate-500 font-bold">KETERANGAN DETAIL (SESUAI KATALOG)</span>
              <textarea rows={5} value={form.details || ''} onChange={(e) => set('details', e.target.value)}
                placeholder="Ceritakan detail lengkap proyek: lingkup pekerjaan, sistem yang dipasang, hasil, dsb..."
                className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 leading-relaxed placeholder:text-slate-400 focus:outline-none focus:border-cyan-400" />
            </label>

            {/* Highlights */}
            <div>
              <span className="text-[10px] font-mono text-slate-500 font-bold">POIN UNGGULAN / LINGKUP PEKERJAAN</span>
              <div className="mt-1.5 flex items-center gap-2">
                <input value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addHighlight(); } }}
                  placeholder="mis. Fiber optic backbone antar gedung"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400" />
                <button type="button" onClick={addHighlight}
                  className="p-2.5 rounded-xl bg-cyan-500 text-white hover:bg-cyan-600 cursor-pointer transition-colors shrink-0">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-2 space-y-1.5">
                {(form.highlights || []).map((h, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                    <span className="flex-1">{h}</span>
                    <button type="button" onClick={() => set('highlights', (form.highlights || []).filter((_, idx) => idx !== i))}
                      className="text-rose-500 hover:text-rose-700 cursor-pointer">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

            {/* Kolom Kanan: Live Preview */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-slate-500 font-bold">PREVIEW KARTU KATALOG</span>
                  <RefreshCw className="w-3 h-3 text-slate-400" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg">
                  <div className="relative h-40">
                    <img src={previewImage} alt={form.title || 'Preview'} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold text-white bg-cyan-500/80 px-2 py-0.5 rounded-lg backdrop-blur truncate">
                        {form.sectorLabel?.trim() || SECTOR_META[form.sector || 'commercial']?.label}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur shrink-0 ${
                        form.status === 'completed' ? 'bg-emerald-500/80 text-white' : 'bg-amber-500/90 text-white'
                      }`}>
                        {form.status === 'completed' ? 'COMPLETED' : form.status === 'tender' ? 'TENDER' : 'ON GOING'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{form.title || 'Nama Proyek'}</h4>
                    <div className="text-[11px] text-cyan-700 font-semibold">{form.clientName || 'Nama Klien'}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <ImagePlus className="w-3 h-3" />
                      {form.location || 'Lokasi proyek'}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                      {form.description || 'Deskripsi singkat proyek akan tampil di sini sebagai ringkasan kartu katalog.'}
                    </p>
                    {(form.highlights || []).length > 0 && (
                      <div className="border-t border-slate-100 pt-2 space-y-1">
                        {(form.highlights || []).slice(0, 3).map((h, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-600">
                            <span className="w-1 h-1 rounded-full bg-cyan-500" />
                            <span className="truncate">{h}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-2 text-[10px] text-slate-400 leading-relaxed">
                  Kartu ini persis seperti tampilan di katalog portofolio website publik. Data tersimpan ke penyimpanan browser admin.
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="lg:col-span-12 flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
              <button type="button" onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-semibold cursor-pointer transition-colors">
                Batal
              </button>
              <button type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all cursor-pointer">
                <Save className="w-4 h-4" />
                {project ? 'Simpan Perubahan' : 'Tambah ke Portofolio'}
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};

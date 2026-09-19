import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  BadgeCheck,
  Check,
  Download,
  FileText,
  Globe,
  HelpCircle,
  Image as ImageIcon,
  Info,
  Layers,
  Palette,
  RefreshCw,
  Save,
  Stamp,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { Logo } from '../Logo.tsx';
import { BRAND_PARTNERS } from '../../data/companyData.ts';
import {
  BrandSettings,
  applyBrandAssets,
  defaultBrandSettings,
  getBrandSettings,
  getCustomLogo,
  saveBrandSettings,
} from '../../data/adminStore';

const MAX_FILE_MB = 5;

/**
 * Baca file gambar menjadi data URL. File raster (PNG/JPG/WebP) otomatis
 * di-downscale ke maxDim agar hemat kuota localStorage; SVG diteruskan apa adanya.
 */
const readImageAsDataUrl = (file: File, maxDim: number): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Hanya file gambar (PNG, JPG, SVG, WebP) yang diperbolehkan.'));
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      reject(new Error('Ukuran file terlalu besar (maksimal 5 MB).'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file.'));
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      if (file.type === 'image/svg+xml') {
        resolve(dataUrl);
        return;
      }
      const img = new Image();
      img.onerror = () => resolve(dataUrl);
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height, 1));
        if (scale >= 1) {
          resolve(dataUrl);
          return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        try {
          resolve(canvas.toDataURL('image/png'));
        } catch {
          resolve(dataUrl);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });

interface AssetMeta {
  name: string;
  sizeKb: number;
}

const describeAsset = (dataUrl: string | null): AssetMeta | null => {
  if (!dataUrl) return null;
  const sizeKb = Math.max(1, Math.round((dataUrl.length * 3) / 4 / 1024));
  return { name: dataUrl.startsWith('data:image/svg') ? 'logo.svg' : 'asset.png', sizeKb };
};

const downloadDataUrl = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/** Toggle switch kecil bergaya dashboard. */
const Switch: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string }> = ({
  checked,
  onChange,
  label,
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative w-10 h-[22px] rounded-full transition-colors cursor-pointer shrink-0 ${
      checked ? 'bg-cyan-500' : 'bg-slate-300'
    }`}
  >
    <span
      className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow transition-transform ${
        checked ? 'translate-x-[22px]' : 'translate-x-[3px]'
      }`}
    />
  </button>
);

export const SettingsTab: React.FC = () => {
  // Draft = semua perubahan di halaman ini tersimpan saat tombol "Simpan Perubahan"
  const [draft, setDraft] = useState<BrandSettings>(() => {
    const loaded = getBrandSettings();
    if (!loaded.mainLogo) loaded.mainLogo = getCustomLogo();
    return loaded;
  });
  const [saving, setSaving] = useState(false);
  const [savedTick, setSavedTick] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [docHeaderTab, setDocHeaderTab] = useState<'kop' | 'sampul'>('kop');
  const [partnerFilter, setPartnerFilter] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Ref input file per slot aset
  const mainInputRef = useRef<HTMLInputElement | null>(null);
  const faviconInputRef = useRef<HTMLInputElement | null>(null);
  const monoInputRef = useRef<HTMLInputElement | null>(null);

  const patchDraft = (patch: Partial<BrandSettings>) => setDraft((d) => ({ ...d, ...patch }));

  const setLegal = (key: keyof BrandSettings['legal'], value: string) =>
    patchDraft({ legal: { ...draft.legal, [key]: value } });

  const handlePick = async (
    e: React.ChangeEvent<HTMLInputElement>,
    slot: 'mainLogo' | 'favicon' | 'monoLogo',
    maxDim: number
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const dataUrl = await readImageAsDataUrl(file, maxDim);
      patchDraft({ [slot]: dataUrl } as Partial<BrandSettings>);
      setFormError(null);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Gagal memuat gambar.');
    }
  };

  const handleSave = () => {
    setSaving(true);
    saveBrandSettings(draft);
    applyBrandAssets();
    setSavedTick(true);
    window.setTimeout(() => {
      setSavedTick(false);
      setSaving(false);
    }, 1800);
  };

  const mainMeta = describeAsset(draft.mainLogo);
  const faviconMeta = describeAsset(draft.favicon);
  const monoMeta = describeAsset(draft.monoLogo);

  return (
    <div className="space-y-5">
      {/* ---------------- Header Halaman ---------------- */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-cyan-600 uppercase tracking-wider">Pengaturan</span>
            <span className="text-[10px] font-mono text-slate-300">•</span>
            <span className="text-[10px] font-mono text-slate-400">Brand Kit</span>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 text-[9px] font-bold font-mono uppercase">
              Brand-wide Aplikasi
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-[9px] font-bold font-mono uppercase">
              Single Source of Truth
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-display mt-1">
            Pengaturan Logo &amp; Identitas Brand
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Kelola seluruh identitas visual IZKATECH — favicon, logo template dokumen (SPH/PKS), kop surat, hingga app
            icon — dalam satu tempat. Sekali simpan, semua bagian aplikasi otomatis mengikuti.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:border-cyan-400 hover:text-teal-800 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-cyan-600" />
            Petunjuk &amp; Dokumen Wajib
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer disabled:opacity-70"
          >
            {savedTick ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {savedTick ? 'Tersimpan' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>

      {formError && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      {/* ---------------- Banner info global ---------------- */}
      <div className="bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 rounded-2xl p-4 relative overflow-hidden shadow-lg shadow-cyan-500/20">
        <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="flex items-start gap-3 relative">
          <div className="p-2 rounded-xl bg-white/15 border border-white/25 shrink-0">
            <Info className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-white font-display">
                Berlaku Global — Sekali Unggah, Semua Ikut
              </span>
              <span className="px-1.5 py-0.5 rounded bg-white/20 text-white text-[8px] font-mono font-bold uppercase">
                Auto-apply
              </span>
            </div>
            <p className="text-[11px] text-cyan-50 mt-1 leading-relaxed">
              Logo utama otomatis diterapkan ke dokumen SPH / PKS / Invoice, navbar &amp; footer website, sidebar
              dashboard admin, halaman login, dan aset publik lainnya. Favicon mengganti icon tab browser secara
              langsung.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/15 border border-white/25 text-[10px] font-mono font-bold text-white shrink-0">
            <BadgeCheck className="w-3.5 h-3.5" /> Live Sync
          </span>
        </div>
      </div>

      {/* ---------------- Grid utama ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* ============ KOLOM KIRI (2/3) ============ */}
        <div className="lg:col-span-2 space-y-4">
          {/* Kartu: Logo Utama */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">
                  Logo Utama (Horizontal Landscape)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  PNG/SVG Transparan — min. 1200×400px (Rekomendasi)
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => mainInputRef.current?.click()}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-[10px] font-bold hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <Upload className="w-3 h-3" /> Unggah
                </button>
                {draft.mainLogo && (
                  <button
                    type="button"
                    onClick={() => patchDraft({ mainLogo: null })}
                    className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 cursor-pointer"
                    title="Hapus logo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Preview area bertitik-titik seperti mockup */}
            <div
              className="mt-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/80 p-6 flex items-center justify-center min-h-[150px] relative overflow-hidden"
              style={{ backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)', backgroundSize: '14px 14px' }}
            >
              {draft.mainLogo ? (
                <img src={draft.mainLogo} alt="Logo utama IZKATECH" className="max-h-24 max-w-[75%] object-contain" />
              ) : (
                <div className="text-center">
                  <Logo size="lg" showText={false} className="mx-auto justify-center" />
                  <p className="text-[10px] font-mono text-slate-400 mt-2">
                    Preview logo default — unggah untuk mengganti
                  </p>
                </div>
              )}
              {mainMeta && (
                <span className="absolute bottom-1.5 left-2 text-[9px] font-mono text-slate-400">
                  {mainMeta.name} • {mainMeta.sizeKb} KB
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => mainInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white text-[11px] font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" /> Ganti Logo
              </button>
              {draft.mainLogo && (
                <button
                  type="button"
                  onClick={() => downloadDataUrl(draft.mainLogo!, 'izkatech-logo-utama.png')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-[11px] font-semibold hover:border-cyan-400 hover:text-teal-800 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download Asset
                </button>
              )}
              <span className="text-[10px] text-slate-400 font-mono ml-auto">logo_main.png</span>
            </div>
            <input
              ref={mainInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handlePick(e, 'mainLogo', 1200)}
            />
          </section>

          {/* Dua kartu berdampingan: Icon & Favicon + Versi Monokrom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kartu: Icon & Favicon */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600">
                  <ImageIcon className="w-3.5 h-3.5" />
                </span>
                <h3 className="text-sm font-bold text-slate-900 font-display">Icon &amp; Favicon</h3>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">PNG/SVG Transparan 1:1 — min. 512×512px</p>

              <div
                className="mt-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/80 p-4 flex items-center justify-center min-h-[110px]"
                style={{ backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)', backgroundSize: '12px 12px' }}
              >
                {draft.favicon ? (
                  <img src={draft.favicon} alt="Favicon IZKATECH" className="w-16 h-16 rounded-2xl object-cover shadow" />
                ) : (
                  <div className="text-center">
                    <Logo size="md" showText={false} className="mx-auto justify-center" />
                    <p className="text-[9px] font-mono text-slate-400 mt-1.5">default favicon.svg</p>
                  </div>
                )}
              </div>
              {faviconMeta && (
                <p className="mt-1.5 text-[9px] font-mono text-slate-400">
                  {faviconMeta.name} • {faviconMeta.sizeKb} KB
                </p>
              )}

              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => faviconInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white text-[11px] font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" /> {draft.favicon ? 'Ganti Icon' : 'Unggah Icon Baru'}
                </button>
                {draft.favicon && (
                  <button
                    type="button"
                    onClick={() => patchDraft({ favicon: null })}
                    className="p-2 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 cursor-pointer"
                    title="Kembalikan favicon default"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="mt-2 flex items-center gap-1 text-[9px] text-emerald-600 font-semibold">
                <BadgeCheck className="w-3 h-3" /> Otomatis jadi icon tab browser setelah disimpan
              </p>
              <input
                ref={faviconInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePick(e, 'favicon', 256)}
              />
            </section>

            {/* Kartu: Versi Monokrom (Stempel) */}
            <section className="bg-white border border-slate-200 rounded-2xl p-5">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-slate-900/5 text-slate-700">
                  <Stamp className="w-3.5 h-3.5" />
                </span>
                <h3 className="text-sm font-bold text-slate-900 font-display">Versi Monokrom (Stempel)</h3>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">SVG/PNG Transparan 1:1 — min. 1000×1000px</p>

              <div className="mt-3 rounded-xl border-2 border-dashed border-slate-200 bg-white p-4 flex items-center justify-center min-h-[110px]">
                {draft.monoLogo ? (
                  <img src={draft.monoLogo} alt="Versi monokrom IZKATECH" className="max-h-16 max-w-[70%] object-contain" />
                ) : (
                  <div className="text-center">
                    <div className="text-lg font-extrabold tracking-[0.2em] text-slate-900 font-display">IZKATECH</div>
                    <p className="text-[9px] font-mono text-slate-400 mt-1.5">versi hitam-putih (stempel)</p>
                  </div>
                )}
              </div>
              {monoMeta && (
                <p className="mt-1.5 text-[9px] font-mono text-slate-400">
                  {monoMeta.name} • {monoMeta.sizeKb} KB
                </p>
              )}

              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => monoInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 text-white text-[11px] font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" /> {draft.monoLogo ? 'Ganti Versi Monokrom' : 'Unggah Monokrom'}
                </button>
                {draft.monoLogo && (
                  <button
                    type="button"
                    onClick={() => patchDraft({ monoLogo: null })}
                    className="p-2 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 cursor-pointer"
                    title="Hapus versi monokrom"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="mt-2 flex items-center gap-1 text-[9px] text-emerald-600 font-semibold">
                <BadgeCheck className="w-3 h-3" /> Dipakai untuk stempel &amp; watermark dokumen resmi
              </p>
              <input
                ref={monoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePick(e, 'monoLogo', 800)}
              />
            </section>
          </div>

          {/* Kartu: Palet Warna Brand Resmi */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                  <Palette className="w-3.5 h-3.5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-display">
                    Palet Warna Brand Resmi (Ekstrak Otomatis)
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Warna identitas resmi IZKATECH — dipakai tema aplikasi &amp; dokumen.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => patchDraft({ colors: defaultBrandSettings().colors })}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-semibold text-slate-500 hover:text-teal-800 hover:border-cyan-400 transition-colors cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3 h-3" /> Setel Ulang
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">
              {([
                ['primary', 'Primary Cyan'],
                ['navy', 'Deep Navy'],
                ['accent', 'Accent Green'],
                ['dark', 'Slate Dark'],
              ] as const).map(([key, label]) => (
                <div key={key} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <input
                    type="color"
                    value={draft.colors[key]}
                    title={label}
                    onChange={(e) => patchDraft({ colors: { ...draft.colors, [key]: e.target.value } })}
                    className="w-full h-8 rounded-lg cursor-pointer bg-transparent p-0 border-0"
                  />
                  <div className="text-[10px] font-bold text-slate-700 truncate">{label}</div>
                  <input
                    type="text"
                    value={draft.colors[key]}
                    spellCheck={false}
                    onChange={(e) => patchDraft({ colors: { ...draft.colors, [key]: e.target.value } })}
                    className="w-full text-[9px] font-mono text-slate-500 bg-transparent border-b border-dashed border-slate-300 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ============ KOLOM KANAN (1/3) ============ */}
        <div className="space-y-4">
          {/* Kartu: Legalitas & Tagline Entitas */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">Legalitas &amp; Tagline Entitas</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Dipakai di kop dokumen SPH/PKS, footer website, dan metadata publik.
              </p>
            </div>

            <label className="block">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Nama Resmi Perusahaan
              </span>
              <input
                value={draft.legal.companyName}
                onChange={(e) => setLegal('companyName', e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-cyan-400"
              />
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              <label className="block">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">Brand Utama</span>
                <input
                  value={draft.legal.brandName}
                  onChange={(e) => setLegal('brandName', e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-cyan-400"
                />
              </label>
              <label className="block">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">Domain Resmi</span>
                <div className="relative mt-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    value={draft.legal.domain}
                    onChange={(e) => setLegal('domain', e.target.value)}
                    className="w-full pl-8 pr-2.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </label>
            </div>

            <label className="block">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Subdomain Dokumen (SPH/PKS)
              </span>
              <input
                value={draft.legal.subdomain}
                onChange={(e) => setLegal('subdomain', e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700 focus:outline-none focus:border-cyan-400"
              />
            </label>

            <div className="pt-0.5 border-t border-dashed border-slate-200">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Tagline &amp; Sub-brand
              </span>
              <label className="block mt-1.5">
                <input
                  value={draft.legal.tagline}
                  onChange={(e) => setLegal('tagline', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700 focus:outline-none focus:border-cyan-400"
                />
              </label>
              <label className="block mt-1.5">
                <input
                  value={draft.legal.subBrand1}
                  onChange={(e) => setLegal('subBrand1', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700 focus:outline-none focus:border-cyan-400"
                />
              </label>
              <label className="block mt-1.5">
                <input
                  value={draft.legal.subBrand2}
                  onChange={(e) => setLegal('subBrand2', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700 focus:outline-none focus:border-cyan-400"
                />
              </label>
            </div>
          </section>

          {/* Kartu: Pengaturan Kop Surat & Watermark */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3.5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">Pengaturan Kop Surat &amp; Watermark</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Berlaku untuk semua template dokumen: SPH, PKS &amp; Invoice.
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-700">Logo Header SPK/Invoice</div>
                <div className="text-[9px] text-slate-500 mt-0.5">
                  Tampilkan logo di kop surat setiap dokumen resmi.
                </div>
              </div>
              <Switch
                label="Logo Header SPK/Invoice"
                checked={draft.letterhead.showHeaderLogo}
                onChange={(v) => patchDraft({ letterhead: { ...draft.letterhead, showHeaderLogo: v } })}
              />
            </div>

            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-slate-700">Watermark Transparan (Body &amp; Arsip)</div>
                <div className="text-[9px] text-slate-500 mt-0.5">
                  Cap monokrom samar di badan dokumen sebagai penanda arsip resmi.
                </div>
              </div>
              <Switch
                label="Watermark Transparan"
                checked={draft.letterhead.showWatermark}
                onChange={(v) => patchDraft({ letterhead: { ...draft.letterhead, showWatermark: v } })}
              />
            </div>

            <div className={`px-3 pb-1 ${draft.letterhead.showWatermark ? '' : 'opacity-40 pointer-events-none'}`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500">Opacity Watermark</span>
                <span className="text-[10px] font-mono font-bold text-cyan-600">
                  {draft.letterhead.watermarkOpacity}%
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={60}
                step={5}
                value={draft.letterhead.watermarkOpacity}
                onChange={(e) =>
                  patchDraft({ letterhead: { ...draft.letterhead, watermarkOpacity: Number(e.target.value) } })
                }
                className="w-full mt-1.5 accent-cyan-500 cursor-pointer"
              />
            </div>
          </section>

          {/* Kartu: Default Header Dokumen */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600">
                <FileText className="w-3.5 h-3.5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display">Default Header Dokumen</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Pratinjau gaya kop &amp; sampul SPH/PKS/Invoice.</p>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 min-h-[150px] flex items-center justify-center overflow-hidden">
              {docHeaderTab === 'kop' ? (
                <div className="w-full bg-white rounded-lg p-3.5 shadow-sm">
                  <div className="flex items-start justify-between gap-2 border-b-2 border-cyan-600 pb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Logo size="sm" variant="cyan-gold" showSubtitle={false} className="shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-slate-900 truncate">{draft.legal.companyName}</div>
                        <div className="text-[8px] text-slate-500 truncate">{draft.legal.subBrand2}</div>
                      </div>
                    </div>
                    <div className="text-[7px] text-slate-500 text-right shrink-0">
                      <div>{draft.legal.domain}</div>
                      <div>info@{draft.legal.domain}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-[9px] font-bold underline uppercase text-slate-800">
                      {draft.legal.brandName === 'IZKATECH' ? 'Surat Penawaran Harga' : 'Dokumen Resmi'}
                    </div>
                    <div className="text-[7px] text-slate-400 mt-0.5">Nomor: SPH/IZKT/2026/…</div>
                  </div>
                </div>
              ) : (
                <div className="w-full bg-gradient-to-br from-slate-900 via-sky-950 to-cyan-950 rounded-lg p-4 text-center shadow-sm">
                  <div className="mx-auto w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                    {draft.mainLogo ? (
                      <img src={draft.mainLogo} alt="" className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <Logo size="sm" showText={false} className="justify-center" />
                    )}
                  </div>
                  <div className="text-[11px] font-extrabold tracking-[0.25em] text-cyan-300 font-display mt-2">
                    {draft.legal.brandName}
                  </div>
                  <div className="text-[7px] uppercase tracking-widest text-emerald-300 mt-0.5">
                    {draft.legal.tagline}
                  </div>
                  <div className="text-[7px] text-slate-400 mt-1.5">{draft.legal.subdomain}</div>
                </div>
              )}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100">
              {(['kop', 'sampul'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setDocHeaderTab(t)}
                  className={`py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                    docHeaderTab === t
                      ? 'bg-white text-teal-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t === 'kop' ? 'Kop Surat' : 'Halaman Sampul'}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Kartu: Pengaturan Logo & Nama Partner Prinsipal */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-600 border border-cyan-500/20">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Pengaturan Logo &amp; Nama Partner Prinsipal (20+ Brands)
              </h3>
              <p className="text-[11px] text-slate-500">
                Ganti nama partner dan unggah logo resmi (Hikvision, Dahua, Fortinet, Cisco, HP, dll.) untuk ditampilkan di section Partner website.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              value={partnerFilter}
              onChange={(e) => setPartnerFilter(e.target.value)}
              placeholder="Cari partner (mis. Hikvision)..."
              className="w-full px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[460px] overflow-y-auto p-1 pr-2">
          {BRAND_PARTNERS.filter((p) => {
            if (!partnerFilter.trim()) return true;
            const q = partnerFilter.toLowerCase();
            const customName = draft.partnerCustomizations?.[p.name]?.name || '';
            return p.name.toLowerCase().includes(q) || customName.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
          }).map((p) => {
            const custom = draft.partnerCustomizations?.[p.name] || {};
            const currentName = custom.name !== undefined ? custom.name : p.name;
            const currentLogo = custom.logo || null;

            return (
              <div key={p.name} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    {p.categoryKey}
                  </span>
                  {currentLogo && (
                    <span className="px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-700 text-[9px] font-bold border border-cyan-200">
                      Logo Kustom
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden p-1 shadow-xs">
                    {currentLogo ? (
                      <img src={currentLogo} alt={currentName} className="w-full h-full object-contain" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <label className="block text-[9px] font-mono text-slate-400">Nama Partner:</label>
                    <input
                      type="text"
                      value={currentName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDraft((prev) => ({
                          ...prev,
                          partnerCustomizations: {
                            ...prev.partnerCustomizations,
                            [p.name]: {
                              ...prev.partnerCustomizations?.[p.name],
                              name: val,
                            },
                          },
                        }));
                      }}
                      placeholder={p.name}
                      className="w-full px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <label className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-[10px] font-bold hover:bg-slate-800 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{currentLogo ? 'Ganti Logo' : 'Unggah Logo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const dataUrl = await readImageAsDataUrl(file, 400);
                          setDraft((prev) => ({
                            ...prev,
                            partnerCustomizations: {
                              ...prev.partnerCustomizations,
                              [p.name]: {
                                ...prev.partnerCustomizations?.[p.name],
                                logo: dataUrl,
                              },
                            },
                          }));
                        } catch (err) {
                          setFormError(err instanceof Error ? err.message : 'Gagal memuat logo partner.');
                        }
                        e.target.value = '';
                      }}
                    />
                  </label>

                  {(currentLogo || (custom.name !== undefined && custom.name !== p.name)) && (
                    <button
                      type="button"
                      onClick={() => {
                        setDraft((prev) => {
                          const updated = { ...prev.partnerCustomizations };
                          delete updated[p.name];
                          return { ...prev, partnerCustomizations: updated };
                        });
                      }}
                      title="Reset logo & nama partner ke bawaan"
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------- Modal: Petunjuk & Dokumen Wajib ---------------- */}
      {helpOpen && (
        <div
          className="fixed inset-0 z-[65] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setHelpOpen(false)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600">
                  <HelpCircle className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-display">Petunjuk &amp; Dokumen Wajib</h3>
                  <p className="text-[10px] text-slate-500">Spesifikasi resmi aset identitas IZKATECH.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 cursor-pointer transition-colors"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ul className="space-y-2 text-[11px] text-slate-600 leading-relaxed">
              <li className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-800">Logo Utama</strong> — PNG/SVG transparan, rasio horizontal
                landscape, minimal 1200×400px. Dipakai di navbar, sidebar admin, kop dokumen SPH/PKS/Invoice.
              </li>
              <li className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-800">Icon &amp; Favicon</strong> — PNG/SVG transparan persegi 1:1,
                minimal 512×512px. Otomatis menjadi icon tab browser setelah disimpan.
              </li>
              <li className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-800">Versi Monokrom</strong> — SVG/PNG transparan 1:1, minimal
                1000×1000px, warna solid gelap. Dipakai untuk stempel dan watermark dokumen.
              </li>
              <li className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-800">Wajib transparan</strong> — hindari latar putih pada file aset;
                gunakan mode PNG-24/SVG dengan channel alpha agar rapi di semua latar.
              </li>
            </ul>

            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-[10px] text-amber-800">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                Aset disimpan lokal di perangkat ini (localStorage) sebagai <em>single source of truth</em>. Maksimal 5
                MB per file; gambar besar otomatis dikompres agar hemat ruang.
              </span>
            </div>

            <button
              type="button"
              onClick={() => setHelpOpen(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold cursor-pointer hover:from-cyan-400 hover:to-blue-500 transition-all"
            >
              Mengerti, Tutup Petunjuk
            </button>
          </div>
        </div>
      )}

      {/* ---------------- Toast sukses ---------------- */}
      {savedTick && (
        <div className="fixed bottom-5 right-5 z-[70] flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-2xl">
          <Check className="w-4 h-4" />
          Identitas brand tersimpan &amp; diterapkan ke seluruh aplikasi
        </div>
      )}
    </div>
  );
};


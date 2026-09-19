import React, { useMemo, useRef, useState } from 'react';
import {
  AdminBackupBundle,
  BackupImportMode,
  applyBackup,
  buildBackupBundle,
  getStorageUsage,
  resetAllData,
  validateBackup,
} from '../../data/adminStore.ts';
import { csvDateStamp, downloadJson, formatNumber } from '../../utils/reportUtils.ts';
import {
  AlertTriangle,
  ArchiveRestore,
  CheckCircle2,
  Database,
  Download,
  HardDriveDownload,
  Info,
  RefreshCw,
  ShieldAlert,
  Trash2,
} from 'lucide-react';

interface BackupTabProps {
  /** Dipanggil setelah data dipulihkan/direset agar dashboard memuat ulang state */
  onDataRestored: () => void;
}

/** Ukuran berkas ringkas untuk indikator penyimpanan */
const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
};

const formatDateTime = (iso: string): string => {
  if (!iso) return 'tidak diketahui';
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });
};

interface PanelProps {
  title: string;
  subtitle?: string;
  icon: React.FC<{ className?: string }>;
  tone?: 'default' | 'amber' | 'rose';
  action?: React.ReactNode;
  children: React.ReactNode;
}

const PANEL_TONE = {
  default: 'bg-white border-slate-200',
  amber: 'bg-amber-50 border-amber-200',
  rose: 'bg-rose-50/60 border-rose-200',
};

/** Kartu panel seragam untuk halaman Pusat Data & Cadangan */
const Panel: React.FC<PanelProps> = ({ title, subtitle, icon: Icon, tone = 'default', action, children }) => (
  <div className={`border rounded-2xl shadow-sm overflow-hidden ${PANEL_TONE[tone]}`}>
    <div className="p-5 border-b border-slate-200/70 flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Icon className="w-4 h-4 text-cyan-600" />
          {title}
        </h3>
        {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

/**
 * TAB PUSAT DATA & CADANGAN
 *
 * Seluruh data portal admin tersimpan di localStorage browser, sehingga
 * rawan hilang (clear browsing data, ganti perangkat, mode incognito).
 * Halaman ini menyediakan cadangan .json, pemulihan, indikator pemakaian
 * penyimpanan, dan reset ke data contoh.
 */
export const BackupTab: React.FC<BackupTabProps> = ({ onDataRestored }) => {
  const [mode, setMode] = useState<BackupImportMode>('merge');
  const [pending, setPending] = useState<AdminBackupBundle | null>(null);
  const [pendingFileName, setPendingFileName] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  // Dinaikkan setelah impor/reset agar indikator penyimpanan dihitung ulang
  const [usageVersion, setUsageVersion] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const usage = useMemo(() => getStorageUsage(), [usageVersion]);
  const usagePercent = Math.min(
    100,
    Math.round((usage.totalBytes / usage.quotaBytes) * 1000) / 10
  );
  const isStorageTight = usagePercent >= 80;

  // Jumlah data aktif untuk ringkasan panel cadangan (dihitung ulang setelah impor/reset)
  const dataCounts = useMemo(() => buildBackupBundle().counts, [usageVersion]);

  const handleExport = () => {
    const bundle = buildBackupBundle();
    downloadJson(`izkatech_backup_${csvDateStamp()}.json`, bundle);
    setError('');
    setNotice(
      `Cadangan berisi ${formatNumber(bundle.counts.inquiries)} prospek, ${formatNumber(bundle.counts.projects)} proyek & ${formatNumber(bundle.counts.chatSessions)} sesi chat berhasil diunduh.`
    );
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setNotice('');
    try {
      const text = await file.text();
      const result = validateBackup(text);
      if (!result.ok) {
        setPending(null);
        setPendingFileName('');
        setError(result.error);
        return;
      }
      setError('');
      setPending(result.bundle);
      setPendingFileName(file.name);
    } catch {
      setPending(null);
      setPendingFileName('');
      setError('Berkas gagal dibaca oleh browser. Coba unduh ulang cadangan.');
    }
  };

  const handleApply = () => {
    if (!pending) return;
    if (mode === 'replace') {
      const confirmed = window.confirm(
        'Timpa SELURUH data portal dengan isi cadangan? Data yang ada saat ini akan hilang dan tidak dapat dikembalikan.'
      );
      if (!confirmed) return;
    }

    const result = applyBackup(pending, mode);
    onDataRestored();
    setPending(null);
    setPendingFileName('');
    setError('');
    setUsageVersion((version) => version + 1);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setNotice(
      mode === 'replace'
        ? `Data ditimpa dari cadangan: ${formatNumber(result.inquiries.length)} prospek, ${formatNumber(result.projects.length)} proyek & ${formatNumber(result.chatSessions.length)} sesi chat.`
        : `Cadangan digabungkan — total kini ${formatNumber(result.inquiries.length)} prospek, ${formatNumber(result.projects.length)} proyek & ${formatNumber(result.chatSessions.length)} sesi chat.`
    );
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      'Reset seluruh data portal ke data contoh bawaan? Seluruh prospek, proyek & riwayat chat saat ini akan hilang.'
    );
    if (!confirmed) return;
    resetAllData();
    onDataRestored();
    setPending(null);
    setPendingFileName('');
    setError('');
    setUsageVersion((version) => version + 1);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setNotice('Seluruh data portal telah direset ke data contoh bawaan.');
  };

  return (
    <div className="space-y-6">
      {/* Judul halaman */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 font-display">Pusat Data &amp; Cadangan</h2>
        <p className="text-xs text-slate-500">
          Amankan data portal admin — unduh cadangan, pulihkan dari berkas, atau reset ke data contoh.
        </p>
      </div>

      {/* Peringatan penyimpanan lokal */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-[11px] text-amber-800 leading-relaxed">
          <strong className="block text-xs mb-0.5">Data tersimpan hanya di browser ini (localStorage).</strong>
          Membersihkan data peramban, memakai mode incognito, atau berganti perangkat akan menghapus seluruh
          prospek, proyek &amp; riwayat chat. Unduh cadangan secara berkala dan simpan di penyimpanan perusahaan.
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-rose-50 border border-rose-200">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="text-[11px] text-rose-700 leading-relaxed">{error}</span>
        </div>
      )}

      {notice && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span className="text-[11px] text-emerald-800 leading-relaxed">{notice}</span>
        </div>
      )}

      {/* Panel unduh cadangan */}
      <Panel
        title="Unduh Cadangan Data"
        subtitle="Satu berkas .json berisi prospek, portofolio proyek, live chat & identitas brand"
        icon={Database}
        action={
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white text-[11px] font-bold shadow-sm shadow-cyan-500/25 transition-colors cursor-pointer shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Cadangan (.json)</span>
          </button>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Data Prospek</div>
            <div className="text-lg font-bold font-display text-slate-800">{formatNumber(dataCounts.inquiries)}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Proyek Portofolio</div>
            <div className="text-lg font-bold font-display text-slate-800">{formatNumber(dataCounts.projects)}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Sesi Live Chat</div>
            <div className="text-lg font-bold font-display text-slate-800">{formatNumber(dataCounts.chatSessions)}</div>
          </div>
        </div>
        <p className="mt-3 text-[10px] text-slate-400 leading-relaxed">
          Berkas cadangan juga memuat pengaturan logo, favicon &amp; identitas brand sehingga tampilan dapat
          dipulihkan persis seperti saat diunduh.
        </p>
      </Panel>

      {/* Panel pemakaian penyimpanan */}
      <Panel
        title="Pemakaian Penyimpanan Browser"
        subtitle={`Perkiraan ${formatBytes(usage.totalBytes)} dari kuota ±${formatBytes(usage.quotaBytes)} — batas sebenarnya berbeda tiap browser`}
        icon={HardDriveDownload}
      >
        <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isStorageTight ? 'bg-rose-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}
            style={{ width: `${usagePercent}%` }}
          />
        </div>
        <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-500">Terpakai {formatBytes(usage.totalBytes)} ({usagePercent}%)</span>
          <span className="text-slate-400">Kuota ±{formatBytes(usage.quotaBytes)}</span>
        </div>

        {isStorageTight && (
          <p className="mt-3 text-[11px] text-rose-600 flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>Penyimpanan hampir penuh. Unduh cadangan, lalu pertimbangkan menghapus data lama agar data baru tetap dapat disimpan.</span>
          </p>
        )}

        <div className="mt-4 divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
          {usage.entries.map((entry) => (
            <div key={entry.key} className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-white">
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-slate-700 truncate">{entry.label}</div>
                <div className="text-[9px] font-mono text-slate-400 truncate">{entry.key}</div>
              </div>
              <span className="text-[11px] font-mono text-slate-600 shrink-0">{formatBytes(entry.bytes)}</span>
            </div>
          ))}
        </div>
      </Panel>

      {/* Panel pemulihan dari berkas cadangan */}
      <Panel
        title="Pulihkan dari Berkas Cadangan"
        subtitle="Pilih berkas .json hasil unduhan sebelumnya, lalu tentukan cara pemulihannya"
        icon={ArchiveRestore}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pemilih berkas */}
          <div className="space-y-2">
            <label htmlFor="backup-file" className="block text-[11px] font-semibold text-slate-600">
              Berkas cadangan (.json)
            </label>
            <input
              id="backup-file"
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleFileChange}
              className="block w-full text-[11px] text-slate-600 bg-white border border-slate-300 rounded-xl file:mr-3 file:px-3 file:py-2 file:border-0 file:bg-cyan-500 file:text-white file:text-[11px] file:font-bold file:cursor-pointer cursor-pointer"
            />
            <p className="text-[10px] text-slate-400 flex items-start gap-1.5">
              <Info className="w-3 h-3 shrink-0 mt-0.5" />
              <span>Berkas dibaca langsung di browser Anda dan tidak dikirim ke mana pun.</span>
            </p>
          </div>

          {/* Pilihan cara pemulihan */}
          <div className="space-y-2">
            <span className="block text-[11px] font-semibold text-slate-600">Cara pemulihan</span>
            <button
              onClick={() => setMode('merge')}
              className={`w-full text-left p-3 rounded-xl border transition-colors cursor-pointer ${
                mode === 'merge' ? 'bg-cyan-50 border-cyan-400' : 'bg-white border-slate-200 hover:border-cyan-300'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-800">Gabung (aman)</div>
              <div className="text-[10px] text-slate-500 leading-snug mt-0.5">
                Data yang sudah ada dipertahankan; item dengan ID sama diperbarui dari cadangan. Identitas brand tidak diubah.
              </div>
            </button>
            <button
              onClick={() => setMode('replace')}
              className={`w-full text-left p-3 rounded-xl border transition-colors cursor-pointer ${
                mode === 'replace' ? 'bg-rose-50 border-rose-400' : 'bg-white border-slate-200 hover:border-rose-300'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-800">Timpa seluruhnya (hati-hati)</div>
              <div className="text-[10px] text-slate-500 leading-snug mt-0.5">
                Ganti seluruh data dengan isi cadangan, termasuk identitas &amp; aset brand. Data saat ini akan hilang.
              </div>
            </button>
          </div>
        </div>
        {/* Pratinjau berkas yang dipilih */}
        {pending && (
          <div className="mt-4 p-4 rounded-xl bg-cyan-50 border border-cyan-200 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-800">
              <CheckCircle2 className="w-4 h-4" />
              Berkas cadangan valid &amp; siap dipulihkan
            </div>
            <div className="text-[11px] font-mono text-cyan-900/80 truncate">{pendingFileName}</div>
            <div className="text-[11px] text-cyan-900">Dibuat: {formatDateTime(pending.exportedAt)}</div>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2 py-0.5 rounded-full bg-white border border-cyan-300 text-[10px] font-mono text-cyan-700">
                {formatNumber(pending.counts.inquiries)} prospek
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white border border-cyan-300 text-[10px] font-mono text-cyan-700">
                {formatNumber(pending.counts.projects)} proyek
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white border border-cyan-300 text-[10px] font-mono text-cyan-700">
                {formatNumber(pending.counts.chatSessions)} sesi chat
              </span>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={handleApply}
            disabled={!pending}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[11px] font-bold transition-colors ${
              pending
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white shadow-sm shadow-cyan-500/25 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Terapkan Pemulihan</span>
          </button>
          {pending && (
            <button
              onClick={() => {
                setPending(null);
                setPendingFileName('');
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-600 hover:border-slate-400 text-[11px] font-semibold transition-colors cursor-pointer"
            >
              <span>Batalkan Pilihan Berkas</span>
            </button>
          )}
        </div>
      </Panel>

      {/* Zona berbahaya */}
      <Panel
        title="Zona Berbahaya"
        subtitle="Tindakan berikut tidak dapat dibatalkan"
        icon={ShieldAlert}
        tone="rose"
        action={
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-rose-300 text-rose-600 hover:bg-rose-100 text-[11px] font-bold transition-colors cursor-pointer shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset ke Data Contoh</span>
          </button>
        }
      >
        <p className="text-[11px] text-rose-800 leading-relaxed">
          Menghapus seluruh prospek, proyek portofolio, riwayat live chat &amp; konfigurasi identitas brand dari
          browser ini, lalu memuat kembali data contoh bawaan. Unduh cadangan terlebih dahulu apabila data masih
          dibutuhkan.
        </p>
      </Panel>
    </div>
  );
};
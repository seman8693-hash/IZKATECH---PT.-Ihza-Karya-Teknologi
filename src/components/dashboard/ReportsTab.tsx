import React, { useMemo, useState } from 'react';
import { AdminInquiry, AdminProject } from '../../types/admin.ts';
import { SECTOR_META } from '../../data/adminStore.ts';
import { StatsCard } from './StatsCard.tsx';
import {
  REPORT_RANGES,
  ReportRangeKey,
  buildFunnel,
  buildMonthlyTrend,
  buildProjectStats,
  buildServiceDemand,
  countBy,
  csvDateStamp,
  downloadCsv,
  filterByRange,
  formatCompactRupiah,
  formatNumber,
  formatReportDate,
  formatRupiah,
  percent as percentOf,
  rankProjectsByValue,
  summarizeConversion,
} from '../../utils/reportUtils.ts';
import {
  BarChart3,
  Briefcase,
  CheckCircle,
  Download,
  Inbox,
  Layers,
  Percent,
  Printer,
  Radio,
  Target,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { useBrandIdentity } from '../../hooks/useBrandIdentity.ts';

interface ReportsTabProps {
  inquiries: AdminInquiry[];
  projects: AdminProject[];
}

/** Warna bar corong prospek per status */
const STATUS_BAR: Record<AdminInquiry['status'], string> = {
  new: 'bg-amber-500',
  contacted: 'bg-blue-500',
  survey: 'bg-cyan-500',
  deal: 'bg-emerald-500',
  archived: 'bg-slate-400',
};

/** Label ramah pengguna untuk sumber prospek */
const SOURCE_LABEL: Record<string, string> = {
  kalkulator: 'Kalkulator Estimasi',
  kontak: 'Formulir Kontak Website',
  rfp: 'RFP / Tender',
  manual: 'Input Manual Admin',
};

/** Label ramah pengguna untuk status proyek */
const PROJECT_STATUS_LABEL: Record<string, string> = {
  completed: 'Selesai (Completed)',
  in_progress: 'Sedang Berjalan',
  tender: 'Tahap Tender',
};

interface ReportCardProps {
  title: string;
  subtitle?: string;
  icon: React.FC<{ className?: string }>;
  onExport?: () => void;
  children: React.ReactNode;
}

/** Kartu laporan seragam dengan tombol ekspor CSV opsional */
const ReportCard: React.FC<ReportCardProps> = ({ title, subtitle, icon: Icon, onExport, children }) => (
  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
    <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Icon className="w-4 h-4 text-cyan-600" />
          {title}
        </h3>
        {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {onExport && (
        <button
          onClick={onExport}
          className="print:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 text-[11px] font-semibold transition-colors cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Unduh CSV</span>
        </button>
      )}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

interface BarItem {
  label: string;
  count: number;
  /** Persentase terhadap total data periode (ditampilkan) */
  percent: number;
  barClass?: string;
  barStyle?: React.CSSProperties;
}

/** Daftar bar horizontal sederhana (tanpa library chart) */
const BarList: React.FC<{ items: BarItem[]; emptyText: string }> = ({ items, emptyText }) => {
  if (items.length === 0) {
    return <p className="text-xs text-slate-400 py-2">{emptyText}</p>;
  }
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between gap-3 text-[11px]">
            <span className="font-semibold text-slate-700 truncate" title={item.label}>
              {item.label}
            </span>
            <span className="font-mono text-slate-500 shrink-0">
              {formatNumber(item.count)}
              <span className="text-slate-400"> • {item.percent}%</span>
            </span>
          </div>
          <div className="mt-1.5 h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full ${item.barStyle ? '' : item.barClass || 'bg-cyan-500'}`}
              style={{ width: `${item.count > 0 ? Math.max(item.percent, 3) : 0}%`, ...item.barStyle }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * TAB LAPORAN & ANALITIK
 *
 * Ringkasan performa prospek, konversi sales, permintaan layanan, dan
 * statistik portofolio proyek. Seluruh angka dihitung dari data store admin
 * (localStorage) sehingga tidak memerlukan backend.
 */
export const ReportsTab: React.FC<ReportsTabProps> = ({ inquiries, projects }) => {
  const identity = useBrandIdentity();
  const [rangeKey, setRangeKey] = useState<ReportRangeKey>('all');

  const rangeLabel = (
    REPORT_RANGES.find((range) => range.key === rangeKey) ||
    REPORT_RANGES[REPORT_RANGES.length - 1]
  ).label;

  // Prospek pada periode terpilih
  const scopedInquiries = useMemo(
    () => filterByRange(inquiries, (item) => item.timestamp, rangeKey),
    [inquiries, rangeKey]
  );

  const conversion = useMemo(() => summarizeConversion(scopedInquiries), [scopedInquiries]);
  const funnel = useMemo(() => buildFunnel(scopedInquiries), [scopedInquiries]);
  const sources = useMemo(() => countBy(scopedInquiries, (item) => item.source), [scopedInquiries]);
  const services = useMemo(() => buildServiceDemand(scopedInquiries), [scopedInquiries]);
  // Tren sengaja memakai seluruh prospek agar pola 6 bulan tetap terbaca
  // meskipun periode aktif hanya 7/30/90 hari.
  const trend = useMemo(() => buildMonthlyTrend(inquiries), [inquiries]);
  const projectStats = useMemo(() => buildProjectStats(projects), [projects]);
  const topProjects = useMemo(() => rankProjectsByValue(projects), [projects]);

  const totalProjects = Math.max(projectStats.total, 1);
  const maxTrend = Math.max(1, ...trend.map((point) => point.inquiries));
  const stamp = csvDateStamp();

  // ---- Ekspor CSV per panel ----
  const exportSummaryCsv = () =>
    downloadCsv(
      `izkatech_ringkasan_laporan_${stamp}.csv`,
      ['Periode', 'Total Prospek', 'Deal / SPK', 'Tingkat Konversi (%)', 'Sudah Ditindaklanjuti', 'Nilai Portofolio (Rp)', 'Proyek Bernilai Nominal'],
      [[rangeLabel, conversion.total, conversion.deal, conversion.conversionRate, conversion.responded, projectStats.totalValue, projectStats.valuedCount]]
    );

  const exportFunnelCsv = () =>
    downloadCsv(
      `izkatech_corong_prospek_${stamp}.csv`,
      ['Tahap Pipeline', 'Jumlah', 'Persentase (%)'],
      funnel.map((stage) => [stage.label, stage.count, stage.percent])
    );

  const exportSourceCsv = () =>
    downloadCsv(
      `izkatech_sumber_prospek_${stamp}.csv`,
      ['Sumber Prospek', 'Jumlah', 'Persentase (%)'],
      sources.map((entry) => [SOURCE_LABEL[entry.key] || entry.key, entry.count, percentOf(entry.count, conversion.total)])
    );

  const exportServiceCsv = () =>
    downloadCsv(
      `izkatech_permintaan_layanan_${stamp}.csv`,
      ['Layanan', 'Jumlah Permintaan', 'Persentase (%)'],
      services.map((entry) => [entry.key, entry.count, percentOf(entry.count, conversion.total)])
    );

  const exportTrendCsv = () =>
    downloadCsv(
      `izkatech_tren_prospek_${stamp}.csv`,
      ['Bulan', 'Jumlah Prospek'],
      trend.map((point) => [point.label, point.inquiries])
    );

  const exportPortfolioCsv = () =>
    downloadCsv(
      `izkatech_statistik_portofolio_${stamp}.csv`,
      ['Kategori', 'Kelompok', 'Jumlah Proyek', 'Persentase (%)'],
      [
        ...projectStats.bySector.map((entry) => ['Sektor', SECTOR_META[entry.key]?.label || entry.key, entry.count, percentOf(entry.count, projectStats.total)]),
        ...projectStats.byStatus.map((entry) => ['Status', PROJECT_STATUS_LABEL[entry.key] || entry.key, entry.count, percentOf(entry.count, projectStats.total)]),
        ...projectStats.byYear.map((entry) => ['Tahun', entry.key, entry.count, percentOf(entry.count, projectStats.total)]),
      ]
    );

  const exportProjectValuesCsv = () =>
    downloadCsv(
      `izkatech_nilai_proyek_${stamp}.csv`,
      ['Proyek', 'Klien', 'Sektor', 'Tahun', 'Nilai (Rp)'],
      topProjects.map((entry) => [entry.project.title, entry.project.clientName, entry.project.sectorLabel || entry.project.category, entry.project.year, entry.value])
    );

  // ---- Data bar untuk tiap panel ----
  const funnelItems: BarItem[] = funnel.map((stage) => ({
    label: stage.label,
    count: stage.count,
    percent: stage.percent,
    barClass: STATUS_BAR[stage.status],
  }));

  const sourceItems: BarItem[] = sources.map((entry) => ({
    label: SOURCE_LABEL[entry.key] || entry.key,
    count: entry.count,
    percent: percentOf(entry.count, conversion.total),
  }));

  const serviceItems: BarItem[] = services.slice(0, 8).map((entry) => ({
    label: entry.key,
    count: entry.count,
    percent: percentOf(entry.count, conversion.total),
    barClass: 'bg-blue-500',
  }));

  const sectorItems: BarItem[] = projectStats.bySector.map((entry) => ({
    label: SECTOR_META[entry.key]?.label || entry.key,
    count: entry.count,
    percent: percentOf(entry.count, totalProjects),
    // Warna sektor mengikuti SECTOR_META agar konsisten dengan katalog portofolio
    barStyle: { backgroundColor: SECTOR_META[entry.key]?.grad[0] || '#0e7490' },
  }));

  const statusItems: BarItem[] = projectStats.byStatus.map((entry) => ({
    label: PROJECT_STATUS_LABEL[entry.key] || entry.key,
    count: entry.count,
    percent: percentOf(entry.count, totalProjects),
    barClass:
      entry.key === 'completed' ? 'bg-emerald-500' : entry.key === 'in_progress' ? 'bg-cyan-500' : 'bg-amber-500',
  }));

  const yearItems: BarItem[] = projectStats.byYear.map((entry) => ({
    label: entry.key,
    count: entry.count,
    percent: percentOf(entry.count, totalProjects),
    barClass: 'bg-slate-500',
  }));

  return (
    <div className="space-y-6">
      {/* Kop laporan — hanya tampil saat dicetak */}
      <div className="hidden print:block">
        <div className="text-base font-bold text-slate-900">
          {identity.companyName} — Laporan Performa Prospek &amp; Portofolio Proyek
        </div>
        <div className="text-[11px] text-slate-500">
          Periode: {rangeLabel} • Dicetak: {formatReportDate()}
        </div>
      </div>

      {/* Toolbar: judul, filter periode & aksi laporan */}
      <div className="print:hidden flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-display">Laporan &amp; Analitik</h2>
          <p className="text-xs text-slate-500">
            Rekapitulasi prospek, tingkat konversi sales &amp; sebaran portofolio proyek.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {REPORT_RANGES.map((range) => (
            <button
              key={range.key}
              onClick={() => setRangeKey(range.key)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-colors cursor-pointer ${
                rangeKey === range.key
                  ? 'bg-cyan-500 border-cyan-500 text-white shadow-sm shadow-cyan-500/25'
                  : 'bg-white border-slate-300 text-slate-600 hover:border-cyan-400 hover:text-cyan-700'
              }`}
            >
              {range.label}
            </button>
          ))}
          <button
            onClick={exportSummaryCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 text-[11px] font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ringkasan CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-600 hover:border-cyan-400 hover:text-cyan-700 text-[11px] font-semibold transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>
      {/* Kartu KPI ringkas periode terpilih */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 items-stretch">
        <StatsCard label={`Prospek — ${rangeLabel}`} value={conversion.total} icon={Inbox} accent="cyan" sub="Formulir web, RFP & input manual" />
        <StatsCard label="Deal / SPK" value={conversion.deal} icon={CheckCircle} accent="emerald" sub={`${conversion.conversionRate}% dari total prospek`} />
        <StatsCard label="Tingkat Konversi" value={`${conversion.conversionRate}%`} icon={Percent} accent="blue" sub={`${conversion.responded} prospek ditindaklanjuti`} />
        <StatsCard label="Estimasi Nilai Portofolio" value={formatCompactRupiah(projectStats.totalValue)} icon={Wallet} accent="purple" sub={`${projectStats.valuedCount} dari ${projectStats.total} proyek bernilai nominal`} />
        <StatsCard label="Proyek Portofolio" value={projectStats.total} icon={Briefcase} accent="teal" sub={`${projectStats.completed} selesai • ${projectStats.inProgress} berjalan`} className="sm:col-span-2 md:col-span-1" />
      </div>

      {conversion.total === 0 && (
        <div className="p-6 text-center text-xs text-slate-600 bg-amber-50 border border-amber-200 rounded-2xl">
          Belum ada prospek pada periode <strong>{rangeLabel}</strong>. Pilih periode yang lebih luas untuk melihat analitik prospek.
        </div>
      )}

      {/* Corong pipeline prospek */}
      <ReportCard
        title="Corong Pipeline Prospek"
        subtitle={`Sebaran status penanganan prospek — periode ${rangeLabel.toLowerCase()}`}
        icon={Target}
        onExport={exportFunnelCsv}
      >
        <BarList items={funnelItems} emptyText="Belum ada prospek pada periode ini." />
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 font-semibold">
            <Percent className="w-3 h-3" />
            Tingkat respons {conversion.responseRate}%
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
            <CheckCircle className="w-3 h-3" />
            Konversi deal {conversion.conversionRate}%
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-semibold">
            <Inbox className="w-3 h-3" />
            {conversion.responded} dari {conversion.total} prospek ditindaklanjuti
          </span>
        </div>
      </ReportCard>
      {/* Sumber prospek & permintaan layanan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <ReportCard
          title="Sumber Prospek"
          subtitle="Kanal masuknya lead ke IZKATECH"
          icon={Radio}
          onExport={exportSourceCsv}
        >
          <BarList items={sourceItems} emptyText="Belum ada prospek pada periode ini." />
        </ReportCard>

        <ReportCard
          title="Permintaan Layanan Terbanyak"
          subtitle="Jumlah prospek per layanan (8 teratas)"
          icon={Layers}
          onExport={exportServiceCsv}
        >
          <BarList items={serviceItems} emptyText="Belum ada permintaan layanan pada periode ini." />
        </ReportCard>
      </div>

      {/* Tren prospek 6 bulan terakhir */}
      <ReportCard
        title="Tren Prospek 6 Bulan Terakhir"
        subtitle="Volume prospek masuk per bulan (seluruh data, tidak mengikuti filter periode)"
        icon={TrendingUp}
        onExport={exportTrendCsv}
      >
        <div className="flex items-end gap-2 sm:gap-3 h-36 overflow-hidden">
          {trend.map((point) => (
            <div key={point.key} className="flex-1 min-w-0 h-full flex flex-col items-center justify-end gap-1.5">
              <span className="text-[10px] font-mono font-bold text-slate-600">{point.inquiries}</span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-cyan-600 to-blue-400"
                style={{ height: `${Math.max((point.inquiries / maxTrend) * 100, point.inquiries > 0 ? 6 : 2)}%` }}
                title={`${point.label}: ${point.inquiries} prospek`}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-2 sm:gap-3">
          {trend.map((point) => (
            <span key={point.key} className="flex-1 min-w-0 text-center text-[9px] font-mono text-slate-400 truncate">
              {point.label}
            </span>
          ))}
        </div>
      </ReportCard>
      {/* Statistik portofolio proyek */}
      <ReportCard
        title="Statistik Portofolio Proyek"
        subtitle={`Rekap ${projectStats.total} proyek — sektor, status pengerjaan & tahun pelaksanaan`}
        icon={BarChart3}
        onExport={exportPortfolioCsv}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">Sebaran Sektor</h4>
            <BarList items={sectorItems} emptyText="Belum ada data proyek." />
          </div>
          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">Status Pengerjaan</h4>
            <BarList items={statusItems} emptyText="Belum ada data proyek." />
          </div>
          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">Tahun Pelaksanaan</h4>
            <BarList items={yearItems} emptyText="Belum ada data proyek." />
          </div>
        </div>
      </ReportCard>

      {/* Nilai proyek tertinggi */}
      <ReportCard
        title="Nilai Proyek Tertinggi"
        subtitle={`Total estimasi ${formatCompactRupiah(projectStats.totalValue)} dari ${projectStats.valuedCount} proyek bernilai nominal`}
        icon={Briefcase}
        onExport={exportProjectValuesCsv}
      >
        {topProjects.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">Belum ada proyek dengan nominal nilai tertera.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-200">
                  <th className="py-2 pr-4 font-semibold">Proyek</th>
                  <th className="py-2 pr-4 font-semibold">Klien</th>
                  <th className="py-2 pr-4 font-semibold">Sektor</th>
                  <th className="py-2 pr-4 font-semibold">Tahun</th>
                  <th className="py-2 pr-4 font-semibold text-right">Nilai</th>
                </tr>
              </thead>
              <tbody>
                {topProjects.map(({ project, value }) => (
                  <tr key={project.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-2.5 pr-4 text-xs font-semibold text-slate-800 max-w-[240px] truncate" title={project.title}>
                      {project.title}
                    </td>
                    <td className="py-2.5 pr-4 text-[11px] text-slate-500 max-w-[200px] truncate" title={project.clientName}>
                      {project.clientName}
                    </td>
                    <td className="py-2.5 pr-4 text-[11px] text-slate-500">{project.sectorLabel || project.category}</td>
                    <td className="py-2.5 pr-4 text-[11px] font-mono text-slate-500">{project.year}</td>
                    <td className="py-2.5 pr-4 text-[11px] font-bold text-emerald-600 text-right whitespace-nowrap">
                      {formatRupiah(value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Ringkasan angka portofolio */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Total Proyek</div>
            <div className="text-lg font-bold font-display text-slate-800">{formatNumber(projectStats.total)}</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-600">Selesai</div>
            <div className="text-lg font-bold font-display text-emerald-700">{formatNumber(projectStats.completed)}</div>
          </div>
          <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200">
            <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-600">Sedang Berjalan</div>
            <div className="text-lg font-bold font-display text-cyan-700">{formatNumber(projectStats.inProgress)}</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
            <div className="text-[10px] font-mono uppercase tracking-wider text-purple-600">Rata-rata Nilai</div>
            <div className="text-lg font-bold font-display text-purple-700">{formatCompactRupiah(projectStats.averageValue)}</div>
          </div>
        </div>
      </ReportCard>
    </div>
  );
};
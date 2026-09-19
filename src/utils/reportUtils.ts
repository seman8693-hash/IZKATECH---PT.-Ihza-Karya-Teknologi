/**
 * Utilitas Laporan & Analitik Portal Admin IZKATECH.
 *
 * Semua fungsi di sini MURNI (pure) dan tidak menyentuh DOM kecuali
 * `downloadCsv`, sehingga aman diuji di Node melalui tests/smoke.test.ts.
 */
import { AdminInquiry, AdminProject } from '../types/admin.ts';

// -------------------------------------------------------------
// Filter periode laporan
// -------------------------------------------------------------
export type ReportRangeKey = '7d' | '30d' | '90d' | 'all';

export interface ReportRangeOption {
  key: ReportRangeKey;
  label: string;
  /** Jumlah hari ke belakang; null = seluruh data */
  days: number | null;
}

export const REPORT_RANGES: ReportRangeOption[] = [
  { key: '7d', label: '7 Hari', days: 7 },
  { key: '30d', label: '30 Hari', days: 30 },
  { key: '90d', label: '90 Hari', days: 90 },
  { key: 'all', label: 'Semua Waktu', days: null },
];

// -------------------------------------------------------------
// Parser tanggal
// -------------------------------------------------------------
/**
 * Membaca stempel waktu prospek `'YYYY-MM-DD HH:mm'` menjadi Date lokal.
 * Sengaja tidak memakai `new Date(string)` karena format tersebut tidak
 * dijamin lintas browser. Mengembalikan null bila tidak dapat dibaca.
 */
export const parseTimestamp = (value?: string): Date | null => {
  if (!value) return null;
  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const parsed = new Date(year, month - 1, day);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/** Kunci bulan `'YYYY-MM'` dari stempel waktu; null bila tidak terbaca. */
export const monthKeyOf = (value?: string): string | null => {
  const parsed = parseTimestamp(value);
  if (!parsed) return null;
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}`;
};

/**
 * Menyaring daftar berdasarkan periode. Item yang stempel waktunya tidak
 * terbaca hanya disertakan pada mode `all` (tidak dapat ditempatkan di periode).
 */
export const filterByRange = <T>(
  items: T[],
  getTimestamp: (item: T) => string | undefined,
  key: ReportRangeKey,
  now: Date = new Date()
): T[] => {
  const option = REPORT_RANGES.find((range) => range.key === key);
  if (!option || option.days === null) return items;
  const cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate() - option.days);
  return items.filter((item) => {
    const parsed = parseTimestamp(getTimestamp(item));
    return parsed !== null && parsed.getTime() >= cutoff.getTime();
  });
};

// -------------------------------------------------------------
// Agregasi dasar
// -------------------------------------------------------------
export interface CountEntry {
  key: string;
  count: number;
}

/** Menghitung kemunculan tiap kunci, terurut dari yang terbanyak. */
export const countBy = <T>(
  items: T[],
  getKey: (item: T) => string | null | undefined
): CountEntry[] => {
  const tally = new Map<string, number>();
  items.forEach((item) => {
    const key = getKey(item);
    if (!key) return;
    tally.set(key, (tally.get(key) || 0) + 1);
  });
  return Array.from(tally, ([key, count]) => ({ key, count })).sort(
    (a, b) => b.count - a.count || a.key.localeCompare(b.key)
  );
};

/** Persentase aman (0 bila pembagi nol), dibulatkan 1 desimal. */
export const percent = (part: number, total: number): number => {
  if (!total) return 0;
  return Math.round((part / total) * 1000) / 10;
};

// -------------------------------------------------------------
// Metrik prospek
// -------------------------------------------------------------
export const INQUIRY_STATUS_ORDER: AdminInquiry['status'][] = [
  'new',
  'contacted',
  'survey',
  'deal',
  'archived',
];

export const INQUIRY_STATUS_META: Record<AdminInquiry['status'], { label: string }> = {
  new: { label: 'Baru' },
  contacted: { label: 'Follow-up' },
  survey: { label: 'Survei / Negosiasi' },
  deal: { label: 'Deal / SPK' },
  archived: { label: 'Arsip' },
};

export interface FunnelStage {
  status: AdminInquiry['status'];
  label: string;
  count: number;
  percent: number;
}

/** Corong pipeline prospek per status, mengikuti urutan resmi proses sales. */
export const buildFunnel = (inquiries: AdminInquiry[]): FunnelStage[] => {
  const total = inquiries.length;
  return INQUIRY_STATUS_ORDER.map((status) => {
    const count = inquiries.filter((item) => item.status === status).length;
    return {
      status,
      label: INQUIRY_STATUS_META[status].label,
      count,
      percent: percent(count, total),
    };
  });
};

export interface ConversionSummary {
  total: number;
  deal: number;
  /** Prospek yang sudah ditindaklanjuti (bukan status 'new') */
  responded: number;
  /** Deal dibanding seluruh prospek (persen) */
  conversionRate: number;
  /** Sudah ditindaklanjuti dibanding seluruh prospek (persen) */
  responseRate: number;
}

export const summarizeConversion = (inquiries: AdminInquiry[]): ConversionSummary => {
  const total = inquiries.length;
  const deal = inquiries.filter((item) => item.status === 'deal').length;
  const responded = inquiries.filter((item) => item.status !== 'new').length;
  return {
    total,
    deal,
    responded,
    conversionRate: percent(deal, total),
    responseRate: percent(responded, total),
  };
};

/** Permintaan layanan: menghitung setiap entri pada `serviceInterest[]`. */
export const buildServiceDemand = (inquiries: AdminInquiry[]): CountEntry[] => {
  const requested: string[] = [];
  inquiries.forEach((item) => {
    (item.serviceInterest || []).forEach((service) => {
      if (service) requested.push(service);
    });
  });
  return countBy(requested, (service) => service);
};

export interface MonthlyTrendPoint {
  key: string;
  label: string;
  inquiries: number;
}

/**
 * Tren jumlah prospek beberapa bulan terakhir (termasuk bulan berjalan),
 * dihitung dari stempel waktu prospek.
 */
export const buildMonthlyTrend = (
  inquiries: AdminInquiry[],
  months = 6,
  now: Date = new Date()
): MonthlyTrendPoint[] => {
  const points: MonthlyTrendPoint[] = [];
  for (let offset = months - 1; offset >= 0; offset -= 1) {
    const cursor = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    points.push({
      key: `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`,
      label: `${cursor.toLocaleDateString('id-ID', { month: 'short' })} ${String(cursor.getFullYear()).slice(-2)}`,
      inquiries: 0,
    });
  }
  const byKey = new Map(points.map((point) => [point.key, point]));
  inquiries.forEach((item) => {
    const key = monthKeyOf(item.timestamp);
    const point = key ? byKey.get(key) : undefined;
    if (point) point.inquiries += 1;
  });
  return points;
};

// -------------------------------------------------------------
// Metrik portofolio
// -------------------------------------------------------------
export interface ProjectStats {
  total: number;
  completed: number;
  inProgress: number;
  tender: number;
  /** Total nilai hanya dari proyek yang nominalnya tertera (Rp ...) */
  totalValue: number;
  valuedCount: number;
  averageValue: number;
  bySector: CountEntry[];
  byStatus: CountEntry[];
  byYear: CountEntry[];
  byCategory: CountEntry[];
}

/**
 * Membaca nominal dari `valueApprox`. Hanya teks yang memuat penanda Rupiah
 * yang dihitung, sehingga label seperti 'Estimasi Tender' atau
 * 'Paket Kontrak Kampus' tidak dianggap bernilai nol.
 */
export const parseValueApprox = (value?: string): number | null => {
  if (!value || !/rp/i.test(value)) return null;
  const digits = value.replace(/[^\d]/g, '');
  if (!digits) return null;
  const parsed = Number(digits);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export const buildProjectStats = (projects: AdminProject[]): ProjectStats => {
  const values = projects
    .map((project) => parseValueApprox(project.valueApprox))
    .filter((value): value is number => value !== null);
  const totalValue = values.reduce((sum, value) => sum + value, 0);
  return {
    total: projects.length,
    completed: projects.filter((project) => project.status === 'completed').length,
    inProgress: projects.filter((project) => project.status === 'in_progress').length,
    tender: projects.filter((project) => project.status === 'tender').length,
    totalValue,
    valuedCount: values.length,
    averageValue: values.length ? Math.round(totalValue / values.length) : 0,
    bySector: countBy(projects, (project) => project.sector),
    byStatus: countBy(projects, (project) => project.status),
    byYear: countBy(projects, (project) => project.year),
    byCategory: countBy(projects, (project) => project.category),
  };
};

/** Daftar proyek dengan nominal terbesar lebih dulu (hanya yang ada nominalnya). */
export const rankProjectsByValue = (
  projects: AdminProject[],
  limit = 8
): { project: AdminProject; value: number }[] =>
  projects
    .map((project) => ({ project, value: parseValueApprox(project.valueApprox) }))
    .filter((entry): entry is { project: AdminProject; value: number } => entry.value !== null)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);

// -------------------------------------------------------------
// Pemformatan angka untuk tampilan laporan
// -------------------------------------------------------------
export const formatNumber = (value: number): string =>
  new Intl.NumberFormat('id-ID').format(value);

export const formatRupiah = (value: number): string =>
  `Rp ${formatNumber(Math.round(value))}`;

/** Format ringkas untuk kartu statistik, mis. 'Rp 850 jt' atau 'Rp 1,5 M'. */
export const formatCompactRupiah = (value: number): string =>
  `Rp ${new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(value)}`;

/** Tanggal cetak laporan, mis. '19 Sep 2026'. */
export const formatReportDate = (now: Date = new Date()): string =>
  now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

/** Stempel tanggal untuk nama berkas CSV: 'YYYY-MM-DD'. */
export const csvDateStamp = (now: Date = new Date()): string =>
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

// -------------------------------------------------------------
// Ekspor CSV
// -------------------------------------------------------------
/** Membungkus nilai dengan tanda kutip bila memuat koma, kutip, atau baris baru. */
export const csvEscape = (value: string | number | null | undefined): string => {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",;\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/** Menyusun isi CSV (tanpa BOM) agar dapat diuji tanpa DOM. */
export const buildCsv = (headers: string[], rows: (string | number)[][]): string =>
  [headers.map(csvEscape).join(','), ...rows.map((row) => row.map(csvEscape).join(','))].join('\n');

/**
 * Mengunduh CSV sebagai berkas. Ditambahkan BOM UTF-8 agar Excel membaca
 * karakter Indonesia dengan benar.
 */
export const downloadCsv = (
  filename: string,
  headers: string[],
  rows: (string | number)[][]
): void => {
  try {
    const blob = new Blob(['\uFEFF' + buildCsv(headers, rows)], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Gagal mengunduh CSV laporan:', error);
  }
};
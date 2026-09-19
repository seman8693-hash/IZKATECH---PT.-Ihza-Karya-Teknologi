/**
 * Smoke test IZKATECH (tanpa framework, dijalankan dengan esbuild + Node).
 *
 * Cakupan:
 *  A. Autentikasi admin     : verifyAdminCredentials
 *  B. Sesi "Ingat sesi saya": setAdminAuth / checkAdminAuth
 *  C. Live chat visitor -> CRM admin (merge profil & badge unread)
 *  D. Store prospek & katalog (saveInquiry, placeholder sektor)
 *  E. Render SSR layar login admin & halaman publik
 *  F. Laporan & analitik (reportUtils: filter periode, corong pipeline,
 *     konversi sales, statistik portofolio, ekspor CSV) + render tab Laporan
 *
 * Jalankan: npm run test
 */
import './browserEnv.ts';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import App from '../src/App.tsx';
import { AdminDashboard } from '../src/components/AdminDashboard.tsx';
import { SettingsTab } from '../src/components/dashboard/SettingsTab.tsx';
import { ReportsTab } from '../src/components/dashboard/ReportsTab.tsx';
import { AdminSidebar } from '../src/components/dashboard/AdminSidebar.tsx';
import { Logo } from '../src/components/Logo.tsx';
import { DocumentGeneratorModal } from '../src/components/DocumentGeneratorModal.tsx';
import { defaultBrandSettings, saveBrandSettings } from '../src/data/adminStore.ts';
import { AdminInquiry, AdminProject } from '../src/types/admin.ts';
import {
  SECTOR_META,
  checkAdminAuth,
  getOrCreateVisitorSession,
  getPartnerDisplayName,
  getPartnerLogo,
  getStoredChatSessions,
  getStoredInquiries,
  markChatAsRead,
  removePartnerCustomization,
  saveInquiry,
  savePartnerLogo,
  savePartnerName,
  sectorPlaceholderImage,
  sendChatMessage,
  setAdminAuth,
  verifyAdminCredentials,
} from '../src/data/adminStore.ts';
import {
  buildCsv,
  buildFunnel,
  buildMonthlyTrend,
  buildProjectStats,
  buildServiceDemand,
  filterByRange,
  formatCompactRupiah,
  formatRupiah,
  parseTimestamp,
  parseValueApprox,
  rankProjectsByValue,
  summarizeConversion,
} from '../src/utils/reportUtils.ts';

let passed = 0;
let failed = 0;

const check = (name: string, condition: boolean, detail: unknown = '') => {
  if (condition) {
    passed += 1;
    console.log(`  PASS  ${name}`);
  } else {
    failed += 1;
    console.log(`  FAIL  ${name} ${detail === '' ? '' : `-> ${JSON.stringify(detail)}`}`);
  }
};

const section = (title: string) => console.log(`\n== ${title} ==`);

// ---------------------------------------------------------------- A
section('A. Autentikasi admin');

const account = verifyAdminCredentials('admin@izkatech.co.id', 'izkatech2026');
check('kredensial valid mengembalikan profil akun', account?.email === 'admin@izkatech.co.id', account);
check('profil tidak membocorkan password', account !== null && !('password' in (account as object)));
check('email tidak case-sensitive & spasi diabaikan', !!verifyAdminCredentials('  ADMIN@IZKATech.co.id ', 'izkatech2026'));
check('kata sandi salah ditolak', verifyAdminCredentials('admin@izkatech.co.id', 'salah-sekali') === null);
check('email tidak terdaftar ditolak', verifyAdminCredentials('orang@luar.com', 'izkatech2026') === null);
check('akun engineer kedua valid + role benar', verifyAdminCredentials('iingzaenal@gmail.com', 'izkatech2026')?.role === 'Solution Architect');

// ---------------------------------------------------------------- B
section('B. Sesi "Ingat sesi saya"');

setAdminAuth(true, true);
check(
  'remember = true -> sesi aktif di localStorage saja',
  checkAdminAuth() && localStorage.getItem('izkatech_admin_session') !== null && sessionStorage.getItem('izkatech_admin_session') === null
);

setAdminAuth(false);
check('logout membersihkan sesi', !checkAdminAuth() && localStorage.getItem('izkatech_admin_session') === null);

setAdminAuth(true, false);
check(
  'remember = false -> sesi hanya di sessionStorage',
  checkAdminAuth() && sessionStorage.getItem('izkatech_admin_session') !== null && localStorage.getItem('izkatech_admin_session') === null
);

setAdminAuth(false, false);
check('logout membersihkan kedua storage', !checkAdminAuth() && sessionStorage.getItem('izkatech_admin_session') === null);

// ---------------------------------------------------------------- C
section('C. Live chat visitor ke CRM admin');

const firstSession = getOrCreateVisitorSession();
check('sesi visitor baru memakai nama default', firstSession.visitorName === 'Tamu Pengunjung', firstSession.visitorName);

const identified = getOrCreateVisitorSession({
  name: 'Budi Santoso',
  phone: '0812-1111-2222',
  company: 'PT Sumber Makmur',
  service: 'Data Center & Network Infrastructure',
});
check(
  'profil dari form pra-chat tersimpan ke sesi',
  identified.visitorName === 'Budi Santoso' && identified.visitorCompany === 'PT Sumber Makmur' && identified.visitorPhone === '0812-1111-2222',
  { name: identified.visitorName, company: identified.visitorCompany }
);
check('sesi visitor tidak terduplikasi', getStoredChatSessions().filter((s) => s.id === identified.id).length === 1);

const unreadBefore = getStoredChatSessions().find((s) => s.id === identified.id)?.unreadCountAdmin ?? -1;
sendChatMessage(identified.id, 'Halo, saya ingin tanya paket CCTV 32 channel', 'visitor', 'Budi Santoso');
const unreadAfter = getStoredChatSessions().find((s) => s.id === identified.id)?.unreadCountAdmin ?? -1;
check('pesan visitor menambah badge unread admin', unreadAfter === unreadBefore + 1, { unreadBefore, unreadAfter });

sendChatMessage(identified.id, 'Baik Pak Budi, tim engineer kami siapkan penawarannya.', 'admin', 'Eng. Dimas (IZKATECH Support)');
const visitorUnread = getStoredChatSessions().find((s) => s.id === identified.id)?.unreadCountVisitor ?? -1;
check('balasan admin menambah badge unread visitor (Navbar)', visitorUnread === 1, visitorUnread);

markChatAsRead(identified.id, 'visitor');
check('membuka widget menandai pesan terbaca', getStoredChatSessions().find((s) => s.id === identified.id)?.unreadCountVisitor === 0);

// ---------------------------------------------------------------- D
section('D. Store prospek & katalog');

const inquiriesBefore = getStoredInquiries().length;
const created = saveInquiry({
  clientName: 'Test Runner',
  companyName: 'PT Uji Otomatis',
  phone: '0800-000-000',
  email: 'qa@izkatech.co.id',
  serviceInterest: ['Surveillance (CCTV Systems)'],
  notes: 'Data uji otomatis, aman dihapus.',
  source: 'kontak',
});
check('saveInquiry menambah prospek baru', getStoredInquiries().length === inquiriesBefore + 1, getStoredInquiries().length);
check('prospek baru mendapat id & status default', created.id.startsWith('INQ-') && created.status === 'new', created.id);
check('placeholder sektor berupa data URL SVG', sectorPlaceholderImage('government', 'Pemerintahan').startsWith('data:image/svg+xml'));
check('SECTOR_META memuat 6 sektor katalog', Object.keys(SECTOR_META).length === 6, Object.keys(SECTOR_META));

// ---------------------------------------------------------------- E
section('E. Render SSR');

const loginHtml = renderToStaticMarkup(React.createElement(AdminDashboard, { onBackToWebsite: () => undefined }));
check('layar login memuat tombol "Masuk ke Dashboard"', loginHtml.includes('Masuk ke Dashboard'));
check('layar login memuat field Email & Kata Sandi', loginHtml.includes('nama@izkatech.co.id') && loginHtml.includes('Kata Sandi'));
check('layar login memuat "Ingat sesi saya" & "Lupa sandi?"', loginHtml.includes('Ingat sesi saya') && loginHtml.includes('Lupa sandi?'));
check('layar login memuat badge "Masuk Admin"', loginHtml.includes('Masuk Admin'));
check('label "2FA Supported" sudah tidak ada', !loginHtml.includes('2FA Supported'));

const appHtml = renderToStaticMarkup(React.createElement(App));
check('halaman publik ter-render (konten besar)', appHtml.length > 5000, appHtml.length);
check('tombol Live Chat ada di navbar', appHtml.includes('Live Chat'));
check('konten utama website ter-render', appHtml.includes('IZKATECH') && appHtml.includes('WhatsApp'));

const settingsHtml = renderToStaticMarkup(React.createElement(SettingsTab));
check(
  'halaman Pengaturan Logo & Identitas Brand ter-render lengkap',
  settingsHtml.includes('Pengaturan Logo &amp; Identitas Brand') &&
    settingsHtml.includes('Logo Utama (Horizontal Landscape)') &&
    settingsHtml.includes('Icon &amp; Favicon') &&
    settingsHtml.includes('Versi Monokrom (Stempel)') &&
    settingsHtml.includes('Palet Warna Brand Resmi') &&
    settingsHtml.includes('Legalitas &amp; Tagline Entitas') &&
    settingsHtml.includes('Pengaturan Kop Surat &amp; Watermark') &&
    settingsHtml.includes('Default Header Dokumen'),
  { len: settingsHtml.length }
);
check(
  'opsi kop surat & watermark tersedia di pengaturan',
  settingsHtml.includes('Logo Header SPK/Invoice') && settingsHtml.includes('Opacity Watermark')
);

// Identitas brand (wordmark) mengikuti Pengaturan Logo & Identitas Brand
const customBrand = defaultBrandSettings();
customBrand.legal.brandName = 'TESTBRAND';
customBrand.legal.subBrand1 = 'Sub Uji Satu';
customBrand.legal.subBrand2 = 'Sub Uji Dua';
saveBrandSettings(customBrand);
const logoHtml = renderToStaticMarkup(React.createElement(Logo));
check(
  'wordmark komponen Logo mengikuti Pengaturan Brand',
  logoHtml.includes('TESTBRAND') && logoHtml.includes('Sub Uji Dua'),
  logoHtml.slice(0, 120)
);
const loginBrandHtml = renderToStaticMarkup(React.createElement(AdminDashboard, { onBackToWebsite: () => undefined }));
check('layar login menampilkan brand kustom', loginBrandHtml.includes('TESTBRAND') && loginBrandHtml.includes('Sub Uji Dua'));

saveBrandSettings(defaultBrandSettings());
const logoResetHtml = renderToStaticMarkup(React.createElement(Logo));
check('wordmark kembali ke default setelah reset', logoResetHtml.includes('IZKATECH'));

// Kustomisasi Logo & Nama Partner
savePartnerName('Hikvision', 'Hikvision Security Global');
savePartnerLogo('Hikvision', 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=');
check('nama partner kustom tersimpan & terbaca', getPartnerDisplayName('Hikvision') === 'Hikvision Security Global');
check('logo partner kustom tersimpan & terbaca', getPartnerLogo('Hikvision') === 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=');

removePartnerCustomization('Hikvision');
check('reset partner mengembalikan nama ke bawaan', getPartnerDisplayName('Hikvision') === 'Hikvision');
check('reset partner menghapus logo kustom', getPartnerLogo('Hikvision') === null);

// Invoice: PPN & PPh 23 + TOTAL TAGIHAN
const taxInquiry: AdminInquiry = {
  id: 'INQ-TEST-TAX',
  timestamp: '2026-09-19 10:00',
  clientName: 'Bpk. Uji Pajak',
  companyName: 'PT Uji Pajak Jaya',
  phone: '0812-0000-0000',
  email: 'uji@pajak.co.id',
  serviceInterest: ['Surveillance (CCTV Systems)'],
  notes: 'Uji render pajak.',
  source: 'kontak',
  status: 'deal',
  priority: 'normal',
};
const invoiceHtml = renderToStaticMarkup(
  React.createElement(DocumentGeneratorModal, { inquiry: taxInquiry, docType: 'INVOICE', onClose: () => undefined })
);
check(
  'invoice memuat PPN 11%, PPh 23 (2%) & TOTAL TAGIHAN',
  invoiceHtml.includes('PPN 11%') && invoiceHtml.includes('PPh 23 (2%)') && invoiceHtml.includes('TOTAL TAGIHAN')
);
check('invoice menampilkan label DPP (SUBTOTAL)', invoiceHtml.includes('DPP (SUBTOTAL)'));

// ---------------------------------------------------------------- F
section('F. Laporan & analitik');

// Fixture prospek dengan periode, layanan & sumber berbeda
const reportInquiries: AdminInquiry[] = [
  {
    id: 'INQ-REP-1',
    timestamp: '2026-09-18 09:00',
    clientName: 'Bpk. Laporan Satu',
    companyName: 'PT Laporan Satu',
    phone: '0800-000-001',
    email: 'satu@laporan.co.id',
    serviceInterest: ['Surveillance (CCTV Systems)', 'Access Control & Smart Card'],
    notes: 'Catatan uji, memuat koma & "kutip".',
    source: 'kalkulator',
    status: 'deal',
    priority: 'high',
  },
  {
    id: 'INQ-REP-2',
    timestamp: '2026-09-10 10:00',
    clientName: 'Ibu Laporan Dua',
    companyName: 'PT Laporan Dua',
    phone: '0800-000-002',
    email: 'dua@laporan.co.id',
    serviceInterest: ['Surveillance (CCTV Systems)'],
    notes: 'Prospek baru untuk uji corong.',
    source: 'kontak',
    status: 'new',
    priority: 'medium',
  },
  {
    id: 'INQ-REP-3',
    timestamp: '2026-08-01 11:00',
    clientName: 'Bpk. Laporan Tiga',
    companyName: 'Dinas Laporan',
    phone: '0800-000-003',
    email: 'tiga@laporan.go.id',
    serviceInterest: ['Fire Alarm System MCFA'],
    notes: 'Prospek lama di luar periode 30 hari.',
    source: 'rfp',
    status: 'survey',
    priority: 'normal',
  },
];

// Titik acuan waktu tetap agar pengujian periode bersifat deterministik
const reportNow = new Date(2026, 8, 19);

check(
  'parseTimestamp membaca format tanggal prospek',
  (() => {
    const parsed = parseTimestamp('2026-09-15 14:32');
    return parsed !== null && parsed.getFullYear() === 2026 && parsed.getMonth() === 8 && parsed.getDate() === 15;
  })()
);
check(
  'parseTimestamp menolak teks/kosong/bulan tidak valid',
  parseTimestamp('tidak ada') === null && parseTimestamp(undefined) === null && parseTimestamp('2026-13-40') === null
);

const filtered30 = filterByRange(reportInquiries, (item) => item.timestamp, '30d', reportNow);
check('filter periode 30 hari menyaring prospek lama', filtered30.length === 2, filtered30.map((i) => i.id));
check(
  'filter periode 7 hari hanya menyisakan prospek terbaru',
  filterByRange(reportInquiries, (item) => item.timestamp, '7d', reportNow).length === 1
);
check(
  'filter periode "all" mengembalikan seluruh prospek',
  filterByRange(reportInquiries, (item) => item.timestamp, 'all', reportNow).length === 3
);

check(
  'parseValueApprox membaca nominal Rupiah',
  parseValueApprox('Rp 850.000.000') === 850000000 &&
    parseValueApprox('Rp 1.450.000.000') === 1450000000 &&
    parseValueApprox('Rp 500.000.000+') === 500000000
);
check(
  'parseValueApprox mengabaikan paket tanpa nominal',
  parseValueApprox('Estimasi Tender') === null &&
    parseValueApprox('Paket Kontrak Kampus') === null &&
    parseValueApprox(undefined) === null
);

const reportFunnel = buildFunnel(reportInquiries);
check(
  'corong prospek memuat 5 tahap sesuai urutan status',
  reportFunnel.length === 5 && reportFunnel[0].status === 'new' && reportFunnel[4].status === 'archived',
  reportFunnel.map((stage) => stage.status)
);
check(
  'jumlah tiap tahap corong sesuai data',
  reportFunnel.find((stage) => stage.status === 'deal')?.count === 1 &&
    reportFunnel.find((stage) => stage.status === 'archived')?.count === 0
);

const reportConversion = summarizeConversion(reportInquiries);
check(
  'ringkasan konversi menghitung deal & persentase',
  reportConversion.total === 3 && reportConversion.deal === 1 && reportConversion.conversionRate === 33.3,
  reportConversion
);
check(
  'ringkasan konversi menghitung tingkat respons',
  reportConversion.responded === 2 && reportConversion.responseRate === 66.7,
  reportConversion
);

const reportDemand = buildServiceDemand(reportInquiries);
check(
  'permintaan layanan dihitung dari array serviceInterest',
  reportDemand.length === 3 && reportDemand[0].key === 'Surveillance (CCTV Systems)' && reportDemand[0].count === 2,
  reportDemand
);

const reportTrend = buildMonthlyTrend(reportInquiries, 6, reportNow);
check(
  'tren bulanan memuat 6 bulan & menghitung prospek September',
  reportTrend.length === 6 && reportTrend[5].key === '2026-09' && reportTrend[5].inquiries === 2,
  reportTrend
);
check(
  'tren bulanan menempatkan prospek Agustus pada bulan yang benar',
  reportTrend[4].key === '2026-08' && reportTrend[4].inquiries === 1,
  reportTrend[4]
);
// Statistik portofolio proyek
const reportProjects: AdminProject[] = [
  {
    id: 'PRJ-REP-1',
    title: 'Proyek Uji Besar',
    clientName: 'PT Besar',
    category: 'Surveillance (CCTV Systems)',
    year: '2025-2026',
    status: 'completed',
    valueApprox: 'Rp 1.450.000.000',
    description: 'Proyek uji bernilai besar.',
    sector: 'commercial',
  },
  {
    id: 'PRJ-REP-2',
    title: 'Proyek Uji Tender',
    clientName: 'Pemda Uji',
    category: 'Electrical & Mechanical',
    year: '2026',
    status: 'tender',
    valueApprox: 'Estimasi Tender',
    description: 'Proyek uji tanpa nominal pasti.',
    sector: 'government',
  },
  {
    id: 'PRJ-REP-3',
    title: 'Proyek Uji Kecil',
    clientName: 'PT Kecil',
    category: 'Surveillance (CCTV Systems)',
    year: '2026',
    status: 'in_progress',
    valueApprox: 'Rp 250.000.000+',
    description: 'Proyek uji sedang berjalan.',
    sector: 'commercial',
  },
];

const reportStats = buildProjectStats(reportProjects);
check(
  'statistik portofolio menghitung status proyek',
  reportStats.total === 3 && reportStats.completed === 1 && reportStats.inProgress === 1 && reportStats.tender === 1,
  { total: reportStats.total, completed: reportStats.completed, inProgress: reportStats.inProgress, tender: reportStats.tender }
);
check(
  'statistik portofolio menjumlahkan hanya proyek bernominal',
  reportStats.valuedCount === 2 && reportStats.totalValue === 1700000000,
  reportStats.totalValue
);
check('statistik portofolio menghitung rata-rata nilai', reportStats.averageValue === 850000000, reportStats.averageValue);
check(
  'sebaran sektor portofolio terurut benar',
  reportStats.bySector[0]?.key === 'commercial' && reportStats.bySector[0]?.count === 2,
  reportStats.bySector
);
check(
  'sebaran status proyek mencatat tahap tender',
  reportStats.byStatus.some((entry) => entry.key === 'tender' && entry.count === 1),
  reportStats.byStatus
);

const rankedProjects = rankProjectsByValue(reportProjects);
check(
  'peringkat proyek mengurutkan nominal terbesar lebih dulu',
  rankedProjects.length === 2 && rankedProjects[0].project.id === 'PRJ-REP-1' && rankedProjects[1].value === 250000000,
  rankedProjects.map((entry) => [entry.project.id, entry.value])
);

// Pemformatan & ekspor CSV
const csvSample = buildCsv(['A', 'B'], [['1,2', 'x"y']]);
check('buildCsv meng-escape koma & tanda kutip', csvSample === 'A,B\n"1,2","x""y"', JSON.stringify(csvSample));
check('formatRupiah memberi pemisah ribuan & prefix Rp', formatRupiah(1450000000) === 'Rp 1.450.000.000', formatRupiah(1450000000));
check('formatCompactRupiah memakai satuan ringkas', formatCompactRupiah(850000000).startsWith('Rp '), formatCompactRupiah(850000000));

// Render tab Laporan & Analitik
const reportsHtml = renderToStaticMarkup(
  React.createElement(ReportsTab, { inquiries: reportInquiries, projects: reportProjects })
);
check(
  'tab Laporan ter-render beserta seluruh panel analitik',
  reportsHtml.includes('Laporan &amp; Analitik') &&
    reportsHtml.includes('Corong Pipeline Prospek') &&
    reportsHtml.includes('Sumber Prospek') &&
    reportsHtml.includes('Permintaan Layanan Terbanyak') &&
    reportsHtml.includes('Tren Prospek 6 Bulan Terakhir') &&
    reportsHtml.includes('Statistik Portofolio Proyek') &&
    reportsHtml.includes('Nilai Proyek Tertinggi'),
  { len: reportsHtml.length }
);
check(
  'filter periode & tombol ekspor tersedia di tab Laporan',
  reportsHtml.includes('Semua Waktu') &&
    reportsHtml.includes('30 Hari') &&
    reportsHtml.includes('Ringkasan CSV') &&
    reportsHtml.includes('Cetak Laporan')
);
check(
  'metrik konversi & nilai proyek tampil di tab Laporan',
  reportsHtml.includes('33.3%') && reportsHtml.includes('Rp 1.450.000.000')
);

// Menu sidebar admin
const sidebarHtml = renderToStaticMarkup(
  React.createElement(AdminSidebar, {
    currentTab: 'reports',
    onTabChange: () => undefined,
    counts: {
      inquiries: reportInquiries.length,
      newInquiries: 1,
      projects: reportProjects.length,
      chats: 0,
      unreadChats: 0,
    },
    onLogout: () => undefined,
    onBackToWebsite: () => undefined,
  })
);
check('sidebar admin memuat menu "Laporan & Analitik"', sidebarHtml.includes('Laporan &amp; Analitik'));
check(
  'menu sidebar lama tetap tersedia',
  sidebarHtml.includes('Prospek &amp; SPH/PKS') && sidebarHtml.includes('Pengaturan')
);

// ---------------------------------------------------------------- ringkasan
console.log('\n---------------------------------------------');
console.log(`TOTAL: ${passed + failed}  PASS: ${passed}  FAIL: ${failed}`);
console.log('---------------------------------------------\n');

process.exitCode = failed === 0 ? 0 : 1;

/**
 * Smoke test IZKATECH (tanpa framework, dijalankan dengan esbuild + Node).
 *
 * Cakupan:
 *  A. Autentikasi admin     : verifyAdminCredentials
 *  B. Sesi "Ingat sesi saya": setAdminAuth / checkAdminAuth
 *  C. Live chat visitor -> CRM admin (merge profil & badge unread)
 *  D. Store prospek & katalog (saveInquiry, placeholder sektor)
 *  E. Render SSR layar login admin & halaman publik
 *
 * Jalankan: npm run test
 */
import './browserEnv.ts';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import App from '../src/App.tsx';
import { AdminDashboard } from '../src/components/AdminDashboard.tsx';
import {
  SECTOR_META,
  checkAdminAuth,
  getOrCreateVisitorSession,
  getStoredChatSessions,
  getStoredInquiries,
  markChatAsRead,
  saveInquiry,
  sectorPlaceholderImage,
  sendChatMessage,
  setAdminAuth,
  verifyAdminCredentials,
} from '../src/data/adminStore.ts';

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

// ---------------------------------------------------------------- ringkasan
console.log('\n---------------------------------------------');
console.log(`TOTAL: ${passed + failed}  PASS: ${passed}  FAIL: ${failed}`);
console.log('---------------------------------------------\n');

process.exitCode = failed === 0 ? 0 : 1;

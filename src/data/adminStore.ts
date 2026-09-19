import { AdminInquiry, AdminProject, ChatSession, ChatMessage } from '../types/admin.ts';

const INQUIRIES_STORAGE_KEY = 'izkatech_admin_inquiries';
const PROJECTS_STORAGE_KEY = 'izkatech_admin_projects';
const AUTH_STORAGE_KEY = 'izkatech_admin_session';
const CHAT_SESSIONS_STORAGE_KEY = 'izkatech_chat_sessions';
const CURRENT_VISITOR_SESSION_KEY = 'izkatech_current_visitor_session_id';

const INITIAL_INQUIRIES: AdminInquiry[] = [
  {
    id: 'INQ-2026-001',
    timestamp: '2026-09-15 14:32',
    clientName: 'Bpk. Hendra Gunawan',
    companyName: 'PT. Surya Nusantara Logistik',
    phone: '0812-9844-1120',
    email: 'hendra.g@suryanusantara.co.id',
    serviceInterest: ['Data Center & Network Infrastructure', 'Surveillance (CCTV Systems)', 'Access Control & Smart Card'],
    scale: 'Skala Menengah (Gedung 2-5 Lantai / 20-100 Titik)',
    budgetEstimate: 'Estimasi Proyek Menengah',
    notes: 'Kebutuhan upgrade CCTV Hikvision IP 4K sebanyak 48 titik dan server room rack mount baru di kawasan pergudangan Cimahi.',
    source: 'kalkulator',
    status: 'new',
    priority: 'high',
  },
  {
    id: 'INQ-2026-002',
    timestamp: '2026-09-14 10:15',
    clientName: 'Ibu Ratna Dewi',
    companyName: 'RS. Sejahtera Medika',
    phone: '0813-7721-0091',
    email: 'procurement@rssejahtera.com',
    serviceInterest: ['Telecommunication & PABX', 'Fire Alarm System MCFA', 'Public Address & TOA'],
    scale: 'Gedung Rumah Sakit 4 Lantai',
    budgetEstimate: 'Estimasi Tender',
    notes: 'Penggantian sistem PABX IP Panasonic 64 extension dan instalasi emergency paging TOA di ruang rawat inap.',
    source: 'rfp',
    status: 'survey',
    priority: 'high',
  },
  {
    id: 'INQ-2026-003',
    timestamp: '2026-09-12 16:40',
    clientName: 'Bpk. Arif Wicaksono',
    companyName: 'Bank Mandiri Taspen Kantor Cabang',
    phone: '0811-230-908',
    email: 'arif.w@banktaspen.co.id',
    serviceInterest: ['Access Control & Smart Card', 'Network Security & Firewall'],
    scale: 'Skala Kecil (1 Gedung / <20 Titik)',
    budgetEstimate: 'Paket Office Secure',
    notes: 'Pemasangan sistem biometrik sidik jari & kartu RFID Suprema di pintu khazanah dan ruang arsip dokumen.',
    source: 'kontak',
    status: 'deal',
    priority: 'medium',
  },
  {
    id: 'INQ-2026-004',
    timestamp: '2026-09-10 09:20',
    clientName: 'Bpk. Dedi Supriyadi',
    companyName: 'Dinas Komunikasi & Informatika',
    phone: '0815-6672-881',
    email: 'diskominfo_bidangtik@pemda.go.id',
    serviceInterest: ['Data Center & Network Infrastructure', 'Network Security & Firewall'],
    scale: 'Skala Besar / Kawasan Industri (>100 Titik)',
    budgetEstimate: 'Tender Pengadaan APBD',
    notes: 'Penyusunan RAB fiber optic backbone 10Gbps dan instalasi firewall Fortinet FortiGate cluster.',
    source: 'rfp',
    status: 'contacted',
    priority: 'high',
  },
];

// -------------------------------------------------------------
// PORTFOLIO CATALOG HELPERS (sector palette & placeholder image)
// -------------------------------------------------------------
export const SECTOR_META: Record<string, { label: string; grad: [string, string] }> = {
  commercial: { label: 'Perkantoran & Finansial', grad: ['#0369a1', '#38bdf8'] },
  education: { label: 'Pendidikan & Kampus', grad: ['#6d28d9', '#a78bfa'] },
  infrastructure: { label: 'Infrastruktur & Transportasi', grad: ['#047857', '#34d399'] },
  hospitality: { label: 'Perhotelan & Pariwisata', grad: ['#b45309', '#fbbf24'] },
  government: { label: 'Pemerintahan', grad: ['#b91c1c', '#f87171'] },
  healthcare: { label: 'R&D Farmasi & Medis', grad: ['#0e7490', '#67e8f9'] },
};

export const sectorPlaceholderImage = (sector?: string, label?: string): string => {
  const meta = SECTOR_META[sector || 'commercial'] || SECTOR_META.commercial;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='${meta.grad[0]}'/><stop offset='1' stop-color='${meta.grad[1]}'/>
    </linearGradient></defs>
    <rect width='640' height='360' fill='url(#g)'/>
    <g fill='rgba(255,255,255,0.88)'>
      <rect x='72' y='170' width='86' height='120' rx='5'/>
      <rect x='176' y='128' width='104' height='162' rx='5'/>
      <rect x='298' y='84' width='126' height='206' rx='5'/>
      <rect x='442' y='140' width='96' height='150' rx='5'/>
    </g>
    <text x='320' y='326' text-anchor='middle' font-family='Arial, Helvetica, sans-serif' font-size='21' font-weight='bold' fill='rgba(255,255,255,0.96)'>${label || 'PROYEK IZKATECH'}</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
};

const normalizeProject = (p: AdminProject): AdminProject => ({
  ...p,
  image: p.image || sectorPlaceholderImage(p.sector, p.sectorLabel),
  location: p.location || 'Indonesia',
  city: p.city || 'Nasional',
  sector: p.sector || 'commercial',
  sectorLabel: p.sectorLabel || p.category,
  details: p.details || p.description,
  highlights: p.highlights || [],
});

const INITIAL_PROJECTS: AdminProject[] = [
  {
    id: 'PRJ-01',
    title: 'Peremajaan Data Center & Fiber Optic 10Gbps',
    clientName: 'PT. Telekomunikasi Seluler / Telkomsel',
    category: 'Data Center & Network Infrastructure',
    year: '2025-2026',
    status: 'completed',
    valueApprox: 'Rp 850.000.000',
    description: 'Pemasangan cabling Cat6A LSZH, server rack 42U, Precision Cooling AC, dan patch panel fiber optik LC duplex.',
    location: 'Bandung, Jawa Barat',
    city: 'Bandung',
    sector: 'commercial',
    sectorLabel: 'Data Center Enterprise',
    details: 'Modernisasi menyeluruh fasilitas data center perusahaan telekomunikasi: perancangan layout ruang server, pemasangan cabling struktur Cat6A LSZH dan backbone fiber optic 10Gbps, instalasi server rack 42U dengan manajemen kabel, sistem Precision Cooling untuk stabilitas termal, serta pengujian komprehensif (test & commissioning) sebelum serah terima.',
    highlights: [
      'Backbone fiber optic 10Gbps full redundancy',
      'Server rack 42U dengan manajemen kabel vertikal',
      'Precision Cooling AC ruang server',
      'Test & commissioning dengan laporan serah terima',
    ],
  },
  {
    id: 'PRJ-02',
    title: 'Sistem Pengawasan CCTV Hikvision AI & Face Recognition',
    clientName: 'Bandara Internasional Kertajati (BIJB)',
    category: 'Surveillance (CCTV Systems)',
    year: '2025',
    status: 'completed',
    valueApprox: 'Rp 1.450.000.000',
    description: 'Instalasi 120+ unit kamera IP dome & PTZ zoom 32x terpusat di Video Wall Control Room Bandara.',
    location: 'Kertajati, Jawa Barat',
    city: 'Majalengka',
    sector: 'infrastructure',
    sectorLabel: 'Bandara & Transportasi',
    details: 'Implementasi sistem pengawasan area landside & airside Bandara Internasional Kertajati dengan 120+ unit kamera IP Hikvision (dome, bullet, dan PTZ zoom 32x) berbasis AI — face recognition, ANPR di gerbang kendaraan, serta integrasi video wall 3x3 di control room untuk monitoring real-time 24/7.',
    highlights: [
      '120+ kamera IP AI (dome, bullet, PTZ 32x)',
      'Face recognition & ANPR terintegrasi',
      'Video wall 3x3 di control room',
      'Storage NVR redundan 30 hari rekaman',
    ],
  },
  {
    id: 'PRJ-03',
    title: 'Modernisasi Network Security Firewall Fortinet High-Availability',
    clientName: 'Bank Perkreditan Rakyat (BPR) Se-Jawa Barat',
    category: 'Network Security & Firewall',
    year: '2026',
    status: 'in_progress',
    valueApprox: 'Rp 620.000.000',
    description: 'Penerapan SD-WAN terenkripsi, IPS/IDS protection, dan VPN secure gateway untuk 18 kantor cabang.',
    location: 'Jawa Barat',
    city: 'Nasional',
    sector: 'commercial',
    sectorLabel: 'Perbankan & Finansial',
    details: 'Penerapan arsitektur keamanan jaringan high-availability untuk 18 kantor cabang BPR: cluster firewall FortiGate mode HA aktif-pasif, SD-WAN terenkripsi antar cabang, IPS/IDS protection, segmentasi VLAN per departemen, serta VPN secure gateway untuk akses remote karyawan.',
    highlights: [
      'Cluster FortiGate HA aktif-pasif',
      'SD-WAN terenkripsi 18 kantor cabang',
      'IPS/IDS + segmentasi VLAN internal',
      'VPN secure gateway untuk akses remote',
    ],
  },
  {
    id: 'PRJ-04',
    title: 'Akses Pintu RFID HID Global & Speed Gate Turnstile',
    clientName: 'Gedung Perkantoran Menara Asia Bandung',
    category: 'Access Control & Smart Card',
    year: '2026',
    status: 'in_progress',
    valueApprox: 'Rp 390.000.000',
    description: 'Integrasi flap barrier gate dengan pembaca kartu RFID dan software monitoring absensi real-time.',
    location: 'Bandung, Jawa Barat',
    city: 'Bandung',
    sector: 'commercial',
    sectorLabel: 'Gedung Perkantoran',
    details: 'Sistem akses kontrol lobi utama Menara Asia: speed gate turnstile flap barrier dua arah, pembaca kartu RFID HID Global multi-format, integrasi dengan software manajemen absensi & visitor management real-time, serta proteksi anti-tailgating dan fail-safe saat emergency.',
    highlights: [
      'Speed gate turnstile flap barrier dua arah',
      'Pembaca RFID HID Global multi-format',
      'Visitor management & absensi real-time',
      'Fail-safe release saat emergency',
    ],
  },
  {
    id: 'PRJ-05',
    title: 'R&D Center PT. Mensa Mitra Medika',
    clientName: 'PT. Mensa Mitra Medika',
    category: 'Data Center & Network Infrastructure',
    year: '2026',
    status: 'in_progress',
    valueApprox: 'Estimasi Tender',
    description: 'Pembangunan infrastruktur jaringan data, sistem keamanan terintegrasi, dan utilitas instalasi kelistrikan ruang laboratorium R&D.',
    location: 'Indonesia',
    city: 'Nasional',
    sector: 'healthcare',
    sectorLabel: 'R&D & Farmasi',
    details: 'Pembangunan infrastruktur jaringan data laboratorium riset & pengembangan farmasi: struktur cabling data, sistem keamanan terintegrasi (CCTV & access control area terbatas), serta utilitas instalasi kelistrikan dan grounding khusus peralatan laboratorium presisi.',
    highlights: [
      'Struktur cabling data laboratorium',
      'Access control area terbatas & CCTV',
      'Grounding khusus peralatan presisi',
    ],
  },
  {
    id: 'PRJ-06',
    title: 'Beltway Office Tower',
    clientName: 'Pengelola Beltway Office Tower',
    category: 'Surveillance (CCTV Systems)',
    year: '2025',
    status: 'completed',
    valueApprox: 'Rp 500.000.000+',
    description: 'Instalasi jaringan backbone komunikasi, pengawasan CCTV terpusat, dan sistem akses kontrol pintu perkantoran premium.',
    location: 'Jakarta',
    city: 'Jakarta Selatan',
    sector: 'commercial',
    sectorLabel: 'Gedung Perkantoran',
    details: 'Pekerjaan infrastruktur teknologi gedung perkantoran premium 20 lantai: backbone jaringan komunikasi antar lantai, sistem pengawasan CCTV terpusat di ruang security, akses kontrol pintu area premium, serta integrasi sistem ke building management.',
    highlights: [
      'Backbone jaringan 20 lantai',
      'CCTV terpusat ruang security',
      'Akses kontrol area premium',
    ],
  },
  {
    id: 'PRJ-07',
    title: 'Kantor Kejaksaan Musirawas',
    clientName: 'Kejaksaan Negeri Musirawas',
    category: 'Network Security & Firewall',
    year: '2024',
    status: 'completed',
    valueApprox: 'Paket Pengadaan Instansi',
    description: 'Implementasi sistem keamanan surveillance, jaringan komputer terintegrasi, dan perangkat telekomunikasi kantor dinas.',
    location: 'Musirawas, Sumatera Selatan',
    city: 'Palembang',
    sector: 'government',
    sectorLabel: 'Instansi Pemerintah',
    details: 'Implementasi kebutuhan TIK kantor kejaksaan: jaringan komputer terintegrasi antar ruang kerja, sistem surveillance area kantor & halaman parkir, serta perangkat telekomunikasi (PABX) yang mendukung operasional pelayanan publik.',
    highlights: [
      'Jaringan LAN terintegrasi ruang kerja',
      'Surveillance area kantor & parkir',
      'PABX telekomunikasi kantor dinas',
    ],
  },
  {
    id: 'PRJ-08',
    title: 'Universitas Negeri Surabaya (UNESA)',
    clientName: 'Universitas Negeri Surabaya',
    category: 'Data Center & Network Infrastructure',
    year: '2024',
    status: 'completed',
    valueApprox: 'Paket Kontrak Kampus',
    description: 'Pembangunan infrastruktur jaringan kampus, fiber optic backbone, dan sistem proteksi keamanan jaringan.',
    location: 'Surabaya, Jawa Timur',
    city: 'Surabaya',
    sector: 'education',
    sectorLabel: 'Perguruan Tinggi',
    details: 'Pembangunan infrastruktur jaringan antar gedung kampus: fiber optic backbone antar fakultas, distribusi access switch per lantai, sistem proteksi keamanan jaringan, serta wi-fi coverage area akademik untuk mendukung sistem informasi akademik terpusat.',
    highlights: [
      'Fiber optic backbone antar fakultas',
      'Access switch per lantai gedung',
      'Wi-fi coverage area akademik',
    ],
  },
  {
    id: 'PRJ-09',
    title: 'Derma Aesthetic Tower - Summarecon',
    clientName: 'Summarecon / Derma Aesthetic',
    category: 'Surveillance (CCTV Systems)',
    year: '2024',
    status: 'completed',
    valueApprox: 'Rp 250.000.000+',
    description: 'Sistem pengawasan CCTV, access control smart card, tata suara sound system, dan instalasi kelistrikan pendukung.',
    location: 'Bekasi, Jawa Barat',
    city: 'Bekasi',
    sector: 'commercial',
    sectorLabel: 'Komersial & Klinik',
    details: 'Pekerjaan sistem teknologi gedung komersial-campuran: CCTV pengawasan area publik & klinik, access control smart card untuk ruang terbatas, tata suara (sound system) lobi dan koridor, serta instalasi kelistrikan pendukung sistem.',
    highlights: [
      'CCTV area publik & klinik',
      'Access control ruang terbatas',
      'Sound system lobi & koridor',
    ],
  },
  {
    id: 'PRJ-10',
    title: 'Gallery Art - Summarecon',
    clientName: 'Summarecon',
    category: 'Public Address & TOA',
    year: '2023',
    status: 'completed',
    valueApprox: 'Rp 150.000.000+',
    description: 'Pengadaan dan instalasi sistem tata suara (sound system), pencahayaan cerdas, dan surveillance keamanan galeri.',
    location: 'Bandung, Jawa Barat',
    city: 'Bandung',
    sector: 'hospitality',
    sectorLabel: 'Galeri & Lifestyle',
    details: 'Pengadaan & instalasi sistem tata suara galeri seni dengan zona audio terpisah, pencahayaan cerdas (smart lighting) untuk penampilan karya, dan sistem surveillance keamanan karya seni di area pamer.',
    highlights: [
      'Sound system multi-zona galeri',
      'Smart lighting display karya',
      'Surveillance keamanan karya seni',
    ],
  },
  {
    id: 'PRJ-11',
    title: 'Proyek Jalan Tol Serang - Panimbang',
    clientName: 'BPJT Tol Serang - Panimbang',
    category: 'Surveillance (CCTV Systems)',
    year: '2023',
    status: 'completed',
    valueApprox: 'Paket Infrastruktur Tol',
    description: 'Penyediaan sistem monitoring ruas tol: CCTV per kilometer, komunkasi backbone, dan perangkat pendukung gerbang tol.',
    location: 'Serang, Banten',
    city: 'Serang',
    sector: 'infrastructure',
    sectorLabel: 'Infrastruktur & Jalan Tol',
    details: 'Pekerjaan sistem teknologi ruas jalan tol: CCTV pemantauan berkala di titik-titik strategis per ruas, backbone komunikasi data antar pos pengawasan, serta perangkat pendukung operasional gerbang tol dan rest area.',
    highlights: [
      'CCTV titik strategis per ruas',
      'Backbone komunikasi antar pos',
      'Perangkat pendukung gerbang tol',
    ],
  },
];

export const getStoredInquiries = (): AdminInquiry[] => {
  try {
    const raw = localStorage.getItem(INQUIRIES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(INITIAL_INQUIRIES));
      return INITIAL_INQUIRIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_INQUIRIES;
  }
};

export const saveInquiry = (inquiry: Omit<AdminInquiry, 'id' | 'timestamp' | 'status' | 'priority'>): AdminInquiry => {
  const current = getStoredInquiries();
  const newInquiry: AdminInquiry = {
    ...inquiry,
    id: `INQ-${new Date().getFullYear()}-${String(current.length + 1).padStart(3, '0')}`,
    timestamp: new Date().toLocaleString('id-ID', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    status: 'new',
    priority: inquiry.serviceInterest.length >= 2 ? 'high' : 'medium'
  };

  const updated = [newInquiry, ...current];
  try {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save inquiry to storage', e);
  }
  return newInquiry;
};

export const updateInquiry = (updatedInquiry: AdminInquiry) => {
  const current = getStoredInquiries();
  const updated = current.map(item => item.id === updatedInquiry.id ? updatedInquiry : item);
  try {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update inquiry', e);
  }
  return updated;
};

export const updateInquiryStatus = (id: string, status: AdminInquiry['status']) => {
  const current = getStoredInquiries();
  const updated = current.map(item => item.id === id ? { ...item, status } : item);
  try {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update status', e);
  }
  return updated;
};

export const deleteInquiry = (id: string) => {
  const current = getStoredInquiries();
  const updated = current.filter(item => item.id !== id);
  try {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete inquiry', e);
  }
  return updated;
};

export const getStoredProjects = (): AdminProject[] => {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS.map(normalizeProject);
    }
    return (JSON.parse(raw) as AdminProject[]).map(normalizeProject);
  } catch {
    return INITIAL_PROJECTS.map(normalizeProject);
  }
};

export const saveProject = (project: Omit<AdminProject, 'id'>): AdminProject => {
  const current = getStoredProjects();
  const newProject: AdminProject = {
    ...project,
    id: `PRJ-${String(current.length + 1).padStart(2, '0')}`,
  };
  const updated = [newProject, ...current];
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save project', e);
  }
  return newProject;
};

export const updateProject = (updatedProject: AdminProject): AdminProject[] => {
  const current = getStoredProjects();
  const updated = current.map(p => p.id === updatedProject.id ? updatedProject : p);
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update project', e);
  }
  return updated;
};

export const deleteProject = (id: string) => {
  const current = getStoredProjects();
  const updated = current.filter(p => p.id !== id);
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete project', e);
  }
  return updated;
};

// -------------------------------------------------------------
// ADMIN AUTHENTICATION (email + kata sandi)
// -------------------------------------------------------------
const ADMIN_SESSION_VALUE = 'authenticated_izkatech_admin';

export interface AdminAccount {
  email: string;
  name: string;
  role: string;
}

/** Akun admin internal. Ganti dengan verifikasi backend/SSO saat API tersedia. */
const ADMIN_ACCOUNTS: (AdminAccount & { password: string })[] = [
  { email: 'admin@izkatech.co.id', password: 'izkatech2026', name: 'Administrator IZKATECH', role: 'Super Admin' },
  { email: 'iingzaenal@gmail.com', password: 'izkatech2026', name: 'Eng. Iing Zaenal', role: 'Solution Architect' },
];

/** Validasi kredensial admin; mengembalikan profil akun bila cocok, null bila gagal. */
export const verifyAdminCredentials = (email: string, password: string): AdminAccount | null => {
  const normalizedEmail = email.trim().toLowerCase();
  const found = ADMIN_ACCOUNTS.find(
    (account) => account.email.toLowerCase() === normalizedEmail && account.password === password
  );
  if (!found) return null;
  return { email: found.email, name: found.name, role: found.role };
};

/** Sesi admin aktif? (localStorage = "Ingat sesi saya", sessionStorage = sesi browser saja) */
export const checkAdminAuth = (): boolean => {
  try {
    return (
      localStorage.getItem(AUTH_STORAGE_KEY) === ADMIN_SESSION_VALUE ||
      sessionStorage.getItem(AUTH_STORAGE_KEY) === ADMIN_SESSION_VALUE
    );
  } catch {
    return false;
  }
};

export const setAdminAuth = (authenticated: boolean, rememberSession = true) => {
  try {
    if (authenticated) {
      const activeStorage = rememberSession ? localStorage : sessionStorage;
      const otherStorage = rememberSession ? sessionStorage : localStorage;
      otherStorage.removeItem(AUTH_STORAGE_KEY);
      activeStorage.setItem(AUTH_STORAGE_KEY, ADMIN_SESSION_VALUE);
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Auth storage error', e);
  }
};

// -------------------------------------------------------------
// CUSTOM LOGO STORE (Upload logo manual dari dashboard admin)
// -------------------------------------------------------------
const CUSTOM_LOGO_KEY = 'izkatech_custom_logo_url';

export const getCustomLogo = (): string | null => {
  try {
    return localStorage.getItem(CUSTOM_LOGO_KEY);
  } catch {
    return null;
  }
};

export const setCustomLogo = (dataUrl: string) => {
  try {
    localStorage.setItem(CUSTOM_LOGO_KEY, dataUrl);
    window.dispatchEvent(new Event('izkatech_logo_updated'));
  } catch (e) {
    console.error('Gagal menyimpan logo:', e);
  }
};

export const removeCustomLogo = () => {
  try {
    localStorage.removeItem(CUSTOM_LOGO_KEY);
    window.dispatchEvent(new Event('izkatech_logo_updated'));
  } catch (e) {
    console.error('Gagal menghapus logo:', e);
  }
};

// -------------------------------------------------------------
// BRAND IDENTITY STORE (Single Source of Truth identitas visual)
// Kelola logo utama, favicon, stempel monokrom, palet warna,
// legalitas/tagline, serta opsi kop surat & watermark dokumen.
// -------------------------------------------------------------
export interface BrandPalette {
  primary: string;
  navy: string;
  accent: string;
  dark: string;
}

export interface BrandLegal {
  companyName: string;
  brandName: string;
  domain: string;
  subdomain: string;
  tagline: string;
  subBrand1: string;
  subBrand2: string;
}

export interface BrandLetterhead {
  /** Tampilkan logo di kop dokumen SPH / PKS / Invoice */
  showHeaderLogo: boolean;
  /** Tampilkan watermark transparan di badan dokumen */
  showWatermark: boolean;
  /** Opasitas watermark 0-100 (persen) */
  watermarkOpacity: number;
}

export interface BrandSettings {
  /** Logo utama horizontal landscape (data URL) — dipakai website, dashboard & dokumen */
  mainLogo: string | null;
  /** Icon square 1:1 untuk favicon browser */
  favicon: string | null;
  /** Versi monokrom 1:1 untuk stempel / watermark dokumen */
  monoLogo: string | null;
      colors: BrandPalette;
  legal: BrandLegal;
  letterhead: BrandLetterhead;
  /** Kustomisasi logo & nama partner (keyed by partner nama asli) */
  partnerCustomizations: Record<string, { name?: string; logo: string | null }>;
}

export const defaultBrandSettings = (): BrandSettings => ({
  mainLogo: null,
  favicon: null,
  monoLogo: null,
  colors: {
    primary: '#06B6D4',
    navy: '#0E3A5D',
    accent: '#10B981',
    dark: '#1E293B',
  },
  legal: {
    companyName: 'PT Ihza Karya Teknologi',
    brandName: 'IZKATECH',
    domain: 'izkatech.co.id',
    subdomain: 'sph.izkatech.co.id',
    tagline: 'Information Communication Technology',
    subBrand1: 'System Integrator',
    subBrand2: 'System Integrator & Mechanical Electrical',
  },
  letterhead: {
    showHeaderLogo: true,
    showWatermark: false,
    watermarkOpacity: 15,
  },
  partnerCustomizations: {},
});

const BRAND_SETTINGS_KEY = 'izkatech_brand_settings';

export const getBrandSettings = (): BrandSettings => {
  try {
    const raw = localStorage.getItem(BRAND_SETTINGS_KEY);
    if (!raw) {
      // Belum ada konfigurasi: warisi logo kustom lama (jika pernah diunggah)
      const seeded = defaultBrandSettings();
      seeded.mainLogo = getCustomLogo();
      return seeded;
    }
    const parsed = JSON.parse(raw) as Partial<BrandSettings>;
    return {
      ...defaultBrandSettings(),
      ...parsed,
      colors: { ...defaultBrandSettings().colors, ...(parsed.colors || {}) },
      legal: { ...defaultBrandSettings().legal, ...(parsed.legal || {}) },
      letterhead: { ...defaultBrandSettings().letterhead, ...(parsed.letterhead || {}) },
      partnerCustomizations: { ...defaultBrandSettings().partnerCustomizations, ...(parsed.partnerCustomizations || {}) },
    };
  } catch {
    const seeded = defaultBrandSettings();
    seeded.mainLogo = getCustomLogo();
    return seeded;
  }
};

export const saveBrandSettings = (settings: BrandSettings) => {
  try {
    localStorage.setItem(BRAND_SETTINGS_KEY, JSON.stringify(settings));
    // Back-compat: sinkronkan logo utama ke key lama agar Logo component
    // (navbar, sidebar, login, dokumen) otomatis mengikuti lewat event.
    if (settings.mainLogo) {
      localStorage.setItem(CUSTOM_LOGO_KEY, settings.mainLogo);
    } else {
      localStorage.removeItem(CUSTOM_LOGO_KEY);
    }
    window.dispatchEvent(new Event('izkatech_logo_updated'));
    window.dispatchEvent(new Event('izkatech_brand_updated'));
  } catch (e) {
    console.error('Gagal menyimpan pengaturan brand:', e);
  }
};

export const getPartnerLogo = (partnerName: string): string | null => {
  const settings = getBrandSettings();
  return settings.partnerCustomizations[partnerName]?.logo || null;
};

export const getPartnerDisplayName = (partnerName: string): string => {
  const settings = getBrandSettings();
  return settings.partnerCustomizations[partnerName]?.name?.trim() || partnerName;
};

export const savePartnerLogo = (partnerName: string, dataUrl: string) => {
  const settings = getBrandSettings();
  const current = settings.partnerCustomizations[partnerName] || {};
  settings.partnerCustomizations = {
    ...settings.partnerCustomizations,
    [partnerName]: { ...current, logo: dataUrl },
  };
  saveBrandSettings(settings);
};

export const savePartnerName = (partnerName: string, customName: string) => {
  const settings = getBrandSettings();
  const current = settings.partnerCustomizations[partnerName] || {};
  settings.partnerCustomizations = {
    ...settings.partnerCustomizations,
    [partnerName]: { ...current, name: customName },
  };
  saveBrandSettings(settings);
};

export const removePartnerCustomization = (partnerName: string) => {
  const settings = getBrandSettings();
  const updated = { ...settings.partnerCustomizations };
  delete updated[partnerName];
  settings.partnerCustomizations = updated;
  saveBrandSettings(settings);
};

/** Terapkan favicon dari pengaturan brand (panggil saat boot & saat berubah). */
export const applyBrandFavicon = () => {
  try {
    const href = getBrandSettings().favicon;
    let link = document.querySelector<HTMLLinkElement>('link#izkatech-favicon');
    if (!href) {
      if (link) link.remove();
      return;
    }
    if (!link) {
      link = document.createElement('link');
      link.id = 'izkatech-favicon';
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/png';
    link.href = href;
  } catch {
    /* environment tanpa DOM — abaikan */
  }
};

const guessAssetMime = (dataUrl: string): string =>
  dataUrl.startsWith('data:image/svg')
    ? 'image/svg+xml'
    : dataUrl.startsWith('data:image/webp')
      ? 'image/webp'
      : 'image/png';

let brandManifestUrl: string | null = null;

/** Timpa manifest PWA + apple-touch-icon dengan aset & identitas dari Pengaturan Brand. */
export const applyBrandManifest = () => {
  try {
    const brand = getBrandSettings();
    const manifestLink = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
    if (!manifestLink) return;
    const icon = brand.favicon || brand.mainLogo;

    if (!icon) {
      // Tidak ada aset kustom — kembalikan manifest statis bawaan
      if (brandManifestUrl) {
        URL.revokeObjectURL(brandManifestUrl);
        brandManifestUrl = null;
      }
      manifestLink.href = './manifest.json';
      document.querySelector<HTMLLinkElement>('link#izkatech-apple-icon')?.remove();
      return;
    }

    // Manifest dinamis disajikan sebagai blob: URL, sehingga path relatif tidak
    // dapat diandalkan — start_url/scope disusun absolut dari URL dasar aplikasi
    // agar tetap benar saat di-host di sub-path (mis. GitHub Pages).
    const appBase = (() => {
      try {
        return new URL('.', document.baseURI).href;
      } catch {
        return undefined;
      }
    })();

    const mime = guessAssetMime(icon);
    const dynamicManifest = {
      name: `${brand.legal.brandName} - ${brand.legal.companyName}`,
      short_name: brand.legal.brandName,
      description: brand.legal.tagline,
      start_url: appBase,
      scope: appBase,
      display: 'standalone',
      background_color: brand.colors.dark,
      theme_color: brand.colors.primary,
      orientation: 'portrait-primary',
      icons: [
        { src: icon, sizes: '192x192', type: mime, purpose: 'any' },
        { src: icon, sizes: '512x512', type: mime, purpose: 'any maskable' },
      ],
    };

    if (brandManifestUrl) URL.revokeObjectURL(brandManifestUrl);
    brandManifestUrl = URL.createObjectURL(
      new Blob([JSON.stringify(dynamicManifest)], { type: 'application/manifest+json' })
    );
    manifestLink.href = brandManifestUrl;

    let apple = document.querySelector<HTMLLinkElement>('link#izkatech-apple-icon');
    if (!apple) {
      apple = document.createElement('link');
      apple.id = 'izkatech-apple-icon';
      apple.rel = 'apple-touch-icon';
      document.head.appendChild(apple);
    }
    apple.href = icon;
  } catch {
    /* SSR / lingkungan tanpa DOM — abaikan */
  }
};

/** Terapkan seluruh aset brand ke dokumen: favicon + manifest PWA + apple icon. */
export const applyBrandAssets = () => {
  applyBrandFavicon();
  applyBrandManifest();
};

// -------------------------------------------------------------
// LIVE CHAT & CRM SYSTEM STORE
// -------------------------------------------------------------
const INITIAL_CHAT_SESSIONS: ChatSession[] = [
  {
    id: 'CHAT-2026-001',
    visitorName: 'Pak Rian Kurniawan',
    visitorCompany: 'PT. Multi Fabrindo Logistik',
    visitorPhone: '0812-3490-1122',
    visitorEmail: 'rian.k@multifabrindo.com',
    serviceInterest: 'CCTV Surveillance & Access Control',
    createdAt: '2026-09-16 09:30',
    lastActive: '2026-09-16 09:42',
    status: 'active',
    unreadCountAdmin: 1,
    unreadCountVisitor: 0,
    messages: [
      {
        id: 'msg-001',
        sender: 'system',
        senderName: 'Sistem IZKATECH',
        text: 'Selamat datang di Live Support CRM PT. Ihza Karya Teknologi. Tim Solution Architect siap membantu.',
        timestamp: '09:30'
      },
      {
        id: 'msg-002',
        sender: 'visitor',
        senderName: 'Pak Rian Kurniawan',
        text: 'Halo, saya mau menanyakan paket upgrade CCTV 32 channel IP camera Hikvision untuk gudang Cikarang, apakah bisa request survei lokasi minggu ini?',
        timestamp: '09:32'
      },
      {
        id: 'msg-003',
        sender: 'admin',
        senderName: 'Eng. Dimas (Technical Support)',
        text: 'Halo Pak Rian, tentu bisa. Tim engineer kami siap jadwalkan site survey teknis. Apakah sudah ada layout denah kabelnya?',
        timestamp: '09:36'
      },
      {
        id: 'msg-004',
        sender: 'visitor',
        senderName: 'Pak Rian Kurniawan',
        text: 'Sudah ada format PDF-nya, nanti saya kirimkan ke tim lapangan saat survei.',
        timestamp: '09:42'
      }
    ]
  }
];

export const getStoredChatSessions = (): ChatSession[] => {
  try {
    const raw = localStorage.getItem(CHAT_SESSIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CHAT_SESSIONS_STORAGE_KEY, JSON.stringify(INITIAL_CHAT_SESSIONS));
      return INITIAL_CHAT_SESSIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CHAT_SESSIONS;
  }
};

export const saveChatSessions = (sessions: ChatSession[]) => {
  try {
    localStorage.setItem(CHAT_SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    // Trigger custom event so other components update in real-time
    window.dispatchEvent(new Event('izkatech_chat_updated'));
  } catch (e) {
    console.error('Failed to save chat sessions', e);
  }
};

export const getOrCreateVisitorSession = (initialData?: {
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  service?: string;
}): ChatSession => {
  const sessions = getStoredChatSessions();
  const currentId = localStorage.getItem(CURRENT_VISITOR_SESSION_KEY);

  if (currentId) {
    const found = sessions.find(s => s.id === currentId);
    if (found) {
      // Sesi lama dipakai kembali; lengkapi profilnya bila data baru dikirim dari form widget
      if (!initialData) return found;
      const updatedSession: ChatSession = {
        ...found,
        visitorName: initialData.name || found.visitorName,
        visitorPhone: initialData.phone || found.visitorPhone,
        visitorEmail: initialData.email || found.visitorEmail,
        visitorCompany: initialData.company || found.visitorCompany,
        serviceInterest: initialData.service || found.serviceInterest,
      };
      saveChatSessions(sessions.map(s => (s.id === found.id ? updatedSession : s)));
      return updatedSession;
    }
  }

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${timeStr}`;

  const newId = `CHAT-${now.getFullYear()}-${String(sessions.length + 1).padStart(3, '0')}`;
  const newSession: ChatSession = {
    id: newId,
    visitorName: initialData?.name || 'Tamu Pengunjung',
    visitorPhone: initialData?.phone || '',
    visitorEmail: initialData?.email || '',
    visitorCompany: initialData?.company || '',
    serviceInterest: initialData?.service || 'Konsultasi Umum ME & ICT',
    createdAt: dateStr,
    lastActive: dateStr,
    status: 'active',
    unreadCountAdmin: 0,
    unreadCountVisitor: 0,
    messages: [
      {
        id: `msg-${Date.now()}-init`,
        sender: 'system',
        senderName: 'Sistem CRM IZKATECH',
        text: 'Selamat datang di Live Chat PT. Ihza Karya Teknologi! Pesan Anda terhubung langsung ke Dashboard Engineer & Customer Support kami.',
        timestamp: timeStr
      }
    ]
  };

  const updated = [newSession, ...sessions];
  saveChatSessions(updated);
  localStorage.setItem(CURRENT_VISITOR_SESSION_KEY, newId);
  return newSession;
};

export const sendChatMessage = (
  sessionId: string,
  text: string,
  sender: 'visitor' | 'admin',
  senderName: string
): ChatSession[] => {
  const sessions = getStoredChatSessions();
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${timeStr}`;

  const updated = sessions.map(session => {
    if (session.id === sessionId) {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sender,
        senderName,
        text,
        timestamp: timeStr
      };
      return {
        ...session,
        lastActive: dateStr,
        unreadCountAdmin: sender === 'visitor' ? session.unreadCountAdmin + 1 : session.unreadCountAdmin,
        unreadCountVisitor: sender === 'admin' ? session.unreadCountVisitor + 1 : session.unreadCountVisitor,
        messages: [...session.messages, newMsg]
      };
    }
    return session;
  });

  saveChatSessions(updated);
  return updated;
};

export const markChatAsRead = (sessionId: string, by: 'admin' | 'visitor') => {
  const sessions = getStoredChatSessions();
  const updated = sessions.map(session => {
    if (session.id === sessionId) {
      return {
        ...session,
        unreadCountAdmin: by === 'admin' ? 0 : session.unreadCountAdmin,
        unreadCountVisitor: by === 'visitor' ? 0 : session.unreadCountVisitor,
      };
    }
    return session;
  });
  saveChatSessions(updated);
  return updated;
};

export const updateChatSessionStatus = (sessionId: string, status: ChatSession['status']) => {
  const sessions = getStoredChatSessions();
  const updated = sessions.map(s => s.id === sessionId ? { ...s, status } : s);
  saveChatSessions(updated);
  return updated;
};

export const deleteChatSession = (sessionId: string) => {
  const sessions = getStoredChatSessions();
  const updated = sessions.filter(s => s.id !== sessionId);
  saveChatSessions(updated);
  return updated;
};

// -------------------------------------------------------------
// BACKUP & RESTORE (Pusat Data & Cadangan)
//
// Seluruh data portal admin tersimpan di localStorage browser — sehingga
// hanya ada di perangkat ini dan rawan hilang (clear browsing data / ganti
// perangkat). Fungsi di bawah menyediakan cadangan .json yang dapat
// diunduh & dipulihkan kembali.
// -------------------------------------------------------------
export const BACKUP_APP_ID = 'izkatech-admin-backup';
export const BACKUP_VERSION = 1;

export interface AdminBackupCounts {
  inquiries: number;
  projects: number;
  chatSessions: number;
}

export interface AdminBackupBundle {
  /** Penanda jenis berkas agar cadangan aplikasi lain tidak diterima */
  app: string;
  version: number;
  exportedAt: string;
  counts: AdminBackupCounts;
  data: {
    inquiries: AdminInquiry[];
    projects: AdminProject[];
    chatSessions: ChatSession[];
    /** null bila bagian identitas brand tidak ada di berkas cadangan */
    brandSettings: BrandSettings | null;
  };
}

export type BackupImportMode = 'merge' | 'replace';

export type BackupValidation =
  | { ok: true; bundle: AdminBackupBundle }
  | { ok: false; error: string };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const toArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

/** Membaca ulang seluruh data aktif menjadi satu bundel cadangan. */
export const buildBackupBundle = (): AdminBackupBundle => {
  const inquiries = getStoredInquiries();
  const projects = getStoredProjects();
  const chatSessions = getStoredChatSessions();
  return {
    app: BACKUP_APP_ID,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    counts: {
      inquiries: inquiries.length,
      projects: projects.length,
      chatSessions: chatSessions.length,
    },
    data: {
      inquiries,
      projects,
      chatSessions,
      brandSettings: getBrandSettings(),
    },
  };
};

/**
 * Memvalidasi isi berkas cadangan (string JSON maupun objek).
 * Pesan galat berbahasa Indonesia agar dapat ditampilkan apa adanya di UI.
 */
export const validateBackup = (raw: string | unknown): BackupValidation => {
  let parsed: unknown = raw;

  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { ok: false, error: 'Berkas tidak dapat dibaca: bukan format JSON yang valid.' };
    }
  }

  if (!isRecord(parsed)) {
    return { ok: false, error: 'Isi berkas tidak dikenali sebagai cadangan.' };
  }

  if (parsed.app !== BACKUP_APP_ID) {
    return { ok: false, error: 'Berkas ini bukan cadangan Portal Admin IZKATECH.' };
  }

  const version = typeof parsed.version === 'number' ? parsed.version : BACKUP_VERSION;
  if (version > BACKUP_VERSION) {
    return {
      ok: false,
      error: `Versi cadangan (v${version}) lebih baru daripada yang didukung aplikasi (v${BACKUP_VERSION}).`,
    };
  }

  if (!isRecord(parsed.data)) {
    return { ok: false, error: 'Bagian data cadangan tidak ditemukan di dalam berkas.' };
  }

  const { data } = parsed;
  const inquiries = toArray<AdminInquiry>(data.inquiries);
  const projects = toArray<AdminProject>(data.projects);
  const chatSessions = toArray<ChatSession>(data.chatSessions);

  return {
    ok: true,
    bundle: {
      app: BACKUP_APP_ID,
      version,
      exportedAt: typeof parsed.exportedAt === 'string' ? parsed.exportedAt : '',
      counts: {
        inquiries: inquiries.length,
        projects: projects.length,
        chatSessions: chatSessions.length,
      },
      data: {
        inquiries,
        projects,
        chatSessions,
        brandSettings: isRecord(data.brandSettings) ? (data.brandSettings as unknown as BrandSettings) : null,
      },
    },
  };
};

/** Menggabungkan dua daftar berdasarkan `id`; data cadangan menang bila id sama. */
const mergeById = <T extends { id: string }>(current: T[], incoming: T[]): T[] => {
  const byId = new Map(current.map((item) => [item.id, item]));
  incoming.forEach((item) => byId.set(item.id, item));
  return Array.from(byId.values());
};

export interface BackupApplyResult {
  inquiries: AdminInquiry[];
  projects: AdminProject[];
  chatSessions: ChatSession[];
}

/**
 * Memulihkan data dari bundel cadangan.
 *
 * - `merge`   : gabungkan berdasarkan ID (pengaturan brand tidak diubah)
 * - `replace` : timpa seluruh data, termasuk identitas & aset brand
 */
export const applyBackup = (
  bundle: AdminBackupBundle,
  mode: BackupImportMode = 'merge'
): BackupApplyResult => {
  const incoming = bundle.data;

  const inquiries =
    mode === 'replace' ? incoming.inquiries : mergeById(getStoredInquiries(), incoming.inquiries);
  const projects =
    mode === 'replace' ? incoming.projects : mergeById(getStoredProjects(), incoming.projects);
  const chatSessions =
    mode === 'replace'
      ? incoming.chatSessions
      : mergeById(getStoredChatSessions(), incoming.chatSessions);

  try {
    localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(inquiries));
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Gagal memulihkan data prospek/proyek', e);
  }

  // saveChatSessions & saveBrandSettings sekaligus memancarkan event sinkronisasi
  saveChatSessions(chatSessions);
  if (mode === 'replace' && incoming.brandSettings) {
    saveBrandSettings(incoming.brandSettings);
  }

  return { inquiries, projects, chatSessions };
};

/** Mengembalikan seluruh data ke kondisi awal (data contoh bawaan). */
export const resetAllData = () => {
  try {
    [
      INQUIRIES_STORAGE_KEY,
      PROJECTS_STORAGE_KEY,
      CHAT_SESSIONS_STORAGE_KEY,
      BRAND_SETTINGS_KEY,
      CUSTOM_LOGO_KEY,
      CURRENT_VISITOR_SESSION_KEY,
    ].forEach((key) => localStorage.removeItem(key));
    window.dispatchEvent(new Event('izkatech_chat_updated'));
    window.dispatchEvent(new Event('izkatech_logo_updated'));
  } catch (e) {
    console.error('Gagal mereset data portal', e);
  }
};

export interface StorageUsageEntry {
  key: string;
  label: string;
  bytes: number;
}

export interface StorageUsage {
  entries: StorageUsageEntry[];
  totalBytes: number;
  /** Perkiraan kuota localStorage (batas berbeda tiap browser) */
  quotaBytes: number;
}

/**
 * Perkiraan pemakaian localStorage per kelompok data. Nilai byte dihitung
 * sebagai 2× jumlah karakter karena localStorage menyimpan string UTF-16.
 */
export const getStorageUsage = (): StorageUsage => {
  const tracked: { key: string; label: string }[] = [
    { key: INQUIRIES_STORAGE_KEY, label: 'Data prospek' },
    { key: PROJECTS_STORAGE_KEY, label: 'Proyek portofolio' },
    { key: CHAT_SESSIONS_STORAGE_KEY, label: 'Sesi live chat' },
    { key: BRAND_SETTINGS_KEY, label: 'Identitas & aset brand' },
    { key: CUSTOM_LOGO_KEY, label: 'Logo kustom (cadangan lama)' },
  ];

  const entries = tracked.map(({ key, label }) => {
    let bytes = 0;
    try {
      const value = localStorage.getItem(key);
      bytes = value ? value.length * 2 : 0;
    } catch {
      bytes = 0;
    }
    return { key, label, bytes };
  });

  return {
    entries,
    totalBytes: entries.reduce((sum, entry) => sum + entry.bytes, 0),
    quotaBytes: 5 * 1024 * 1024,
  };
};

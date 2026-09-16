import { AdminInquiry, AdminProject, AdminNotification } from '../types/admin.ts';

const INQUIRIES_STORAGE_KEY = 'izkatech_admin_inquiries';
const PROJECTS_STORAGE_KEY = 'izkatech_admin_projects';
const AUTH_STORAGE_KEY = 'izkatech_admin_session';

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
      return INITIAL_PROJECTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROJECTS;
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

export const checkAdminAuth = (): boolean => {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'authenticated_izkatech_admin';
  } catch {
    return false;
  }
};

export const setAdminAuth = (authenticated: boolean) => {
  try {
    if (authenticated) {
      localStorage.setItem(AUTH_STORAGE_KEY, 'authenticated_izkatech_admin');
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Auth storage error', e);
  }
};

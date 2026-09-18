import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo.tsx';
import { useBrandIdentity } from '../hooks/useBrandIdentity.ts';
import { 
  getStoredInquiries, 
  updateInquiry,
  deleteInquiry,
  getStoredProjects,
  saveProject,
  updateProject,
  deleteProject,
  setAdminAuth,
  checkAdminAuth,
  verifyAdminCredentials,
  getStoredChatSessions,
  sendChatMessage,
  markChatAsRead,
  updateChatSessionStatus,
  deleteChatSession
} from '../data/adminStore.ts';
import { AdminInquiry, AdminProject, ChatSession } from '../types/admin.ts';
import { COMPANY_INFO, SERVICES, BRAND_PARTNERS } from '../data/companyData.ts';
import { ChatCRMTab } from './ChatCRMTab.tsx';
import { DocumentGeneratorModal } from './DocumentGeneratorModal.tsx';
import { AddInquiryModal } from './dashboard/AddInquiryModal.tsx';
import { AdminSidebar, AdminTab } from './dashboard/AdminSidebar.tsx';
import { StatsCard } from './dashboard/StatsCard.tsx';
import { ProjectFormModal } from './dashboard/ProjectFormModal.tsx';
import { SettingsTab } from './dashboard/SettingsTab.tsx';
import { 
  Lock, 
  LogOut, 
  Inbox, 
  Briefcase, 
  BarChart3, 
  Trash2, 
  CheckCircle, 
  Clock, 
  FileSpreadsheet, 
  AlertCircle, 
  Plus,
  FileText,
  ArrowRight,
  Eye,
  EyeOff,
  Pencil,
  Headphones,
  User,
  Menu,
  MapPin
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToWebsite: () => void;
}

/** Normalisasi nomor kontak klien (08xx / +62xxx) menjadi tautan wa.me */
const waLink = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  const normalized = digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}`;
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToWebsite }) => {
  // Identitas brand aktif — ikut Pengaturan Logo & Identitas Brand
  const identity = useBrandIdentity();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberSession, setRememberSession] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string>('');
  
    // Dashboard Navigation State
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [projects, setProjects] = useState<AdminProject[]>([]);
  
    // Chat CRM State
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedChatSession, setSelectedChatSession] = useState<ChatSession | null>(null);
  const [adminMessageInput, setAdminMessageInput] = useState('');
  const selectedChatSessionIdRef = useRef<string | null>(null);
  
  // Search and Filter State
  const [selectedInquiry, setSelectedInquiry] = useState<AdminInquiry | null>(null);

  // New / Edit Project Form State
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<AdminProject | null>(null);

  // Tambah Prospek Manual (modal input baru via AddInquiryModal)
  const [isAddInquiryModalOpen, setIsAddInquiryModalOpen] = useState<boolean>(false);

  // Edit Inquiry Modal State
  const [editingInquiry, setEditingInquiry] = useState<AdminInquiry | null>(null);

  // Document Generator (SPH / PKS / Invoice) State
  const [docGenInquiry, setDocGenInquiry] = useState<AdminInquiry | null>(null);
  const [docGenType, setDocGenType] = useState<'SPH' | 'PKS' | 'INVOICE'>('SPH');

  const openDocGenerator = (inquiry: AdminInquiry, type: 'SPH' | 'PKS' | 'INVOICE') => {
    setDocGenType(type);
    setDocGenInquiry(inquiry);
  };

      // Keep the selected chat session ID ref in sync
  useEffect(() => {
    selectedChatSessionIdRef.current = selectedChatSession?.id || null;
  }, [selectedChatSession]);

  useEffect(() => {
    const isAuthed = checkAdminAuth();
    setIsAuthenticated(isAuthed);
    if (isAuthed) {
      loadData();
    }

    // Listen for real-time chat updates from visitor side
    const handleChatUpdate = () => {
      const sessions = getStoredChatSessions();
      setChatSessions(sessions);
      const currentId = selectedChatSessionIdRef.current;
      if (currentId) {
        const updated = sessions.find(s => s.id === currentId);
        if (updated) {
          setSelectedChatSession(updated);
        }
      }
    };
    window.addEventListener('izkatech_chat_updated', handleChatUpdate);
    return () => {
      window.removeEventListener('izkatech_chat_updated', handleChatUpdate);
    };
  }, []);

  const loadData = () => {
    setInquiries(getStoredInquiries());
    setProjects(getStoredProjects());
    const chatData = getStoredChatSessions();
    setChatSessions(chatData);
    if (chatData.length > 0 && !selectedChatSession) {
      setSelectedChatSession(chatData[0]);
    }
  };

  // ---- Chat CRM Handlers ----
  const handleSelectChatSession = (session: ChatSession) => {
    setSelectedChatSession(session);
    markChatAsRead(session.id, 'admin');
    const updated = getStoredChatSessions();
    setChatSessions(updated);
    setSelectedChatSession(updated.find(s => s.id === session.id) || session);
  };

  const handleSendAdminMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminMessageInput.trim() || !selectedChatSession) return;

    const updated = sendChatMessage(
      selectedChatSession.id,
      adminMessageInput.trim(),
      'admin',
      'Eng. Dimas (IZKATECH Support)'
    );
    setChatSessions(updated);
    const refreshed = updated.find(s => s.id === selectedChatSession.id);
    if (refreshed) {
      setSelectedChatSession(refreshed);
    }
    setAdminMessageInput('');
  };

  const handleResolveChat = (session: ChatSession) => {
    const status: ChatSession['status'] = session.status === 'active' ? 'resolved' : 'active';
    const updated = updateChatSessionStatus(session.id, status);
    setChatSessions(updated);
    setSelectedChatSession(updated.find(s => s.id === session.id) || session);
  };

  const handleDeleteChatSession = (session: ChatSession) => {
    if (window.confirm(`Hapus seluruh riwayat chat dengan ${session.visitorName}?`)) {
      const updated = deleteChatSession(session.id);
      setChatSessions(updated);
      if (selectedChatSession?.id === session.id) {
        setSelectedChatSession(updated.length > 0 ? updated[0] : null);
      }
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const account = verifyAdminCredentials(emailInput, passwordInput);
    if (!account) {
      setLoginError('Email atau kata sandi tidak sesuai. Periksa kembali atau hubungi IT Support.');
      return;
    }
    setIsAuthenticated(true);
    setAdminAuth(true, rememberSession);
    setLoginError('');
    setPasswordInput('');
    loadData();
  };

  /** Permintaan reset kata sandi diteruskan ke IT Support melalui WhatsApp */
  const handleForgotPassword = () => {
    const requester = emailInput.trim() || '(isi email akun Anda)';
    const text = encodeURIComponent(
      `Halo IT Support IZKATECH, akun Portal Admin ${requester} mengalami kendala login (lupa kata sandi). Mohon bantuan proses reset.`
    );
    window.open(`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${text}`, '_blank');
  };

  const handleLogout = () => {
    setAdminAuth(false);
    setIsAuthenticated(false);
    setEmailInput('');
    setPasswordInput('');
    setLoginError('');
  };

  const handleDeleteInquiry = (id: string) => {
    if (window.confirm('Hapus data prospek ini?')) {
      const updated = deleteInquiry(id);
      setInquiries(updated);
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null);
      }
    }
  };

  const handleSaveEditedInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInquiry) return;
    const updated = updateInquiry(editingInquiry);
    setInquiries(updated);
    if (selectedInquiry?.id === editingInquiry.id) {
      setSelectedInquiry(editingInquiry);
    }
    setEditingInquiry(null);
  };

  const handleOpenEditProject = (proj: AdminProject) => {
    setEditingProject(proj);
    setIsAddProjectModalOpen(true);
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Hapus proyek ini dari portofolio?')) {
      const updated = deleteProject(id);
      setProjects(updated);
    }
  };

  const exportInquiriesToCSV = () => {
    const headers = ['ID', 'Tanggal', 'Nama Klien', 'Perusahaan', 'No WhatsApp', 'Email', 'Layanan', 'Skala', 'Status', 'Catatan'];
    const rows = inquiries.map(item => [
      item.id,
      item.timestamp,
      `"${item.clientName}"`,
      `"${item.companyName}"`,
      `"${item.phone}"`,
      `"${item.email}"`,
      `"${item.serviceInterest.join(', ')}"`,
      `"${item.scale || '-'}"`,
      item.status,
      `"${item.notes.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `izkatech_prospek_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate Metrics
  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter(i => i.status === 'new').length;
  const inProgressInquiries = inquiries.filter(i => i.status === 'survey' || i.status === 'contacted').length;
  const dealInquiries = inquiries.filter(i => i.status === 'deal').length;

  // Calculate Chat Metrics
  const activeChats = chatSessions.filter(s => s.status === 'active').length;
  const unreadAdminMessages = chatSessions.reduce((sum, s) => sum + s.unreadCountAdmin, 0);

  // -------------------------------------------------------------
  // LOGIN SCREEN (If not authenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
        {/* Background ambient lighting — warna cyan identik dashboard */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pointer-events-none" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[560px] h-[320px] bg-cyan-500/20 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-700/10 blur-[110px] pointer-events-none rounded-full" />

        <div className="w-full max-w-md relative z-10">
          {/* Brand Header — logo kiri, nama perusahaan kanan, persis mockup */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <Logo size="lg" showText={false} className="shrink-0" />
            <div className="text-left leading-tight">
              <div className="text-base font-bold text-white">{identity.companyName}</div>
              <div className="text-[11px] text-slate-400">Information Communication Technology</div>
              <div className="text-[11px] font-semibold text-slate-200">{identity.subBrand2}</div>
              <div className="mt-1.5 h-1 w-24 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
            </div>
          </div>

          {/* IZKATECH wordmark di bawah logo */}
          <div className="text-center mb-1.5">
            <div className="text-lg font-extrabold tracking-wide text-cyan-300 font-display">
              {identity.brandName}
            </div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">
              {identity.tagline}
            </div>
          </div>

          {/* Badge mode masuk admin */}
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 shadow-sm text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Masuk Admin</span>
            </span>
          </div>

          {/* Card Autentikasi */}
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-3xl shadow-2xl shadow-slate-950/60 overflow-hidden">
            {/* Garis gradien identitas brand */}
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-600" />

            {/* Login Form — label persis mockup: "email", "Kata Sandi" */}
            <form onSubmit={handleLogin} className="px-6 sm:px-7 pt-5 pb-6 space-y-4 text-slate-200">
              {/* Email */}
              <div>
                <label htmlFor="admin-email" className="block text-xs font-medium text-slate-300 mb-1.5">
                  email
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    id="admin-email"
                    type="email"
                    required
                    autoFocus
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="nama@izkatech.co.id"
                    autoComplete="username"
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-900/50 transition-colors"
                  />
                </div>
              </div>

              {/* Kata Sandi */}
              <div>
                <label htmlFor="admin-password" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-900/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2.5 top-2 p-1.5 rounded-lg text-slate-500 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {loginError && (
                  <p className="text-xs text-rose-400 flex items-start gap-1.5 mt-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{loginError}</span>
                  </p>
                )}
              </div>

              {/* Ingat sesi & lupa sandi */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="inline-flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberSession}
                    onChange={(e) => setRememberSession(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-600 accent-cyan-500 cursor-pointer"
                  />
                  <span>Ingat sesi saya</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-medium text-cyan-300 hover:text-cyan-200 hover:underline cursor-pointer"
                >
                  Lupa sandi?
                </button>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-cyan-500 to-blue-800 hover:from-cyan-400 hover:to-blue-700 shadow-lg shadow-cyan-500/25 transition-all transform active:scale-[0.99] cursor-pointer"
              >
                <span>Masuk ke Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="border-t border-slate-700" />
              <div className="text-center -mt-1">
                <span className="text-[10px] font-mono text-slate-500">
                  Akun demo: admin@izkatech.co.id · izkatech2026
                </span>
              </div>
            </form>
          </div>

          {/* Legal persis mockup */}
          <div className="text-center mt-5">
            <p className="text-[11px] text-slate-500">
              © {new Date().getFullYear()} PT Ihza Karya Teknologi. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex font-sans">
      {/* Sidebar (desktop) */}
      <AdminSidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        counts={{
          inquiries: inquiries.length,
          newInquiries,
          projects: projects.length,
          chats: activeChats,
          unreadChats: chatSessions.filter(s => s.unreadCountAdmin > 0).length,
        }}
        onLogout={handleLogout}
        onBackToWebsite={onBackToWebsite}
      />

      {/* Sidebar drawer (mobile) */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-[55] bg-slate-900/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <AdminSidebar
            mobile
            currentTab={currentTab}
            onTabChange={setCurrentTab}
            counts={{
              inquiries: inquiries.length,
              newInquiries,
              projects: projects.length,
              chats: activeChats,
              unreadChats: chatSessions.filter(s => s.unreadCountAdmin > 0).length,
            }}
            onLogout={handleLogout}
            onBackToWebsite={onBackToWebsite}
            onClose={() => setSidebarOpen(false)}
          />
        </>
      )}

      {/* Main Workspace Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile Top Bar */}
        <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
          <div className="px-4 h-14 flex items-center justify-between gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer transition-colors"
              aria-label="Buka Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* Brand mini di header konten — ikon saja (nama sudah di sidebar), hemat baris */}
            <Logo size="sm" variant="cyan-gold" showText={false} className="shrink-0" />
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-200 cursor-pointer transition-colors"
              aria-label="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* -------------------------------------------------------------
            TAB 0: OVERVIEW (Dashboard Ringkasan)
            ------------------------------------------------------------- */}
        {currentTab === 'overview' && (
          <div className="space-y-6">
            {/* Welcome Banner with Brand Gradient */}
            <div className="bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 rounded-2xl p-6 relative overflow-hidden shadow-lg shadow-cyan-500/20">
              <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="absolute -right-16 bottom-0 w-56 h-24 rounded-full bg-amber-300/20 blur-2xl pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-100">
                    PT. Ihza Karya Teknologi — Internal Console
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-display mt-1">
                    Selamat Datang, Tim IZKATECH
                  </h2>
                  <p className="text-xs text-cyan-100 mt-1">
                    Ringkasan prospek, proyek &amp; live chat — {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentTab('inquiries')}
                  className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-bold backdrop-blur transition-colors cursor-pointer"
                >
                  <Inbox className="w-4 h-4" />
                  Buka Kotak Prospek
                </button>
              </div>
            </div>

            {/* Stats Grid — baris rapi 3 + 2 di desktop, tinggi kartu seragam */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 items-stretch">
              <StatsCard label="Total Prospek Masuk" value={totalInquiries} icon={Inbox} accent="cyan" sub="Formulir Web & RFP" />
              <StatsCard label="Prospek Baru" value={newInquiries} icon={Clock} accent="amber" sub="Perlu follow-up sales" onClick={() => setCurrentTab('inquiries')} />
              <StatsCard label="Survei / Negosiasi" value={inProgressInquiries} icon={Briefcase} accent="blue" sub="Penyusunan BoQ & RAB" onClick={() => setCurrentTab('inquiries')} />
              <StatsCard label="Deal / SPK" value={dealInquiries} icon={CheckCircle} accent="emerald" sub="Terkonfirmasi masuk" onClick={() => setCurrentTab('inquiries')} />
              <StatsCard label="Live Chat Aktif" value={activeChats} icon={Headphones} accent="rose" sub={`${unreadAdminMessages} belum dibalas`} onClick={() => setCurrentTab('chat')} className="sm:col-span-2 md:col-span-1" />
            </div>

            {/* Overview bawah — kolom kiri/kana sejajar rapi */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {/* Recent Inquiries */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[320px]">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Inbox className="w-4 h-4 text-cyan-600" />
                    Prospek Terbaru
                  </h3>
                  <button
                    onClick={() => setCurrentTab('inquiries')}
                    className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 cursor-pointer"
                  >
                    Lihat Semua →
                  </button>
                </div>
                <div className="divide-y divide-slate-100 flex-1">
                  {inquiries.slice(0, 5).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedInquiry(item);
                        setCurrentTab('inquiries');
                      }}
                      className="w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-3"
                    >
                      <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {item.clientName.charAt(0)}
                      </span>
                      <span className="min-w-0 block">
                        <span className="block text-xs font-bold text-slate-900 truncate leading-snug">{item.clientName}</span>
                        <span className="block text-[11px] text-slate-500 truncate mt-0.5">{item.companyName} • {item.serviceInterest[0]}</span>
                      </span>
                      <span className="text-right shrink-0 flex flex-col items-end justify-center gap-1">
                        <span className="text-[10px] font-mono text-slate-400 leading-none">{item.timestamp}</span>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase leading-none ${
                          item.status === 'new'
                            ? 'bg-amber-100 text-amber-700'
                            : item.status === 'deal'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.status}
                        </span>
                      </span>
                    </button>
                  ))}
                  {inquiries.length === 0 && (
                    <div className="p-8 text-center text-xs text-slate-400">
                      Belum ada prospek masuk.
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex flex-col min-h-[320px]">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-1">
                  <BarChart3 className="w-4 h-4 text-cyan-600" />
                  Tindakan Cepat
                </h3>
                <div className="space-y-3 mt-2">
                <button
                  onClick={() => setCurrentTab('inquiries')}
                  className="w-full grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all cursor-pointer text-left"
                >
                  <span className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </span>
                  <span className="min-w-0 block">
                    <span className="block text-xs font-bold text-slate-900 leading-snug truncate">Buat SPH / PKS</span>
                    <span className="block text-[10px] text-slate-500 leading-snug truncate">Pilih prospek lalu generate dokumen</span>
                  </span>
                </button>
                <button
                  onClick={() => setCurrentTab('chat')}
                  className="w-full grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all cursor-pointer text-left"
                >
                  <span className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Headphones className="w-4 h-4" />
                  </span>
                  <span className="min-w-0 block">
                    <span className="block text-xs font-bold text-slate-900 leading-snug truncate">Balas Live Chat</span>
                    <span className="block text-[10px] text-slate-500 leading-snug truncate">{unreadAdminMessages} pesan menunggu balasan</span>
                  </span>
                </button>
                <button
                  onClick={exportInquiriesToCSV}
                  className="w-full grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all cursor-pointer text-left"
                >
                  <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-4 h-4" />
                  </span>
                  <span className="min-w-0 block">
                    <span className="block text-xs font-bold text-slate-900 leading-snug truncate">Export Data (CSV)</span>
                    <span className="block text-[10px] text-slate-500 leading-snug truncate">Unduh seluruh data prospek</span>
                  </span>
                </button>
                <button
                  onClick={() => setCurrentTab('projects')}
                  className="w-full grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all cursor-pointer text-left"
                >
                  <span className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 leading-snug">Kelola Proyek</div>
                    <div className="text-[10px] text-slate-500 leading-snug">{projects.length} proyek portofolio</div>
                  </div>
                </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            PAGE TOOLBARS (per tab, pengganti navigation tabs bar)
            ------------------------------------------------------------- */}
        {currentTab === 'inquiries' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">Kotak Masuk Prospek</h2>
              <p className="text-xs text-slate-500">Kelola inquiry klien, status penanganan &amp; dokumen SPH/PKS.</p>
            </div>
            <button
              onClick={exportInquiriesToCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 text-xs font-semibold transition-colors cursor-pointer shrink-0"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Data ke CSV/Excel</span>
            </button>
          </div>
        )}

        {/* -------------------------------------------------------------
            KONTEN TAB PROSPEK (daftar inquiry + aksi SPH / PKS)
            ------------------------------------------------------------- */}
        {currentTab === 'inquiries' && (
          <div className="space-y-5">
            {/* Ringkasan status prospek + tombol tambah (satu baris rapi) */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Total {inquiries.length} prospek</span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">New {newInquiries}</span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">Follow-up {inProgressInquiries}</span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Deal {dealInquiries}</span>
              <button
                onClick={() => setIsAddInquiryModalOpen(true)}
                className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer shadow-sm shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Prospek</span>
              </button>
            </div>

            <div className="space-y-3">
              {inquiries.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-cyan-300 transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                        {item.clientName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 truncate">{item.clientName}</div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {item.companyName} • {item.phone} • {item.email}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {item.id} • {item.timestamp} • Sumber: {item.source}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                        item.status === 'new'
                          ? 'bg-amber-100 text-amber-700'
                          : item.status === 'deal'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.status}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                        item.priority === 'high'
                          ? 'bg-rose-100 text-rose-700'
                          : item.priority === 'medium'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                  </div>

                  {/* Layanan, skala & estimasi yang diminati */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.serviceInterest.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] text-slate-600">
                        {s}
                      </span>
                    ))}
                    {item.scale && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-[10px] text-cyan-700">
                        {item.scale}
                      </span>
                    )}
                    {item.budgetEstimate && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-700">
                        {item.budgetEstimate}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{item.notes}</p>

                  {/* Aksi prospek: edit, generate dokumen, follow-up WhatsApp, hapus */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setEditingInquiry({ ...item })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:border-cyan-400 hover:text-cyan-700 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit Prospek
                    </button>
                    <button
                      onClick={() => openDocGenerator(item, 'SPH')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-cyan-500/40 text-cyan-700 hover:bg-cyan-50 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" /> Buat SPH
                    </button>
                    <button
                      onClick={() => openDocGenerator(item, 'INVOICE')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-emerald-500/40 text-emerald-700 hover:bg-emerald-50 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" /> Buat Invoice
                    </button>
                    <button
                      onClick={() => openDocGenerator(item, 'PKS')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-indigo-500/40 text-indigo-700 hover:bg-indigo-50 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" /> Buat PKS
                    </button>
                    <a
                      href={waLink(item.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-500/40 text-emerald-700 hover:bg-emerald-100 text-[11px] font-semibold transition-colors"
                    >
                      <Headphones className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                    <button
                      onClick={() => handleDeleteInquiry(item.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-rose-500/40 text-rose-600 hover:bg-rose-50 text-[11px] font-semibold transition-colors cursor-pointer ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              ))}

              {inquiries.length === 0 && (
                <div className="p-10 text-center text-xs text-slate-400 bg-white border border-dashed border-slate-300 rounded-2xl">
                  Belum ada prospek masuk. Data dari formulir kalkulator &amp; kontak website akan tampil di sini.
                </div>
              )}
            </div>
          </div>
        )}

                {currentTab === 'projects' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-display">Portofolio Proyek</h2>
                <p className="text-xs text-slate-500">Kelola proyek yang tampil pada katalog portofolio website.</p>
              </div>
              <button
                onClick={() => {
                  setEditingProject(null);
                  setIsAddProjectModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Proyek</span>
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Total {projects.length} proyek</span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Selesai {projects.filter(p => p.status === 'completed').length}</span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">On Going {projects.filter(p => p.status === 'in_progress').length}</span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">Tender {projects.filter(p => p.status === 'tender').length}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-cyan-300 transition-all flex flex-col group">
                  <div className="relative h-40 overflow-hidden">
                    <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-semibold text-white bg-cyan-500/85 px-2 py-0.5 rounded-lg backdrop-blur">{proj.sectorLabel}</span>
                    <span className={`absolute top-2.5 right-2.5 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full backdrop-blur ${proj.status === 'completed' ? 'bg-emerald-500/85 text-white' : 'bg-amber-500/90 text-white'}`}>{proj.status === 'completed' ? 'SELESAI' : proj.status === 'tender' ? 'TENDER' : 'ON GOING'}</span>
                  </div>
                  <div className="p-4 space-y-2 flex-1 flex flex-col">
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">{proj.title}</h4>
                    <div className="text-xs text-cyan-700 font-semibold">{proj.clientName}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 shrink-0" /> <span className="truncate">{proj.location || '-'} • {proj.year}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{proj.description}</p>
                    {(proj.highlights || []).length > 0 && (
                      <div className="pt-1 space-y-1">
                        {proj.highlights!.slice(0, 2).map((h, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                            <span className="w-1 h-1 rounded-full bg-cyan-500 shrink-0" />
                            <span className="truncate">{h}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-mono text-slate-400 truncate">{proj.id}{proj.valueApprox ? ` • ${proj.valueApprox}` : ''}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => handleOpenEditProject(proj)} className="text-cyan-600 hover:bg-cyan-50 p-1.5 rounded-lg cursor-pointer transition-colors" title="Edit Proyek (gambar & detail katalog)"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteProject(proj.id)} className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg cursor-pointer transition-colors" title="Hapus"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {projects.length === 0 && (
              <div className="p-10 text-center bg-white border border-dashed border-slate-300 rounded-2xl text-slate-400 text-xs">
                Belum ada proyek. Klik "Tambah Proyek Baru" untuk memulai membangun portofolio.
              </div>
            )}
          </div>
        )}{/* -------------------------------------------------------------
            TAB 3: SERVICES & BRAND ECOSYSTEM OVERVIEW
            ------------------------------------------------------------- */}
        {currentTab === 'services' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                10 Pilar Solusi Teknologi IZKATECH (Official Scope)
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Daftar lingkup pekerjaan yang aktif ditawarkan di website utama dan kalkulator penawaran.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SERVICES.map((s, idx) => (
                  <div key={s.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{s.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand Partners */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                Ekosistem Prinsipal Brand Resmi (20+ Partners)
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Prinsipal perangkat keras, sekuriti, dan software yang didukung oleh PT. Ihza Karya Teknologi.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {BRAND_PARTNERS.map((brand) => (
                  <div key={brand.name} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
                    <div className="font-bold text-xs text-slate-900">{brand.name}</div>
                    <div className="text-[10px] text-cyan-600 font-mono">{brand.category}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
                )}

        {/* -------------------------------------------------------------
            TAB 4: LIVE CHAT CRM â€” Integrated chat conversation management
            ------------------------------------------------------------- */}
        {currentTab === 'chat' && (
          <div className="space-y-6">
            <ChatCRMTab
              chatSessions={chatSessions}
              selectedChatSession={selectedChatSession}
              adminMessageInput={adminMessageInput}
              setAdminMessageInput={setAdminMessageInput}
              onSelectSession={handleSelectChatSession}
              onSendAdminMessage={handleSendAdminMessage}
              onRefresh={() => {
                const sessions = getStoredChatSessions();
                setChatSessions(sessions);
                if (selectedChatSession) {
                  setSelectedChatSession(sessions.find(s => s.id === selectedChatSession.id) || selectedChatSession);
                }
              }}
              onResolveChat={handleResolveChat}
              onDeleteChatSession={handleDeleteChatSession}
            />
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 5: PENGATURAN LOGO & IDENTITAS BRAND (single source of truth)
            ------------------------------------------------------------- */}
        {currentTab === 'settings' && <SettingsTab />}

        </main>
      </div>

            {/* -------------------------------------------------------------
          PROJECT PORTFOLIO FORM MODAL (upload gambar & detail katalog)
          ------------------------------------------------------------- */}
      {isAddProjectModalOpen && (
        <ProjectFormModal
          project={editingProject}
          onClose={() => { setIsAddProjectModalOpen(false); setEditingProject(null); }}
          onSave={(p) => {
            if (editingProject) {
              setProjects(updateProject(p));
            } else {
              saveProject(p);
              setProjects(getStoredProjects());
            }
            setIsAddProjectModalOpen(false);
            setEditingProject(null);
          }}
        />
      )}
{/* -------------------------------------------------------------
          EDIT INQUIRY / LEAD MODAL
          ------------------------------------------------------------- */}
      {editingInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-600 uppercase">EDIT PROSPEK KLIEN</span>
                <h3 className="text-base font-bold text-slate-900 font-display">
                  {editingInquiry.id} - {editingInquiry.clientName}
                </h3>
              </div>
              <button
                onClick={() => setEditingInquiry(null)}
                className="text-slate-500 hover:text-slate-900 text-xs font-mono cursor-pointer"
              >
                TUTUP
              </button>
            </div>

            <form onSubmit={handleSaveEditedInquiry} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Nama Klien / PIC</label>
                  <input
                    type="text"
                    required
                    value={editingInquiry.clientName}
                    onChange={(e) => setEditingInquiry({ ...editingInquiry, clientName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Instansi / Perusahaan</label>
                  <input
                    type="text"
                    required
                    value={editingInquiry.companyName}
                    onChange={(e) => setEditingInquiry({ ...editingInquiry, companyName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">No WhatsApp / Telepon</label>
                  <input
                    type="text"
                    required
                    value={editingInquiry.phone}
                    onChange={(e) => setEditingInquiry({ ...editingInquiry, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Email Klien</label>
                  <input
                    type="email"
                    required
                    value={editingInquiry.email}
                    onChange={(e) => setEditingInquiry({ ...editingInquiry, email: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Status Tahapan</label>
                  <select
                    value={editingInquiry.status}
                    onChange={(e) => setEditingInquiry({ ...editingInquiry, status: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="new">NEW (Baru Masuk)</option>
                    <option value="contacted">CONTACTED (Dihubungi)</option>
                    <option value="survey">SURVEY (Jadwal Survei / BoQ)</option>
                    <option value="deal">DEAL (Disetujui / SPK)</option>
                    <option value="archived">ARCHIVED (Diarsipkan)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Prioritas</label>
                  <select
                    value={editingInquiry.priority}
                    onChange={(e) => setEditingInquiry({ ...editingInquiry, priority: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="high">Tinggi (High Priority)</option>
                    <option value="medium">Sedang (Medium)</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Skala Proyek &amp; Estimasi</label>
                <input
                  type="text"
                  value={editingInquiry.scale || ''}
                  onChange={(e) => setEditingInquiry({ ...editingInquiry, scale: e.target.value })}
                  placeholder="Contoh: Gedung 4 Lantai / 50 Titik"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">Catatan Klien &amp; Kebutuhan Teknis</label>
                <textarea
                  rows={3}
                  value={editingInquiry.notes}
                  onChange={(e) => setEditingInquiry({ ...editingInquiry, notes: e.target.value })}
                  placeholder="Rincian permintaan khusus, jadwal pertemuan, atau survei lokasi..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Hapus prospek ${editingInquiry.clientName}?`)) {
                      handleDeleteInquiry(editingInquiry.id);
                      setEditingInquiry(null);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border border-rose-500/30 flex items-center gap-1.5 cursor-pointer font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Data</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingInquiry(null)}
                    className="px-4 py-2 rounded-xl bg-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 shadow-md cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          DOCUMENT GENERATOR MODAL (SPH / PKS)
          ------------------------------------------------------------- */}
      {docGenInquiry && (
        <DocumentGeneratorModal
          inquiry={docGenInquiry}
          docType={docGenType}
          onClose={() => setDocGenInquiry(null)}
        />
      )}

      {/* -------------------------------------------------------------
          TAMBAH PROSPEK MODAL (input manual dari admin)
          ------------------------------------------------------------- */}
      <AddInquiryModal
        isOpen={isAddInquiryModalOpen}
        onClose={() => setIsAddInquiryModalOpen(false)}
        onInquiryAdded={() => setInquiries(getStoredInquiries())}
      />

      {/* Admin Dashboard Footer */}
      <footer className="border-t border-slate-200 py-4 text-center text-[11px] text-slate-500 font-mono">
        PT. Ihza Karya Teknologi (IZKATECH) â€¢ Dedicated Admin Console â€¢ Authorized Personnel Only
      </footer>
    </div>
  );
};

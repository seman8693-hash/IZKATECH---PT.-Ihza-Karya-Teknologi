import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo.tsx';
import { 
  getStoredInquiries, 
  updateInquiry,
  updateInquiryStatus, 
  deleteInquiry,
  getStoredProjects,
  saveProject,
  updateProject,
  deleteProject,
  setAdminAuth,
  checkAdminAuth,
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
import { AdminSidebar, AdminTab } from './dashboard/AdminSidebar.tsx';
import { StatsCard } from './dashboard/StatsCard.tsx';
import { ProjectFormModal } from './dashboard/ProjectFormModal.tsx';
import { 
  ShieldCheck, 
  Lock, 
  LogOut, 
  ExternalLink, 
  Inbox, 
  Briefcase, 
  BarChart3, 
  Settings, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Calendar, 
  Trash2, 
  CheckCircle, 
  Clock, 
  FileSpreadsheet, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Layers, 
  Server, 
  FileText,
  KeyRound,
  ArrowUpRight,
  Eye,
  Pencil,
  Edit3,
  Headphones,
  MessageSquare,
  Send,
  Users,
  Archive,
  Check,
  Menu,
  MapPin
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToWebsite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToWebsite }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<AdminInquiry | null>(null);

  // New / Edit Project Form State
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<AdminProject | null>(null);
  const [newProject, setNewProject] = useState<Omit<AdminProject, 'id'>>({
    title: '',
    clientName: '',
    category: 'Data Center & Network Infrastructure',
    year: new Date().getFullYear().toString(),
    status: 'in_progress',
    valueApprox: 'Rp 150.000.000',
    description: ''
  });

  // Edit Inquiry Modal State
  const [editingInquiry, setEditingInquiry] = useState<AdminInquiry | null>(null);

  // Document Generator (SPH / PKS) State
  const [docGenInquiry, setDocGenInquiry] = useState<AdminInquiry | null>(null);
  const [docGenType, setDocGenType] = useState<'SPH' | 'PKS'>('SPH');

  const openDocGenerator = (inquiry: AdminInquiry, type: 'SPH' | 'PKS') => {
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
    // Default Admin PIN: 2026 or 1234 or admin
    if (pinInput === '2026' || pinInput === 'admin' || pinInput === 'izkatech2026') {
      setIsAuthenticated(true);
      setAdminAuth(true);
      setLoginError('');
      loadData();
    } else {
      setLoginError('Kode PIN Keamanan salah. Silakan coba: 2026');
    }
  };

  const handleLogout = () => {
    setAdminAuth(false);
    setIsAuthenticated(false);
    setPinInput('');
  };

  const handleStatusChange = (id: string, status: AdminInquiry['status']) => {
    const updated = updateInquiryStatus(id, status);
    setInquiries(updated);
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status });
    }
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

  const handleOpenEditInquiry = (inquiry: AdminInquiry) => {
    setEditingInquiry({ ...inquiry });
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

  const handleOpenCreateProject = () => {
    setEditingProject(null);
    setNewProject({
      title: '',
      clientName: '',
      category: 'Data Center & Network Infrastructure',
      year: new Date().getFullYear().toString(),
      status: 'in_progress',
      valueApprox: 'Rp 200.000.000',
      description: ''
    });
    setIsAddProjectModalOpen(true);
  };

  const handleOpenEditProject = (proj: AdminProject) => {
    setEditingProject(proj);
    setNewProject({
      title: proj.title,
      clientName: proj.clientName,
      category: proj.category,
      year: proj.year,
      status: proj.status,
      valueApprox: proj.valueApprox || '',
      description: proj.description
    });
    setIsAddProjectModalOpen(true);
  };

  const handleSaveProjectForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.clientName) {
      alert('Mohon lengkapi judul proyek dan nama instansi klien.');
      return;
    }
    if (editingProject) {
      const updatedList = updateProject({
        ...editingProject,
        ...newProject
      });
      setProjects(updatedList);
    } else {
      saveProject(newProject);
      setProjects(getStoredProjects());
    }
    setIsAddProjectModalOpen(false);
    setEditingProject(null);
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

  const filteredInquiries = inquiries.filter(item => {
    const matchesSearch = 
      item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

    // Calculate Metrics
  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter(i => i.status === 'new').length;
  const inProgressInquiries = inquiries.filter(i => i.status === 'survey' || i.status === 'contacted').length;
  const dealInquiries = inquiries.filter(i => i.status === 'deal').length;

  // Calculate Chat Metrics
  const activeChats = chatSessions.filter(s => s.status === 'active').length;
  const unreadAdminMessages = chatSessions.reduce((sum, s) => sum + s.unreadCountAdmin, 0);
  const totalChatSessions = chatSessions.length;

  // -------------------------------------------------------------
  // LOGIN SCREEN (If not authenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="w-full max-w-md relative z-10">
          {/* Card Container */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
            {/* Header Brand */}
            <div className="text-center space-y-4 mb-8">
              <div className="flex justify-center">
                <Logo size="lg" variant="cyan-gold" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 text-xs font-mono font-semibold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>INTERNAL CONTROL PANEL</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-wide font-display pt-2">
                  Portal Admin IZKATECH
                </h1>
                <p className="text-xs text-slate-500">
                  Manajemen Prospek, Estimasi Biaya &amp; Portofolio Proyek
                </p>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2 font-mono">
                  MASUKKAN KODE PIN ADMIN
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Masukkan PIN (default: 2026)"
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 text-center text-lg tracking-widest font-mono shadow-inner"
                    autoFocus
                  />
                  <KeyRound className="w-5 h-5 text-slate-500 absolute right-3.5 top-3.5" />
                </div>
                {loginError && (
                  <p className="text-xs text-rose-600 flex items-center gap-1.5 mt-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{loginError}</span>
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-lg shadow-cyan-500/25 transition-all transform active:scale-[0.98] cursor-pointer text-sm"
                >
                  Buka Dashboard Admin
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPinInput('2026');
                    setIsAuthenticated(true);
                    setAdminAuth(true);
                    setLoginError('');
                    loadData();
                  }}
                  className="w-full py-2.5 px-3 rounded-lg border border-cyan-500/40 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Akses Cepat 1-Klik (Gunakan PIN: 2026)</span>
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <button
                onClick={onBackToWebsite}
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-cyan-600 transition-colors cursor-pointer"
              >
                <ArrowUpRight className="w-3.5 h-3.5 rotate-180" />
                <span>Kembali ke Website Publik</span>
              </button>
              <span className="font-mono text-[11px] text-slate-600">v2.4 Enterprise</span>
            </div>
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
            <div className="flex items-center gap-2 min-w-0">
              <Logo size="sm" variant="cyan-gold" />
              <span className="hidden sm:inline text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-700 border border-cyan-500/30">
                ADMIN CONSOLE
              </span>
            </div>
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

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <StatsCard label="Total Prospek Masuk" value={totalInquiries} icon={Inbox} accent="cyan" sub="Formulir Web & RFP" />
              <StatsCard label="Prospek Baru" value={newInquiries} icon={Clock} accent="amber" sub="Perlu follow-up sales" onClick={() => setCurrentTab('inquiries')} />
              <StatsCard label="Survei / Negosiasi" value={inProgressInquiries} icon={Briefcase} accent="blue" sub="Penyusunan BoQ & RAB" onClick={() => setCurrentTab('inquiries')} />
              <StatsCard label="Deal / SPK" value={dealInquiries} icon={CheckCircle} accent="emerald" sub="Terkonfirmasi masuk" onClick={() => setCurrentTab('inquiries')} />
              <StatsCard label="Live Chat Aktif" value={activeChats} icon={Headphones} accent="rose" sub={`${unreadAdminMessages} belum dibalas`} onClick={() => setCurrentTab('chat')} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Recent Inquiries */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
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
                <div className="divide-y divide-slate-100">
                  {inquiries.slice(0, 5).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedInquiry(item);
                        setCurrentTab('inquiries');
                      }}
                      className="w-full text-left p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-3"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {item.clientName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">{item.clientName}</div>
                        <div className="text-[11px] text-slate-500 truncate">{item.companyName} • {item.serviceInterest[0]}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[10px] font-mono text-slate-400">{item.timestamp}</div>
                        <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                          item.status === 'new'
                            ? 'bg-amber-100 text-amber-700'
                            : item.status === 'deal'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>
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
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-600" />
                  Tindakan Cepat
                </h3>
                <button
                  onClick={() => setCurrentTab('inquiries')}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all cursor-pointer text-left"
                >
                  <span className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Buat SPH / PKS</div>
                    <div className="text-[10px] text-slate-500">Pilih prospek lalu generate dokumen</div>
                  </div>
                </button>
                <button
                  onClick={() => setCurrentTab('chat')}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all cursor-pointer text-left"
                >
                  <span className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Headphones className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Balas Live Chat</div>
                    <div className="text-[10px] text-slate-500">{unreadAdminMessages} pesan menunggu balasan</div>
                  </div>
                </button>
                <button
                  onClick={exportInquiriesToCSV}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all cursor-pointer text-left"
                >
                  <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Export Data (CSV)</div>
                    <div className="text-[10px] text-slate-500">Unduh seluruh data prospek</div>
                  </div>
                </button>
                <button
                  onClick={() => setCurrentTab('projects')}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all cursor-pointer text-left"
                >
                  <span className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Kelola Proyek</div>
                    <div className="text-[10px] text-slate-500">{projects.length} proyek portofolio</div>
                  </div>
                </button>
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

                {currentTab === 'projects' && (
          <div className="space-y-5">
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

      {/* Admin Dashboard Footer */}
      <footer className="border-t border-slate-200 py-4 text-center text-[11px] text-slate-500 font-mono">
        PT. Ihza Karya Teknologi (IZKATECH) â€¢ Dedicated Admin Console â€¢ Authorized Personnel Only
      </footer>
    </div>
  );
};

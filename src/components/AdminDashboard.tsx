import React, { useState, useEffect } from 'react';
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
  checkAdminAuth
} from '../data/adminStore.ts';
import { AdminInquiry, AdminProject } from '../types/admin.ts';
import { COMPANY_INFO, SERVICES, BRAND_PARTNERS } from '../data/companyData.ts';
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
  Edit3
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToWebsite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToWebsite }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  
  // Dashboard Navigation State
  const [currentTab, setCurrentTab] = useState<'inquiries' | 'projects' | 'services' | 'analytics'>('inquiries');
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [projects, setProjects] = useState<AdminProject[]>([]);
  
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

  useEffect(() => {
    const isAuthed = checkAdminAuth();
    setIsAuthenticated(isAuthed);
    if (isAuthed) {
      loadData();
    }
  }, []);

  const loadData = () => {
    setInquiries(getStoredInquiries());
    setProjects(getStoredProjects());
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

  // -------------------------------------------------------------
  // LOGIN SCREEN (If not authenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="w-full max-w-md relative z-10">
          {/* Card Container */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
            {/* Header Brand */}
            <div className="text-center space-y-4 mb-8">
              <div className="flex justify-center">
                <Logo size="lg" variant="cyan-gold" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>INTERNAL CONTROL PANEL</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide font-display pt-2">
                  Portal Admin IZKATECH
                </h1>
                <p className="text-xs text-slate-400">
                  Manajemen Prospek, Estimasi Biaya &amp; Portofolio Proyek
                </p>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2 font-mono">
                  MASUKKAN KODE PIN ADMIN
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="Masukkan PIN (default: 2026)"
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 text-center text-lg tracking-widest font-mono shadow-inner"
                    autoFocus
                  />
                  <KeyRound className="w-5 h-5 text-slate-500 absolute right-3.5 top-3.5" />
                </div>
                {loginError && (
                  <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-2">
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
                  className="w-full py-2.5 px-3 rounded-lg border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Akses Cepat 1-Klik (Gunakan PIN: 2026)</span>
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <button
                onClick={onBackToWebsite}
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" variant="cyan-gold" />
            <div className="hidden sm:block h-6 w-[1px] bg-slate-800" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                ADMIN CONSOLE
              </span>
              <span className="text-xs text-slate-400">PT. Ihza Karya Teknologi</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBackToWebsite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Website</span>
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Total Prospek Masuk</span>
              <Inbox className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-white font-display">
              {totalInquiries}
            </div>
            <div className="text-[11px] text-cyan-400 mt-1 font-mono">
              Formulir Web &amp; RFP
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Prospek Baru</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-amber-400 font-display">
              {newInquiries}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Perlu follow-up tim sales
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Survei / Negosiasi</span>
              <Briefcase className="w-4 h-4 text-blue-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-blue-400 font-display">
              {inProgressInquiries}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Penyusunan BoQ &amp; RAB
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Deal Proyek Selesai</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-emerald-400 font-display">
              {dealInquiries}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1">
              Terkonfirmasi SPK
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentTab('inquiries')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                currentTab === 'inquiries'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Inbox className="w-4 h-4" />
              <span>Kotak Masuk Prospek ({inquiries.length})</span>
            </button>

            <button
              onClick={() => setCurrentTab('projects')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                currentTab === 'projects'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Manajemen Proyek Portofolio ({projects.length})</span>
            </button>

            <button
              onClick={() => setCurrentTab('services')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                currentTab === 'services'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Katalog Layanan &amp; Brand</span>
            </button>
          </div>

          {currentTab === 'inquiries' && (
            <button
              onClick={exportInquiriesToCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 text-xs font-semibold transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Data ke CSV/Excel</span>
            </button>
          )}

          {currentTab === 'projects' && (
            <button
              onClick={handleOpenCreateProject}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Proyek Baru</span>
            </button>
          )}
        </div>

        {/* -------------------------------------------------------------
            TAB 1: INQUIRIES & LEADS MANAGEMENT
            ------------------------------------------------------------- */}
        {currentTab === 'inquiries' && (
          <div className="space-y-6">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama klien, instansi, nomor telepon, atau catatan..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-48 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
                >
                  <option value="all">Semua Status</option>
                  <option value="new">Baru (Belum Dihubungi)</option>
                  <option value="contacted">Sedang Dihubungi</option>
                  <option value="survey">Survei Teknis / BoQ</option>
                  <option value="deal">Deal / SPK</option>
                </select>
              </div>
            </div>

            {/* Inquiries Table / List */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Table Column */}
              <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-slate-400 font-mono border-b border-slate-800">
                      <tr>
                        <th className="p-3.5">ID / TANGGAL</th>
                        <th className="p-3.5">KLIEN &amp; PERUSAHAAN</th>
                        <th className="p-3.5">LAYANAN</th>
                        <th className="p-3.5">STATUS</th>
                        <th className="p-3.5 text-right">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredInquiries.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-500">
                            Tidak ditemukan data prospek sesuai pencarian.
                          </td>
                        </tr>
                      ) : (
                        filteredInquiries.map((item) => (
                          <tr 
                            key={item.id}
                            onClick={() => setSelectedInquiry(item)}
                            className={`cursor-pointer transition-colors ${
                              selectedInquiry?.id === item.id 
                                ? 'bg-cyan-950/30' 
                                : 'hover:bg-slate-800/40'
                            }`}
                          >
                            <td className="p-3.5 font-mono">
                              <div className="font-semibold text-cyan-400">{item.id}</div>
                              <div className="text-[10px] text-slate-500">{item.timestamp}</div>
                            </td>
                            <td className="p-3.5">
                              <div className="font-bold text-white text-sm">{item.clientName}</div>
                              <div className="text-slate-400 flex items-center gap-1 mt-0.5">
                                <Building2 className="w-3 h-3 text-slate-500" />
                                <span>{item.companyName}</span>
                              </div>
                            </td>
                            <td className="p-3.5 max-w-[200px]">
                              <div className="text-slate-300 truncate font-medium">
                                {item.serviceInterest[0]}
                              </div>
                              {item.serviceInterest.length > 1 && (
                                <div className="text-[10px] text-cyan-400 font-mono">
                                  +{item.serviceInterest.length - 1} layanan lainnya
                                </div>
                              )}
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                                item.status === 'new' 
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                                  : item.status === 'contacted'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : item.status === 'survey'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditInquiry(item)}
                                  className="p-1.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-colors cursor-pointer"
                                  title="Edit Data Klien / Prospek"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <a
                                  href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(item.clientName)},%20kami%20dari%20PT.%20Ihza%20Karya%20Teknologi%20menindaklanjuti%20permintaan%20penawaran%20Anda.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                                  title="WhatsApp Klien"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  onClick={() => handleDeleteInquiry(item.id)}
                                  className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                                  title="Hapus"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Inquiry Detail Drawer / Preview */}
              <div className="lg:col-span-4">
                {selectedInquiry ? (
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-2xl sticky top-24">
                    <div className="flex items-start justify-between border-b border-slate-800 pb-3">
                      <div>
                        <div className="text-[10px] font-mono text-cyan-400 font-semibold uppercase">
                          DETAIL PROSPEK
                        </div>
                        <h3 className="text-base font-bold text-white mt-0.5">
                          {selectedInquiry.clientName}
                        </h3>
                        <p className="text-xs text-slate-400">{selectedInquiry.companyName}</p>
                      </div>
                      <span className="text-xs font-mono text-slate-500">
                        {selectedInquiry.id}
                      </span>
                    </div>

                    {/* Quick Contact Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp</span>
                      </a>
                      <a
                        href={`mailto:${selectedInquiry.email}`}
                        className="py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Kirim Email</span>
                      </a>
                    </div>

                    {/* Status Changer */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-mono">STATUS PROSPEK:</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {(['new', 'contacted', 'survey', 'deal'] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => handleStatusChange(selectedInquiry.id, st)}
                            className={`py-1.5 px-2 rounded-lg text-xs font-mono uppercase transition-all cursor-pointer ${
                              selectedInquiry.status === st
                                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Services Requested */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-mono">LAYANAN TERPILIH:</label>
                      <div className="space-y-1">
                        {selectedInquiry.serviceInterest.map((s, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Scale & Notes */}
                    <div className="space-y-1 text-xs">
                      <div className="text-slate-400 font-mono">CATATAN SPESIFIKASI:</div>
                      <div className="p-3 rounded-xl bg-slate-950 text-slate-300 border border-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                        {selectedInquiry.notes || 'Tidak ada catatan tambahan.'}
                      </div>
                    </div>

                    {/* Action Buttons in Detail Drawer */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                        className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Hapus Prospek"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>

                      <button
                        onClick={() => handleOpenEditInquiry(selectedInquiry)}
                        className="py-2 px-4 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit Data Klien</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/50 border border-slate-800/80 border-dashed rounded-2xl p-8 text-center text-slate-500 text-xs">
                    <Eye className="w-6 h-6 mx-auto mb-2 text-slate-600" />
                    Pilih salah satu baris prospek di tabel untuk melihat detail dan mengubah status penanganan.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 2: PROJECT PORTFOLIO MANAGEMENT
            ------------------------------------------------------------- */}
        {currentTab === 'projects' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((proj) => (
                <div key={proj.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between hover:border-cyan-500/40 transition-colors shadow-lg">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {proj.id}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase ${
                        proj.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {proj.status === 'completed' ? 'SELESAI' : 'ON GOING'}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-sm sm:text-base leading-snug">
                      {proj.title}
                    </h4>
                    <div className="text-xs text-cyan-300 font-medium">
                      {proj.clientName}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                    <span>Tahun: {proj.year}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditProject(proj)}
                        className="text-cyan-400 hover:text-cyan-300 p-1.5 rounded hover:bg-cyan-500/10 transition-colors cursor-pointer"
                        title="Edit Proyek"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="text-rose-400 hover:text-rose-300 p-1.5 rounded hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Hapus Proyek"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 3: SERVICES & BRAND ECOSYSTEM OVERVIEW
            ------------------------------------------------------------- */}
        {currentTab === 'services' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-2 font-display">
                10 Pilar Solusi Teknologi IZKATECH (Official Scope)
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Daftar lingkup pekerjaan yang aktif ditawarkan di website utama dan kalkulator penawaran.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SERVICES.map((s, idx) => (
                  <div key={s.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{s.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand Partners */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-base font-bold text-white mb-2 font-display">
                Ekosistem Prinsipal Brand Resmi (20+ Partners)
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Prinsipal perangkat keras, sekuriti, dan software yang didukung oleh PT. Ihza Karya Teknologi.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {BRAND_PARTNERS.map((brand) => (
                  <div key={brand.name} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                    <div className="font-bold text-xs text-white">{brand.name}</div>
                    <div className="text-[10px] text-cyan-400 font-mono">{brand.category}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* -------------------------------------------------------------
          ADD / EDIT PROJECT MODAL
          ------------------------------------------------------------- */}
      {isAddProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-display">
                {editingProject ? `Edit Proyek (${editingProject.id})` : 'Tambah Proyek Portofolio Baru'}
              </h3>
              <button
                onClick={() => {
                  setIsAddProjectModalOpen(false);
                  setEditingProject(null);
                }}
                className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
              >
                TUTUP
              </button>
            </div>

            <form onSubmit={handleSaveProjectForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Judul Proyek</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Instalasi CCTV AI & Network Data Center"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Nama Klien / Instansi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT. PLN Nusantara Power"
                  value={newProject.clientName}
                  onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Tahun</label>
                  <input
                    type="text"
                    value={newProject.year}
                    onChange={(e) => setNewProject({ ...newProject, year: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Status</label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="in_progress">Dalam Pengerjaan</option>
                    <option value="completed">Selesai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Estimasi Nilai Kontrak (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Rp 350.000.000"
                  value={newProject.valueApprox || ''}
                  onChange={(e) => setNewProject({ ...newProject, valueApprox: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Deskripsi Pengerjaan</label>
                <textarea
                  rows={3}
                  placeholder="Spesifikasi teknis, merek perangkat, dan titik instalasi..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddProjectModalOpen(false);
                    setEditingProject(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 shadow-md cursor-pointer"
                >
                  {editingProject ? 'Simpan Perubahan' : 'Simpan Proyek'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          EDIT INQUIRY / LEAD MODAL
          ------------------------------------------------------------- */}
      {editingInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase">EDIT PROSPEK KLIEN</span>
                <h3 className="text-base font-bold text-white font-display">
                  {editingInquiry.id} - {editingInquiry.clientName}
                </h3>
              </div>
              <button
                onClick={() => setEditingInquiry(null)}
                className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
              >
                TUTUP
              </button>
            </div>

            <form onSubmit={handleSaveEditedInquiry} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Nama Klien / PIC</label>
                  <input
                    type="text"
                    required
                    value={editingInquiry.clientName}
                    onChange={(e) => setEditingInquiry({ ...editingInquiry, clientName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Instansi / Perusahaan</label>
                  <input
                    type="text"
                    required
                    value={editingInquiry.companyName}
                    onChange={(e) => setEditingInquiry({ ...editingInquiry, companyName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">No WhatsApp / Telepon</label>
                  <input
                    type="text"
                    required
                    value={editingInquiry.phone}
                    onChange={(e) => setEditingInquiry({ ...editingInquiry, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Email Klien</label>
                  <input
                    type="email"
                    required
                    value={editingInquiry.email}
                    onChange={(e) => setEditingInquiry({ ...editingInquiry, email: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Status Tahapan</label>
                  <select
                    value={editingInquiry.status}
                    onChange={(e) => setEditingInquiry({ ...editingInquiry, status: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="new">NEW (Baru Masuk)</option>
                    <option value="contacted">CONTACTED (Dihubungi)</option>
                    <option value="survey">SURVEY (Jadwal Survei / BoQ)</option>
                    <option value="deal">DEAL (Disetujui / SPK)</option>
                    <option value="archived">ARCHIVED (Diarsipkan)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Prioritas</label>
                  <select
                    value={editingInquiry.priority}
                    onChange={(e) => setEditingInquiry({ ...editingInquiry, priority: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="high">Tinggi (High Priority)</option>
                    <option value="medium">Sedang (Medium)</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Skala Proyek &amp; Estimasi</label>
                <input
                  type="text"
                  value={editingInquiry.scale || ''}
                  onChange={(e) => setEditingInquiry({ ...editingInquiry, scale: e.target.value })}
                  placeholder="Contoh: Gedung 4 Lantai / 50 Titik"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Catatan Klien &amp; Kebutuhan Teknis</label>
                <textarea
                  rows={3}
                  value={editingInquiry.notes}
                  onChange={(e) => setEditingInquiry({ ...editingInquiry, notes: e.target.value })}
                  placeholder="Rincian permintaan khusus, jadwal pertemuan, atau survei lokasi..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
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
                  className="px-3.5 py-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 flex items-center gap-1.5 cursor-pointer font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Data</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingInquiry(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
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

      {/* Admin Dashboard Footer */}
      <footer className="border-t border-slate-900 py-4 text-center text-[11px] text-slate-500 font-mono">
        PT. Ihza Karya Teknologi (IZKATECH) • Dedicated Admin Console • Authorized Personnel Only
      </footer>
    </div>
  );
};

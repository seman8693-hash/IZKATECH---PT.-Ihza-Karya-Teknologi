import React from 'react';
import { Logo } from '../Logo.tsx';
import {
  BarChart3,
  Inbox,
  Briefcase,
  Layers,
  Headphones,
  LogOut,
  ExternalLink,
  X,
} from 'lucide-react';

export type AdminTab = 'overview' | 'inquiries' | 'projects' | 'services' | 'chat';

interface SidebarCounts {
  inquiries: number;
  newInquiries: number;
  projects: number;
  chats: number;
  unreadChats: number;
}

interface AdminSidebarProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  counts: SidebarCounts;
  onLogout: () => void;
  onBackToWebsite: () => void;
  mobile?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS: { tab: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { tab: 'overview', label: 'Ringkasan', icon: BarChart3 },
  { tab: 'inquiries', label: 'Prospek & SPH/PKS', icon: Inbox },
  { tab: 'projects', label: 'Proyek Portofolio', icon: Briefcase },
  { tab: 'services', label: 'Layanan & Brand', icon: Layers },
  { tab: 'chat', label: 'Live Chat CRM', icon: Headphones },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onTabChange,
  counts,
  onLogout,
  onBackToWebsite,
  mobile = false,
  onClose,
}) => {
  return (
    <aside
      className={`${
        mobile
          ? 'fixed inset-y-0 left-0 z-[60] w-72 shadow-2xl'
          : 'hidden lg:flex sticky top-0 h-screen w-64 shrink-0'
      } bg-white border-r border-slate-200 flex-col`}
    >
      {/* Brand Block — logo IZKATECH di kartu terang (sesuai identitas resmi) */}
      <div className="p-4 border-b border-slate-100">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-cyan-50/60 to-white p-3.5 shadow-sm flex items-center gap-3">
          <Logo size="md" showSubtitle={false} className="!gap-0" />
          <div className="leading-tight min-w-0">
            <div className="text-lg font-extrabold tracking-tight text-teal-800 font-display">
              IZKATECH
            </div>
            <div className="text-[8.5px] font-bold uppercase tracking-wider text-emerald-600">
              ICT System Integrator &amp; ME
            </div>
          </div>
          {mobile && onClose && (
            <button
              onClick={onClose}
              className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="mt-2.5 flex items-center justify-center gap-2">
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
            PT. IHZA KARYA TEKNOLOGI
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="px-2 pb-2 text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">
          Menu Utama
        </div>
        {NAV_ITEMS.map(({ tab, label, icon: Icon }) => {
          const isActive = currentTab === tab;
          let badge: number | null = null;
          let badgeColor = 'bg-cyan-500';
          if (tab === 'inquiries') {
            badge = counts.inquiries;
            badgeColor = counts.newInquiries > 0 ? 'bg-amber-500' : 'bg-slate-300';
          } else if (tab === 'projects') {
            badge = counts.projects;
            badgeColor = 'bg-slate-300';
          } else if (tab === 'chat') {
            badge = counts.unreadChats > 0 ? counts.unreadChats : null;
            badgeColor = 'bg-rose-500';
          }

          return (
            <button
              key={tab}
              onClick={() => {
                onTabChange(tab);
                if (onClose) onClose();
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-teal-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-teal-600'}`} />
              <span className="flex-1 text-left">{label}</span>
              {badge !== null && (
                <span
                  className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[9px] font-mono font-bold rounded-full ${
                    isActive ? 'bg-white/25 text-white' : `${badgeColor} text-white`
                  }`}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-3 border-t border-slate-100 space-y-1.5">
        <button
          onClick={onBackToWebsite}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-teal-800 transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Lihat Website Publik</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar Portal</span>
        </button>
        <div className="pt-2 text-center text-[9px] font-mono text-slate-400">
          IZKATECH Admin v2.5 • © 2026
        </div>
      </div>
    </aside>
  );
};

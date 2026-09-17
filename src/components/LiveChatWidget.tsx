import React, { useState, useEffect, useRef } from 'react';
import { 
  getStoredChatSessions, 
  getOrCreateVisitorSession, 
  sendChatMessage, 
  markChatAsRead 
} from '../data/adminStore.ts';
import { ChatSession } from '../types/admin.ts';
import { SERVICES } from '../data/companyData.ts';
import { 
  MessageSquare, 
  X, 
  Send, 
  Headphones, 
  Building2, 
  User, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  Bot,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface LiveChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({ isOpen, onClose }) => {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Visitor Profile Form
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorCompany, setVisitorCompany] = useState('');
  const [selectedService, setSelectedService] = useState(SERVICES[0].title);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Sync session and listen to updates
  useEffect(() => {
    const loadSession = () => {
      const current = getOrCreateVisitorSession();
      setSession(current);
      if (current.messages.length > 1 || current.visitorName !== 'Tamu Pengunjung') {
        setHasStarted(true);
      }
      // Mark visitor messages as read
      markChatAsRead(current.id, 'visitor');
    };

    if (isOpen) {
      loadSession();
    }

    const handleChatUpdate = () => {
      if (isOpen) {
        loadSession();
      }
    };

    window.addEventListener('izkatech_chat_updated', handleChatUpdate);
    return () => window.removeEventListener('izkatech_chat_updated', handleChatUpdate);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [session?.messages, isOpen, isMinimized]);

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;

    const newSession = getOrCreateVisitorSession({
      name: visitorName.trim(),
      phone: visitorPhone.trim(),
      company: visitorCompany.trim(),
      service: selectedService
    });

    // Send initial inquiry message
    const initialText = `Halo tim IZKATECH, saya ${visitorName.trim()} dari ${visitorCompany.trim() || 'Perorangan'}. Saya ingin berkonsultasi mengenai ${selectedService}.`;
    sendChatMessage(newSession.id, initialText, 'visitor', visitorName.trim());

    setSession(getOrCreateVisitorSession());
    setHasStarted(true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !session) return;

    sendChatMessage(session.id, messageInput.trim(), 'visitor', session.visitorName || 'Pengunjung');
    setMessageInput('');
    setSession(getOrCreateVisitorSession());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 shadow-2xl transition-all duration-200">
      <div className="bg-slate-900/95 border border-cyan-500/30 rounded-2xl overflow-hidden backdrop-blur-xl flex flex-col shadow-cyan-950/40">
        
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 p-3.5 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                <Headphones className="w-4 h-4" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-wide">Live Support CRM</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  ONLINE
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Tim Solution Architect PT. Ihza Karya Teknologi</p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <button 
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
              title={isMinimized ? "Perbesar" : "Kecilkan"}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
            <button 
              onClick={onClose}
              className="p-1 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors cursor-pointer"
              title="Tutup Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* If visitor hasn't filled profile, show Quick Profile Form */}
            {!hasStarted ? (
              <form onSubmit={handleStartChat} className="p-4 space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-slate-300 leading-relaxed">
                  <span className="font-semibold text-cyan-300 block mb-1">💬 Konsultasi Langsung dengan Tim Ahli</span>
                  Silakan isi profil singkat Anda untuk terhubung ke CRM &amp; Engineer kami secara real-time.
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Nama Lengkap / PIC *</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Bpk. Budi Santoso"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Instansi / Perusahaan</label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Contoh: PT. Sumber Makmur atau Pribadi"
                      value={visitorCompany}
                      onChange={(e) => setVisitorCompany(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Nomor WhatsApp / Telepon</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      placeholder="Contoh: 0812-xxxx-xxxx"
                      value={visitorPhone}
                      onChange={(e) => setVisitorPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Pilih Layanan yang Diminati</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-400"
                  >
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer mt-2"
                >
                  Mulai Obrolan Langsung
                </button>
              </form>
            ) : (
              <>
                {/* Messages Body */}
                <div className="p-4 h-72 sm:h-80 overflow-y-auto space-y-3 text-xs bg-slate-950/40">
                  {session?.messages.map((msg) => {
                    const isVisitor = msg.sender === 'visitor';
                    const isSystem = msg.sender === 'system';

                    if (isSystem) {
                      return (
                        <div key={msg.id} className="text-center my-2">
                          <span className="inline-block px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/20 text-[10px] text-cyan-300">
                            {msg.text}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isVisitor ? 'items-end' : 'items-start'}`}
                      >
                        <span className="text-[10px] text-slate-500 mb-0.5 px-1 font-mono">
                          {isVisitor ? 'Anda' : msg.senderName} • {msg.timestamp}
                        </span>
                        <div
                          className={`max-w-[85%] p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                            isVisitor
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium rounded-tr-xs shadow-md'
                              : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-xs shadow-md'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Footer */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Tulis pesan atau pertanyaan teknis..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="p-2.5 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow"
                    title="Kirim Pesan"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </>
            )}

            {/* Micro footer */}
            <div className="px-3 py-1.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                Enkripsi Aman CRM
              </span>
              <span>Respon Rata-rata &lt;5 Menit</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

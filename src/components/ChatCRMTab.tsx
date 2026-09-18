import React, { useRef, useEffect } from 'react';
import { ChatSession } from '../types/admin.ts';
import {
  Headphones,
  MessageSquare,
  RefreshCw,
  Archive,
  Users,
  CheckCircle2,
  Clock,
  Trash2,
  Send,
} from 'lucide-react';

interface ChatCRMTabProps {
  chatSessions: ChatSession[];
  selectedChatSession: ChatSession | null;
  adminMessageInput: string;
  setAdminMessageInput: (val: string) => void;
  onSelectSession: (session: ChatSession) => void;
  onSendAdminMessage: (e: React.FormEvent) => void;
  onRefresh: () => void;
  onResolveChat: (session: ChatSession) => void;
  onDeleteChatSession: (session: ChatSession) => void;
}

export const ChatCRMTab: React.FC<ChatCRMTabProps> = ({
  chatSessions,
  selectedChatSession,
  adminMessageInput,
  setAdminMessageInput,
  onSelectSession,
  onSendAdminMessage,
  onRefresh,
  onResolveChat,
  onDeleteChatSession,
}) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedChatSession) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChatSession?.messages, selectedChatSession?.id]);

  const sortedSessions = chatSessions
    .slice()
    .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Chat Session List (Left Panel) */}
      <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[600px]">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Headphones className="w-4 h-4 text-cyan-400" />
            <span>Sesi Live Chat ({chatSessions.length})</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-600">CRM v2.4</span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-800">
          {chatSessions.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p>Belum ada sesi chat masuk.</p>
            </div>
          ) : (
            sortedSessions.map((session) => {
              const isActive = session.status === 'active';
              const hasUnread = session.unreadCountAdmin > 0;
              return (
                <div
                  key={session.id}
                  onClick={() => onSelectSession(session)}
                  className={`p-3 cursor-pointer transition-all border-l-2 ${
                    selectedChatSession?.id === session.id
                      ? 'bg-cyan-950/30 border-cyan-400'
                      : 'bg-transparent border-transparent hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">
                          {session.visitorName}
                        </span>
                        {hasUnread && (
                          <span className="flex items-center justify-center w-4 h-4 text-[9px] font-mono font-bold text-white bg-rose-500 rounded-full shrink-0">
                            {session.unreadCountAdmin}
                          </span>
                        )}
                      </div>
                      {session.visitorCompany && (
                        <div className="text-[10px] text-cyan-300 font-medium truncate">
                          {session.visitorCompany}
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                        {session.messages.length > 0
                          ? session.messages[session.messages.length - 1].text
                          : 'Belum ada pesan.'}
                      </div>
                      {session.serviceInterest && (
                        <div className="text-[9px] text-slate-500 mt-0.5 truncate">
                          {session.serviceInterest.split('(')[0].trim()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1.5 gap-2">
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-500/20 text-slate-400 border border-slate-600'
                    }`}>
                      {session.status === 'active' ? 'AKTIF' : 'SELESAI'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {session.lastActive}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Chat list actions footer */}
        <div className="p-3 border-t border-slate-800 flex gap-2 text-xs">
          <button
            onClick={onRefresh}
            className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-colors cursor-pointer font-mono text-[10px]"
            title="Segarkan Sesi Chat"
          >
            <RefreshCw className="w-3 h-3 inline mr-1" />
            Refresh
          </button>
          {selectedChatSession && (
            <button
              onClick={() => onDeleteChatSession(selectedChatSession)}
              className="flex-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer font-mono text-[10px]"
              title="Arsipkan Chat"
            >
              <Archive className="w-3 h-3 inline mr-1" />
              Arsipkan
                          </button>
          )}
        </div>
      </div>

      {/* Chat Conversation Panel (Right Panel) */}
      <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[600px]">
        {selectedChatSession ? (
          <>
            {/* Conversation Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-white">
                      {selectedChatSession.visitorName}
                    </h4>
                    {selectedChatSession.status === 'active' ? (
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.5 rounded-full">
                        ONLINE
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded-full">
                        RESOLVED
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {selectedChatSession.visitorCompany ||
                      selectedChatSession.visitorPhone ||
                      selectedChatSession.visitorEmail ||
                      ''}
                  </div>
                                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onResolveChat(selectedChatSession)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    selectedChatSession.status === 'active'
                      ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30'
                      : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30'
                  }`}
                  title={selectedChatSession.status === 'active' ? 'Tandai Selesai' : 'Aktifkan Ulang'}
                >
                  {selectedChatSession.status === 'active' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => onDeleteChatSession(selectedChatSession)}
                  className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer"
                  title="Hapus Chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div
              ref={messagesEndRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-slate-950/40"
            >
              {selectedChatSession.messages.map((msg) => {
                const isVisitor = msg.sender === 'visitor';
                const isSystem = msg.sender === 'system';

                if (isSystem) {
                  return (
                    <div key={msg.id} className="text-center my-2">
                      <span className="inline-block px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-[10px] text-slate-400">
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
                      {isVisitor ? 'Pengunjung' : msg.senderName} • {msg.timestamp}
                    </span>
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                        isVisitor
                          ? 'bg-slate-800/90 text-slate-200 border border-slate-700 rounded-tr-xs shadow-md'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-medium rounded-tl-xs shadow-md'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Admin Reply Input */}
            <form
              onSubmit={onSendAdminMessage}
              className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2"
            >
              <input
                type="text"
                value={adminMessageInput}
                onChange={(e) => setAdminMessageInput(e.target.value)}
                placeholder="Ketik balasan Anda kepada pengunjung..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                maxLength={1000}
              />
              <button
                type="submit"
                disabled={!adminMessageInput.trim()}
                className="p-2.5 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow"
                title="Kirim Balasan"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
            <Headphones className="w-10 h-10 mx-auto mb-3 text-slate-600" />
            <p className="text-xs">Pilih sesi chat dari panel kiri untuk memulai.</p>
          </div>
        )}
      </div>
    </div>
  );
};


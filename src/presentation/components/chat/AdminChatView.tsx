"use client";

import { useAdminChatStore } from "@/src/presentation/stores/admin-chat-store";
import { Bot, Loader2, Send, UserCircle2, ArrowLeft, MessageSquare, Search, X, CheckCircle2, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "@/src/presentation/components/chat/ChatMessage";
import Link from 'next/link';

interface AdminChatViewProps {
  sessionId: string;
  customerName: string;
}

export function AdminChatView({ sessionId, customerName }: AdminChatViewProps) {
  const {
    messages,
    searchResults,
    isLoading,
    setSessionId,
    syncMessages,
    sendReply,
    markAsRead,
    searchMessages,
    clearSearch,
    toggleAutoReply,
    autoReply,
    updateSessionStatus,
    closeSession,
    error
  } = useAdminChatStore();

  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize for admin
  useEffect(() => {
    setSessionId(sessionId);
    syncMessages(); // Initial sync
  }, [sessionId, setSessionId, syncMessages]);

  // Mark as read when messages update (from user)
  useEffect(() => {
    const hasUnread = messages.some(m => m.role === "user" && m.status !== "read");
    if (hasUnread) {
      markAsRead();
    }
  }, [messages, markAsRead]);

  // Poll for new messages
  useEffect(() => {
    const interval = setInterval(() => {
      // Don't sync if we are in search mode
      if (!searchResults) {
        syncMessages();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [syncMessages, searchResults]);

  useEffect(() => {
    if (!searchResults) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, searchResults]);

  const handleAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const content = input.trim();
    setInput("");
    await sendReply(content);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchMessages(searchQuery.trim());
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    clearSearch();
  };

  const activeMessages = searchResults || messages;

  return (
    <div className="flex flex-col h-screen bg-background transition-colors duration-500 overflow-hidden">
      {/* Admin Header: Premium Glass Design */}
      <header className="glass-subtle px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between shadow-lg z-20 gap-4 border-b border-white/20">
        <div className="flex items-center gap-5 flex-1">
          <Link href="/admin/chat" className="p-2.5 glass hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm group active:scale-90">
            <ArrowLeft className="w-5 h-5 text-text-muted group-hover:text-white" />
          </Link>
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center shrink-0 border border-white/40 shadow-inner">
            <UserCircle2 className="w-8 h-8 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-black text-text-primary leading-tight truncate tracking-tight">
              คุณ {customerName}
            </h1>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-success rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              <span className="text-[10px] text-text-muted font-black tracking-widest uppercase opacity-60">SESSION: {sessionId.slice(0, 8)}</span>
            </div>
          </div>
        </div>

        {/* Feature Controls: Semantic & Interactive */}
        <div className="flex items-center flex-wrap gap-4 w-full md:w-auto">
          {/* Search Bar: Glass Subtle */}
          <form onSubmit={handleSearch} className="relative flex-1 md:w-72 max-w-sm group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาในบทสนทนา..."
              className="w-full pl-10 pr-10 py-2.5 glass rounded-xl text-sm font-bold text-text-primary focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-text-muted/50 border-white/30"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-error/10 hover:text-error rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* AI Toggle: Secondary Accent */}
          <div className="flex items-center gap-2.5 bg-secondary/10 px-4 py-2 rounded-xl border border-secondary/20 shadow-sm">
            <Bot className={`w-4.5 h-4.5 ${autoReply ? 'text-secondary-dark' : 'text-text-muted'}`} />
            <span className="text-[10px] font-black text-secondary-dark uppercase tracking-tighter">AI Assistant</span>
            <button 
              onClick={() => toggleAutoReply(!autoReply)}
              className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all focus:outline-none shadow-inner ${autoReply ? 'bg-secondary' : 'bg-text-muted/30'}`}
            >
              <span className={`inline-block h-4 w-4 transform bg-white rounded-full transition-transform shadow-md ${autoReply ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          {/* Status Dropdown: Semantic Tokens */}
          <div className="relative">
            <select 
              onChange={(e) => updateSessionStatus(e.target.value)}
              className="appearance-none glass rounded-xl pl-4 pr-10 py-2.5 text-xs font-black text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm hover:border-primary/30 transition-all border-white/30 uppercase tracking-widest"
            >
              <option value="active">💬 ACTIVE</option>
              <option value="follow_up">⭐ FOLLOW-UP</option>
              <option value="spam">🚫 SPAM</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          </div>

          <button 
            onClick={() => closeSession()}
            className="btn-game px-5 py-2.5 text-xs flex items-center gap-2 group"
          >
            <CheckCircle2 className="w-4.5 h-4.5 group-hover:rotate-12 transition-transform" />
            <span>RESOLVE</span>
          </button>
        </div>
      </header>

      {/* Chat Messages Area: Animated & Spaced */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 max-w-5xl mx-auto w-full custom-scrollbar animate-in fade-in duration-1000">
        {searchResults && (
          <div className="px-6 py-3 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-between animate-in slide-in-from-top-4 duration-500 shadow-lg backdrop-blur-md">
            <span className="text-xs font-black text-primary uppercase tracking-tight">
              🔍 ผลการค้นหาสำหรับ: &quot;{searchQuery}&quot;
            </span>
            <button onClick={handleClearSearch} className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">
              X ล้างการค้นหา
            </button>
          </div>
        )}

        {activeMessages.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-text-muted opacity-40 animate-pulse">
            <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-6 shadow-inner">
               <MessageSquare className="w-12 h-12" />
            </div>
            <p className="text-sm font-black uppercase tracking-widest">เริ่มบทสนทนาใหม่</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {activeMessages.map((message, idx) => (
              <div 
                key={message.id} 
                className={`flex w-full animate-in fade-in slide-in-from-bottom-2 duration-500`}
                style={{ animationDelay: `${Math.min(idx * 50, 500)}ms` }}
              >
                  <ChatMessage message={message} isMe={message.role === "admin"} />
              </div>
            ))}
            {isLoading && !searchResults && (
              <div className="flex items-center gap-2.5 text-primary text-xs font-black ml-4 animate-pulse">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                </div>
                <span className="uppercase tracking-widest">กำลังพิมพ์...</span>
              </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </main>

      {/* Admin Input Panel: Floating Glass Design */}
      <footer className="p-6 md:p-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleAdminReply} className="flex gap-4 p-2 glass rounded-[2.5rem] shadow-2xl border-white/40 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => {
                if (searchResults) handleClearSearch();
              }}
              placeholder={searchResults ? "ย้อนลับสู่โหมดแชทเพื่อตอบกลับ..." : "พิมพ์ข้อความตอบกลับในฐานะ Admin..."}
              className="flex-1 bg-transparent border-none rounded-3xl px-6 py-4 focus:outline-none text-sm md:text-base font-bold text-text-primary placeholder:text-text-muted/40"
              disabled={isLoading || !!searchResults}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading || !!searchResults}
              className="btn-game !px-0 w-16 h-16 !rounded-3xl flex items-center justify-center shadow-primary/40 active:scale-90 group transition-all"
            >
              <Send className="w-7 h-7 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        </div>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--color-primary), 0.1);
          border-radius: 20px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--color-primary), 0.2);
        }
      `}</style>
    </div>
  );
}

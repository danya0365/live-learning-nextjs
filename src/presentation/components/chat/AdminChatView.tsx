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
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm z-10 gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Link href="/admin/chat" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
            <UserCircle2 className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-gray-900 leading-tight truncate">
              {customerName}
            </h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-gray-500 font-mono uppercase">ID: {sessionId.slice(0, 8)}</span>
            </div>
          </div>
        </div>

        {/* Feature Controls */}
        <div className="flex items-center flex-wrap gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative flex-1 md:w-64 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาข้อความ..."
              className="w-full pl-9 pr-8 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
              >
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
          </form>

          {/* AI Toggle */}
          <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
            <Bot className={`w-4 h-4 ${autoReply ? 'text-indigo-600' : 'text-gray-400'}`} />
            <span className="text-xs font-semibold text-indigo-700">AI</span>
            <button 
              onClick={() => toggleAutoReply(!autoReply)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${autoReply ? 'bg-indigo-600' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-3 w-3 transform bg-white rounded-full transition-transform ${autoReply ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Status Dropdown */}
          <div className="relative group">
            <select 
              onChange={(e) => updateSessionStatus(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm hover:border-gray-300 transition-all"
            >
              <option value="active">💬 ACTIVE</option>
              <option value="follow_up">⭐ FOLLOW-UP</option>
              <option value="spam">🚫 SPAM</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>

          <button 
            onClick={() => closeSession()}
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span className="hidden sm:inline">RESOLVE</span>
          </button>
        </div>
      </header>

      {/* Chat Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 max-w-5xl mx-auto w-full custom-scrollbar">
        {searchResults && (
          <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="text-xs font-bold text-indigo-700">ผลการค้นหาสำหรับ &quot;{searchQuery}&quot;</span>
            <button onClick={handleClearSearch} className="text-[10px] text-indigo-600 hover:underline">ล้างการค้นหา</button>
          </div>
        )}

        {activeMessages.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50">
            <MessageSquare className="w-16 h-16 mb-4" />
            <p className="text-sm font-medium">ไม่พบข้อความ</p>
          </div>
        ) : (
          <>
            {activeMessages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'admin' || message.role === 'assistant' ? 'justify-end' : 'justify-start'}`}>
                  <ChatMessage message={message} />
              </div>
            ))}
            {isLoading && !searchResults && (
              <div className="flex items-center gap-2 text-gray-400 text-xs ml-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>กำลังดำเนินการ...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </main>

      {/* Admin Input Panel */}
      <footer className="bg-white border-t border-gray-200 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <form onSubmit={handleAdminReply} className="max-w-5xl mx-auto flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => {
              if (searchResults) handleClearSearch();
            }}
            placeholder={searchResults ? "ย้อนลับสู่โหมดแชทเพื่อตอบกลับ..." : "พิมพ์ข้อความตอบกลับในฐานะ Admin..."}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm md:text-base text-gray-700 shadow-inner"
            disabled={isLoading || !!searchResults}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || !!searchResults}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white p-4 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center aspect-square"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
}

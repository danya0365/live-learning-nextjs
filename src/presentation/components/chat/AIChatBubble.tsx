"use client";

/**
 * AI Chat Bubble Component
 * Floating chat bubble that appears on all pages
 */

import { useChatStore } from "@/src/presentation/stores/chat-store";
import { Bot, Loader2, MessageCircle, Phone, Send, UserCircle2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "./ChatMessage";

export function AIChatBubble() {
  // --- STORE ---
  const {
    messages,
    isOpen,
    isLoading,
    sessionId,
    customerInfo,
    error,
    toggleChat,
    sendMessage,
    syncMessages,
    registerCustomer,
    hasMoreHistory,
    loadMoreHistory,
    markAsRead
  } = useChatStore();

  // --- LOCAL STATE ---
  const [input, setInput] = useState("");
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Poll for new messages (sync with Turso & LINE)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen) {
      // Immediate sync when opened
      syncMessages();
      // Poll every 5 seconds
      interval = setInterval(() => {
        syncMessages();
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, syncMessages]);

  // Scroll to bottom when new messages arrive and mark as read
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (isOpen) {
       const hasUnread = messages.some(m => m.role !== "user" && m.status !== "read");
       if (hasUnread) {
          markAsRead();
       }
    }
  }, [messages, isOpen, markAsRead]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput("");
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) return;
    await registerCustomer(regName.trim(), regPhone.trim());
  };

  // Condition to check if customer is fully registered
  const isRegistered = !!sessionId && !!customerInfo;

  return (
    <div className="ai-chat fixed bottom-6 right-6 z-[9999]">
      {/* Chat Window: Premium Glass Design */}
      {isOpen && (
        <div className="ai-chat__window absolute bottom-20 right-0 w-[380px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-140px)] glass rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border-border">
          
          {/* Header: Solid Brand Identity */}
          <div className="ai-chat__header w-full shrink-0">
            <div className="ai-chat__header-info">
              <div className="ai-chat__header-avatar">
                <Bot className="ai-chat__header-icon" />
              </div>
              <div className="ai-chat__header-text text-left">
                <h3 className="ai-chat__header-title font-black tracking-tight leading-none">Clean Assistant</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                  <span className="ai-chat__header-status font-black uppercase tracking-widest">
                    Online Now
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="p-2 hover:bg-white/10 rounded-xl transition-all active:scale-90"
              aria-label="ปิดแชท"
            >
              <X className="w-4.5 h-4.5 text-white" />
            </button>
          </div>

          {/* Body: Registration or Chat Messages */}
          <div className="ai-chat__messages flex-1 overflow-y-auto p-5 custom-scrollbar bg-background/5">
            {!isRegistered ? (
              <div className="flex flex-col items-center justify-center p-4 h-full text-center animate-in fade-in duration-700">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/20">
                  <Bot className="w-10 h-10 text-primary animate-pulse" />
                </div>
                <h4 className="text-2xl font-black gradient-text tracking-tighter mb-2 text-left">ยินดีต้อนรับครับ! ✨</h4>
                <p className="text-sm font-bold text-text-muted mb-8 leading-relaxed px-4 text-center">
                  กรุณาระบุข้อมูลเพื่อเชื่อมต่อกับทีมงาน <br/>
                  <span className="text-xs opacity-60">ระบุเบอร์เดิมเพื่อเรียกดูประวัติแชท</span>
                </p>
                
                <form onSubmit={handleRegister} className="w-full flex flex-col gap-4 max-w-[280px]">
                  <div className="relative group">
                    <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      placeholder="ชื่อของคุณ"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                      disabled={isLoading}
                      className="w-full pl-12 pr-4 py-3.5 glass rounded-2xl text-sm font-bold text-text-primary focus:ring-2 focus:ring-primary/20 transition-all border-border placeholder:text-text-muted/50"
                    />
                  </div>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                    <input 
                      type="tel" 
                      placeholder="เบอร์โทรศัพท์"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      required
                      disabled={isLoading}
                      className="w-full pl-12 pr-4 py-3.5 glass rounded-2xl text-sm font-bold text-text-primary focus:ring-2 focus:ring-primary/20 transition-all border-border placeholder:text-text-muted/50"
                    />
                  </div>

                  {error && <p className="text-[10px] font-black text-error text-left mt-1 uppercase tracking-widest animate-in shake duration-300">⚠️ {error}</p>}

                  <button 
                    type="submit" 
                    disabled={isLoading || !regName || !regPhone}
                    className="btn-game w-full mt-4 py-4 text-sm flex items-center justify-center gap-3 shadow-xl shadow-primary/30 active:scale-95"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                    เริ่มการสนทนา
                  </button>
                </form>
              </div>
            ) : messages.length === 0 ? (
              <div className="ai-chat__welcome h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-1000">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-primary/20 rotate-12">
                  <Bot className="w-10 h-10 text-white -rotate-12" />
                </div>
                <h4 className="text-xl font-black text-text-primary tracking-tight mb-2">สวัสดีคุณ {customerInfo.name}! 👋</h4>
                <p className="text-sm font-bold text-text-muted leading-relaxed mb-10 px-6">
                  ผมเป็นผู้ช่วยอัจฉริยะของคุณครับ <br/>
                  มีอะไรให้ผมช่วยเรื่องบริการหรือโปรเจคไหมครับ?
                </p>
                <div className="flex flex-col gap-3 w-full max-w-[240px]">
                  {[
                    { label: "🛠️ กองทัพบริการของเรา", query: "มีบริการอะไรบ้าง?" },
                    { label: "📂 ขอดูผลงานล่าสุด", query: "ดูผลงานล่าสุด" },
                    { label: "📞 ช่องทางติดต่อทีมงาน", query: "ติดต่อได้อย่างไร?" }
                  ].map((s) => (
                    <button
                      key={s.query}
                      onClick={() => sendMessage(s.query)}
                      className="w-full glass hover:bg-primary/5 border-border/40 hover:border-primary/20 py-3 px-4 rounded-2xl text-xs font-black text-text-secondary transition-all active:scale-95 text-left flex items-center justify-between group"
                    >
                      {s.label}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {hasMoreHistory && (
                  <div className="flex justify-center my-4">
                    <button 
                      onClick={() => loadMoreHistory()}
                      disabled={isLoading}
                      className="text-[10px] font-black glass border-border/50 hover:bg-white/40 text-text-muted py-2 px-6 rounded-full transition-all flex items-center gap-2 uppercase tracking-widest"
                    >
                      {isLoading ? <Loader2 className="w-3 h-3 animate-spin"/> : "โหลดข้อความเดิม"}
                    </button>
                  </div>
                )}
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} isMe={message.role === "user"} />
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2.5 text-primary text-xs font-black ml-4 animate-pulse">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
              </div>
            )}
          </div>

          {/* Input Box: High Gloss Floating Bar */}
          {isRegistered && (
            <div className="p-5 shrink-0 relative z-10 border-t border-border/40 bg-background/20">
              <form onSubmit={handleSubmit} className="flex gap-3 p-1.5 glass rounded-[2rem] shadow-2xl border-border focus-within:ring-4 focus-within:ring-primary/10 transition-all bg-surface/50">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="ถามอะไรมาก็ได้นะครับ..."
                  className="flex-1 bg-transparent border-none rounded-2xl px-4 py-3 text-sm font-bold text-text-primary focus:outline-none placeholder:text-text-muted"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="btn-game !px-0 w-12 h-12 !rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 active:scale-90 transition-all group"
                  disabled={!input.trim() || isLoading}
                  aria-label="ส่งข้อความ"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Floating Button: High Impact Action */}
      <button
        onClick={toggleChat}
        className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/40 transition-all active:scale-95 group relative ${isOpen ? "rotate-90" : "animate-bounce hover:animate-none"}`}
        aria-label={isOpen ? "ปิดแชท" : "เปิดแชท"}
      >
        <div className="absolute inset-0 bg-white/20 rounded-[1.5rem] animate-pulse pointer-events-none" />
        {isOpen ? (
          <X className="w-8 h-8 text-white transition-transform group-hover:scale-110" />
        ) : (
          <div className="relative">
             <MessageCircle className="w-8 h-8 text-white transition-transform group-hover:scale-110" />
             {/* Simple Dot for notification can be added here if needed */}
          </div>
        )}
      </button>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--color-primary), 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--color-primary), 0.2);
        }
      `}</style>
    </div>
  );
}

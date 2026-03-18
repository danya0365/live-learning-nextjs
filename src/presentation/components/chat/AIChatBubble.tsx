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
    <div className="ai-chat">
      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat__window">
          {/* Header */}
          <div className="ai-chat__header">
            <div className="ai-chat__header-info">
              <div className="ai-chat__header-avatar">
                <Bot className="ai-chat__header-icon" />
              </div>
              <div className="ai-chat__header-text">
                <h3 className="ai-chat__header-title">Clean Assistant</h3>
                <span className="ai-chat__header-status">
                  เลขาส่วนตัวของคุณ
                </span>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="ai-chat__close-btn"
              aria-label="ปิดแชท"
            >
              <X className="ai-chat__close-icon" />
            </button>
          </div>

          {/* Messages or Registration View */}
          <div className="ai-chat__messages">
            {!isRegistered ? (
              <div className="flex flex-col items-center justify-center p-6 h-full text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Bot className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">สวัสดีครับ!</h4>
                <p className="text-sm text-gray-500 mb-6">กรุณากรอกข้อมูลเพื่อเริ่มสนทนากับเรา หรือพิมพ์เบอร์เดิมเพื่อดึงประวัติแชท</p>
                
                <form onSubmit={handleRegister} className="w-full flex flex-col gap-3">
                  <div className="relative">
                    <UserCircle2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="ชื่อของคุณ"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input 
                      type="tel" 
                      placeholder="เบอร์โทรศัพท์"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      required
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  {error && <p className="text-xs text-red-500 text-left">{error}</p>}

                  <button 
                    type="submit" 
                    disabled={isLoading || !regName || !regPhone}
                    className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    เริ่มคุยกันเลย
                  </button>
                </form>
              </div>
            ) : messages.length === 0 ? (
              <div className="ai-chat__welcome">
                <div className="ai-chat__welcome-avatar">
                  <Bot className="ai-chat__welcome-icon" />
                </div>
                <h4 className="ai-chat__welcome-title">สวัสดีคุณ {customerInfo.name}! 👋</h4>
                <p className="ai-chat__welcome-text">
                  ผม Clean Assistant เลขาส่วนตัวของ Clean Code 1986 ครับ
                  <br />
                  ยินดีช่วยเหลือเรื่องบริการ โปรเจค หรือข้อมูลอื่นๆ ครับ
                </p>
                <div className="ai-chat__suggestions">
                  <button
                    onClick={() => sendMessage("มีบริการอะไรบ้าง?")}
                    className="ai-chat__suggestion-btn"
                  >
                    🛠️ ดูบริการ
                  </button>
                  <button
                    onClick={() => sendMessage("ดูผลงานล่าสุด")}
                    className="ai-chat__suggestion-btn"
                  >
                    📁 ดูผลงาน
                  </button>
                  <button
                    onClick={() => sendMessage("ติดต่อได้อย่างไร?")}
                    className="ai-chat__suggestion-btn"
                  >
                    📞 ติดต่อเรา
                  </button>
                </div>
              </div>
            ) : (
              <>
                {hasMoreHistory && (
                  <div className="flex justify-center my-4">
                    <button 
                      onClick={() => loadMoreHistory()}
                      disabled={isLoading}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-1.5 px-4 rounded-full transition-colors flex items-center gap-2"
                    >
                      {isLoading ? <Loader2 className="w-3 h-3 animate-spin"/> : null}
                      {isLoading ? "กำลังโหลด..." : "โหลดข้อความก่อนหน้า"}
                    </button>
                  </div>
                )}
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="ai-chat__loading">
                    <Loader2 className="ai-chat__loading-icon" />
                    <span>กำลังพิมพ์...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Box (Hidden until Registered) */}
          {isRegistered && (
            <form onSubmit={handleSubmit} className="ai-chat__form">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="พิมพ์ข้อความ..."
                className="ai-chat__input"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="ai-chat__send-btn"
                disabled={!input.trim() || isLoading}
                aria-label="ส่งข้อความ"
              >
                <Send className="ai-chat__send-icon" />
              </button>
            </form>
          )}
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className={`ai-chat__bubble ${isOpen ? "ai-chat__bubble--open" : ""}`}
        aria-label={isOpen ? "ปิดแชท" : "เปิดแชท"}
      >
        {isOpen ? (
          <X className="ai-chat__bubble-icon" />
        ) : (
          <MessageCircle className="ai-chat__bubble-icon" />
        )}
      </button>
    </div>
  );
}

"use client";

import { useAdminChatRoomPresenter } from "@/src/presentation/presenters/admin-chat/useAdminChatRoomPresenter";
import { AdminChatRoomViewModel } from "@/src/presentation/presenters/admin-chat/AdminChatRoomPresenter";
import { Bot, Loader2, Send, UserCircle2, ArrowLeft, MessageSquare, Search, X, CheckCircle2, ChevronDown, Inbox, Clock } from "lucide-react";
import { ChatMessage } from "@/src/presentation/components/chat/ChatMessage";
import Link from 'next/link';

interface AdminChatViewProps {
  sessionId: string;
  initialViewModel?: AdminChatRoomViewModel;
}

/**
 * AdminChatView - UI component for a single admin chat room.
 * This is now a "Truly Thin View" - 100% logic-free.
 * No local state, no effects, no refs. All managed by useAdminChatRoomPresenter.
 */
export function AdminChatView({ sessionId, initialViewModel }: AdminChatViewProps) {
  // ✅ 100% of logic, state, and actions provided by the hook
  const [state, actions] = useAdminChatRoomPresenter(sessionId, initialViewModel);

  const viewModel = state.viewModel;
  const activeMessages = state.searchResults || state.messages;

  // ✅ 1. Loading State (Pure Template)
  if (state.loading && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-medium font-th">
                กำลังโหลดข้อมูลห้องสนทนา...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ 2. Error State (Pure Template)
  if (state.error && !viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-red-600 dark:text-red-400 font-medium mb-2 font-th">
                เกิดข้อผิดพลาด
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6 font-th text-sm">
                {state.error}
              </p>
              <button
                onClick={actions.loadData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-bold font-th"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ 3. Empty/No Session State (Pure Template)
  if (!viewModel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 text-center font-th">
         <Inbox className="h-16 w-16 text-gray-400 mx-auto mb-4" />
         <p className="text-gray-600 dark:text-gray-400 font-medium tracking-tight">ไม่พบข้อมูลห้องสนทนา</p>
      </div>
    );
  }

  // ✅ 4. Success View - Logic-free JSX mapping
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8 h-screen max-h-screen overflow-hidden">
        
        {/* Header Section */}
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
             <Link href="/admin/chat" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group">
               <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
             </Link>
             <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 font-th">
                  คุณ {viewModel.customerName || "Customer"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                  ID: {sessionId.toUpperCase()}
                </p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => actions.closeSession()}
               className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-md"
             >
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-th">จบการสนทนา</span>
             </button>
          </div>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 flex items-center">
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 shadow-inner">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="ml-5">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 font-th">ข้อความทั้งหมด</p>
              <p className="text-2xl font-black text-gray-900 dark:text-gray-100">{viewModel.stats?.totalMessages ?? 0}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 flex items-center">
            <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 shadow-inner">
              <Clock className="w-6 h-6" />
            </div>
            <div className="ml-5">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 font-th">อัปเดตล่าสุด</p>
              <p className="text-xl font-black text-gray-900 dark:text-gray-100 antialiased">{actions.formatDate(viewModel.stats?.lastActive)}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 flex items-center">
            <div className="p-3.5 rounded-2xl bg-green-50 dark:bg-green-900/30 text-green-600 shadow-inner">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="ml-5">
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 font-th">สถานะ</p>
              <span className={`px-4 py-1.5 rounded-xl text-xs font-black border tracking-tight ${actions.getStatusColor(viewModel.status || "active")}`}>
                {actions.formatStatus(viewModel.status || "active")}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section (Chat Room) */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden relative">
          
          <div className="px-8 py-5 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center shrink-0 gap-4">
             <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                <h2 className="font-black text-gray-900 dark:text-gray-100 font-th text-lg">การสนทนาในขณะนี้</h2>
             </div>
             <div className="flex items-center flex-wrap gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-2.5 bg-gray-50 dark:bg-gray-900/50 px-4 py-2.5 rounded-2xl border border-gray-100 dark:border-gray-700 text-xs">
                   <Bot className={`w-5 h-5 ${state.autoReply ? 'text-blue-600' : 'text-gray-400'}`} />
                   <span className="font-black text-gray-500 dark:text-gray-400 uppercase tracking-tighter">AI Assistant</span>
                   <button 
                     onClick={() => actions.toggleAutoReply(!state.autoReply)}
                     className={`w-10 h-5 rounded-full relative transition-all shadow-inner ${state.autoReply ? 'bg-blue-600 shadow-blue-500/30' : 'bg-gray-300'}`}
                   >
                     <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${state.autoReply ? 'right-0.5' : 'left-0.5'}`} />
                   </button>
                </div>

                <form onSubmit={actions.handleSearch} className="relative group flex-1 sm:flex-none">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text"
                    placeholder="ค้นหาข้อความ..."
                    value={state.searchQuery}
                    onChange={(e) => actions.setSearchQuery(e.target.value)}
                    className="pl-11 pr-10 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all placeholder:text-gray-400 font-th w-full"
                  />
                  {state.searchQuery && (
                    <button type="button" onClick={actions.clearSearch} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 rounded-lg">
                       <X className="w-4 h-4" />
                    </button>
                  )}
                </form>

                <select 
                  value={viewModel.status || "active"}
                  onChange={(e) => actions.updateSessionStatus(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-2.5 text-xs font-black focus:outline-none transition-all cursor-pointer hover:bg-gray-100"
                >
                   <option value="active">ACTIVE</option>
                   <option value="follow_up">FOLLOW-UP</option>
                   <option value="spam">SPAM</option>
                   <option value="resolved">RESOLVED</option>
                </select>
             </div>
          </div>

          {/* Chat Scrolling Area (Managed Ref from actions) */}
          <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-50/20 dark:bg-gray-900/10 content-start custom-scrollbar">
             {state.searchResults && (
               <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-[1.5rem] flex justify-between items-center text-sm shadow-sm animate-in slide-in-from-top-4 duration-300">
                  <span className="font-bold text-blue-700 font-th">🔍 ผลการค้นหาสำหรับ: &quot;{state.searchQuery}&quot; ({state.searchResults.length})</span>
                  <button onClick={actions.clearSearch} className="text-gray-500 hover:text-blue-600 hover:underline font-th font-bold">ล้างผลการค้นหา</button>
               </div>
             )}

             {activeMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-80 grayscale opacity-30 font-th animate-pulse">
                   <MessageSquare className="w-16 h-16 mb-4" />
                   <p className="font-black text-base uppercase tracking-widest">ยังไม่มีข้อความส่งมาในตอนนี้</p>
                </div>
             ) : (
                <div className="flex flex-col gap-8 w-full">
                   {activeMessages.map((message) => (
                      <ChatMessage key={message.id} message={message} isMe={message.role === "admin"} />
                   ))}
                   {/* Ref attached directly from hook actions */}
                   <div ref={actions.messagesEndRef} className="h-4" />
                </div>
             )}
          </main>

          {/* Chat Input Area (Managed Ref from actions) */}
          <footer className="p-6 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shrink-0">
             <form onSubmit={actions.sendReply} className="flex gap-5 max-w-5xl mx-auto">
                <input
                  ref={actions.inputRef}
                  type="text"
                  value={state.input}
                  onChange={(e) => actions.setInput(e.target.value)}
                  placeholder={state.searchResults ? "ล้างการค้นหาเพื่อตอบกลับ..." : "พิมพ์ข้อความตอบกลับเพื่อส่งให้ลูกค้า..."}
                  disabled={state.loading || !!state.searchResults}
                  className="flex-1 px-8 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-[2rem] text-base focus:ring-8 focus:ring-blue-500/5 focus:outline-none transition-all placeholder:text-gray-400 font-th shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!state.input.trim() || state.loading || !!state.searchResults}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-xl shadow-blue-600/30 group"
                >
                   {state.loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform" />}
                </button>
             </form>
          </footer>
        </div>

        {/* Floating Error Toast */}
        {state.error && viewModel && (
          <div className="fixed bottom-10 right-10 bg-red-600 text-white px-8 py-5 rounded-[2rem] shadow-[0_20px_50px_rgba(220,38,38,0.3)] flex items-center gap-5 animate-in slide-in-from-bottom-6 duration-500 z-[100]">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
               <span className="text-2xl">⚠️</span>
            </div>
            <div>
               <p className="font-black text-sm font-th">{state.error}</p>
            </div>
            <button onClick={() => actions.setError(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}

import { MagicLinkService } from "@/src/infrastructure/security/MagicLinkService";
import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";
import { ArrowRight, Bot, CheckCircle, Clock, Inbox, MessageSquare, Star, UserCircle2 } from "lucide-react";
import Link from 'next/link';

import { Database } from "@/src/domain/types/supabase";

type AdminChatSummary = Database["public"]["Views"]["admin_chat_summary"]["Row"];

export default async function AdminChatListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: activeTab = "active" } = await searchParams;
  const supabase = createAdminSupabaseClient();
  
  // Fetch all sessions with their pre-calculated summary info from the View
  const { data, error } = await supabase
    .from("admin_chat_summary")
    .select("*")
    .order("updated_at", { ascending: false });

  const rawSessions = data as AdminChatSummary[] | null;

  // Apply filters in JS for flexibility or use query.eq (since we have the full data set and it's small)
  // Filtering the already fetched array is efficient enough here and avoids multiple query complex types
  const sessions = rawSessions?.filter(s => {
    if (activeTab === "active") return s.is_active === true;
    if (activeTab === "new") return s.status === "new";
    if (activeTab === "follow_up") return s.status === "follow_up";
    if (activeTab === "resolved") return s.is_active === false;
    return true; // "all"
  });

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Error loading sessions: {error.message}
      </div>
    );
  }

  const tabs = [
    { id: "active", label: "กำลังดำเนินการ", icon: MessageSquare },
    { id: "new", label: "มาใหม่", icon: Inbox },
    { id: "follow_up", label: "รอดำเนินการ", icon: Star },
    { id: "resolved", label: "ปิดงานแล้ว", icon: CheckCircle },
    { id: "all", label: "ทั้งหมด", icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 transition-colors duration-500">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-5">
             <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-primary/20 rotate-3 group hover:rotate-0 transition-transform">
                <Bot className="w-10 h-10 text-white -rotate-3 group-hover:rotate-0 transition-transform" />
             </div>
             <div>
                <h1 className="text-4xl font-black gradient-text tracking-tighter">Chat Dashboard</h1>
                <p className="text-sm font-bold text-text-muted">บริหารจัดการความพึงพอใจของลูกค้าแบบเรียลไทม์</p>
             </div>
          </div>
          
          <div className="flex items-center gap-2.5 px-6 py-3 glass rounded-2xl text-sm font-black text-text-primary shadow-lg border-white/40">
             <div className="w-3 h-3 bg-success rounded-full animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.5)]" />
             AI SYSTEM ONLINE
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 mb-10 glass p-2 rounded-[2rem] border shadow-xl overflow-x-auto no-scrollbar animate-in zoom-in-95 duration-500">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={`/admin/chat?status=${tab.id}`}
                className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm font-black transition-all whitespace-nowrap ${
                  isActive 
                  ? "btn-game scale-105 shadow-xl shadow-primary/30" 
                  : "text-text-muted hover:bg-white/10 hover:text-text-primary"
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? "text-white" : "text-text-muted"}`} />
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <div className="grid gap-6">
          {sessions?.length === 0 ? (
            <div className="glass rounded-[3rem] p-24 text-center border-2 border-dashed border-primary/10 animate-in fade-in zoom-in duration-700">
               <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Inbox className="w-12 h-12 text-text-muted opacity-30" />
               </div>
               <h3 className="text-2xl font-black text-text-primary mb-3">ไม่พบรายการสนทนา</h3>
               <p className="text-text-muted font-bold max-w-sm mx-auto leading-relaxed">
                 ขณะนี้ยังไม่มีลูกค้าติดต่อเข้ามาในหมวดหมู่นี้ ลองตรวจสอบหมวดหมู่อื่นๆ ดูนะครับ
               </p>
            </div>
          ) : (
            sessions?.map((session) => {
              if (!session.id) return null; // Safe guard for TS

              // Now using pre-aggregated data from Database View
              const unreadCount = session.unread_count || 0;
              const lastMessageContent = session.last_message_content || "เริ่มการสนทนาแล้ว";
              const lastMessageAt = session.last_message_at || session.updated_at || new Date().toISOString();
              
              const expiresAt = Date.now() + 1000 * 60 * 60 * 24;
              const token = MagicLinkService.generateToken(session.id, expiresAt);
              const adminUrl = `/admin/chat/${session.id}?token=${token}&expires=${expiresAt}`;
              
              const statusColors: Record<string, string> = {
                new: "bg-warning/10 text-warning border-warning/20",
                active: "bg-primary/10 text-primary border-primary/20",
                follow_up: "bg-accent/10 text-accent border-accent/20",
                resolved: "bg-success/10 text-success border-success/20",
                spam: "bg-error/10 text-error border-error/20",
              };

              return (
                <Link 
                  key={session.id} 
                  href={adminUrl}
                  className="group glass card-hover p-6 rounded-[2.5rem] flex items-center justify-between relative overflow-hidden animate-in slide-in-from-bottom-4 duration-500"
                >
                  <div className={`absolute left-0 top-1/4 bottom-1/4 w-1.5 rounded-r-full ${session.status === 'new' ? 'bg-warning animate-pulse' : 'bg-transparent'}`} />
                  
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-surface rounded-[1.5rem] flex items-center justify-center group-hover:bg-primary/5 transition-colors border shadow-inner">
                        <UserCircle2 className="w-9 h-9 text-text-muted group-hover:text-primary transition-colors" />
                      </div>
                      {/* 🔥 Optimized Numeric Unread Badge */}
                      {unreadCount > 0 && (
                        <div className="absolute -top-2 -right-2 min-w-[24px] h-6 bg-error rounded-full border-2 border-white flex items-center justify-center px-1.5 animate-bounce shadow-lg">
                          <span className="text-xs font-black text-white">{unreadCount}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-extrabold text-text-primary group-hover:text-primary transition-colors tracking-tight">
                          คุณ {session.customer_name}
                        </h3>
                        <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-lg border tracking-widest ${statusColors[session.status || 'active']}`}>
                          {session.status || (session.is_active ? 'active' : 'resolved')}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-text-secondary line-clamp-1 max-w-md opacity-80">
                        {lastMessageContent}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-10">
                    <div className="hidden md:flex flex-col items-end gap-1.5">
                      <div className="flex items-center gap-2 text-xs font-black text-text-muted">
                        <Clock className="w-4 h-4" />
                        {new Date(lastMessageAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <span className="text-[10px] font-black text-text-muted/40 bg-surface/50 px-2.5 py-0.5 rounded-lg border border-border/50 uppercase tracking-tighter">ID: {session.id.slice(0, 8)}</span>
                    </div>
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center glass text-text-muted group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-12 active:scale-95 shadow-lg border-white/20">
                      <ArrowRight className="w-7 h-7" />
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

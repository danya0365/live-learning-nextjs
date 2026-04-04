import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";
import { UserCircle2, MessageSquare, Clock, ArrowRight, Bot, Inbox, Star, CheckCircle, AlertCircle } from "lucide-react";
import Link from 'next/link';
import { MagicLinkService } from "@/src/infrastructure/security/MagicLinkService";

export default async function AdminChatListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: activeTab = "active" } = await searchParams;
  const supabase = createAdminSupabaseClient();
  
  // Fetch all sessions with their latest message info
  let query = supabase
    .from("chat_sessions")
    .select(`
      *,
      chat_messages (
        content,
        created_at,
        role,
        status
      )
    `)
    .order("updated_at", { ascending: false });

  // Apply filters
  if (activeTab === "active") {
    query = query.eq("is_active", true);
  } else if (activeTab === "new") {
    query = query.eq("status", "new");
  } else if (activeTab === "follow_up") {
    query = query.eq("status", "follow_up");
  } else if (activeTab === "resolved") {
    query = query.eq("is_active", false);
  }

  const { data: sessions, error } = await query;

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
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100 rotate-3">
                <Bot className="w-8 h-8 text-white -rotate-3" />
             </div>
             <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Chat Dashboard</h1>
                <p className="text-sm font-medium text-gray-500">จัดการข้อความจากลูกค้าแบบ Real-time</p>
             </div>
          </div>
          
          <div className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-2xl border border-gray-100 shadow-sm text-sm font-bold text-gray-700">
             <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
             ระบบพร้อมให้บริการ
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 mb-8 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                href={`/admin/chat?status=${tab.id}`}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`} />
                {tab.label}
              </Link>
            );
          })}
        </nav>

        <div className="grid gap-5">
          {sessions?.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-20 text-center border-2 border-dashed border-gray-100">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Inbox className="w-10 h-10 text-gray-300" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-2">ไม่มีข้อมูลการสนทนา</h3>
               <p className="text-gray-500 font-medium">ห้องแชทในหมวดหมู่นี้ว่างเปล่า</p>
            </div>
          ) : (
            sessions?.map((session) => {
              const lastMessage = session.chat_messages?.[session.chat_messages.length - 1];
              // Calculate unread count for this specific session
              const unreadCount = (session as any).chat_messages?.filter(
                (m: any) => m.role === 'user' && m.status !== 'read'
              ).length || 0;
              
              const expiresAt = Date.now() + 1000 * 60 * 60 * 24;
              const token = MagicLinkService.generateToken(session.id, expiresAt);
              const adminUrl = `/admin/chat/${session.id}?token=${token}&expires=${expiresAt}`;
              
              const statusColors: Record<string, string> = {
                new: "bg-amber-100 text-amber-700 border-amber-200",
                active: "bg-indigo-100 text-indigo-700 border-indigo-200",
                follow_up: "bg-purple-100 text-purple-700 border-purple-200",
                resolved: "bg-green-100 text-green-700 border-green-200",
                spam: "bg-red-100 text-red-700 border-red-200",
              };

              return (
                <Link 
                  key={session.id} 
                  href={adminUrl}
                  className="group bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex items-center justify-between relative overflow-hidden"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${session.status === 'new' ? 'bg-amber-500' : 'bg-transparent'}`} />
                  
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors border border-gray-100">
                        <UserCircle2 className="w-8 h-8 text-gray-400 group-hover:text-indigo-500" />
                      </div>
                      {/* 🔥 Numeric Unread Badge */}
                      {unreadCount > 0 && (
                        <div className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center px-1 animate-in zoom-in duration-300 shadow-sm">
                          <span className="text-[10px] font-black text-white">{unreadCount}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        <h3 className="font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          คุณ {session.customer_name}
                        </h3>
                        <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full border ${statusColors[session.status || 'active']}`}>
                          {session.status || (session.is_active ? 'active' : 'resolved')}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-500 line-clamp-1 max-w-md">
                        {lastMessage ? lastMessage.content : "เริ่มการสนทนาแล้ว"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="hidden md:flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(session.updated_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <span className="text-[10px] font-mono text-gray-300 bg-gray-50 px-2 rounded-md">ID: {session.id.slice(0, 8)}</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-50 text-gray-300 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-12 group-hover:scale-110 shadow-sm">
                      <ArrowRight className="w-6 h-6" />
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

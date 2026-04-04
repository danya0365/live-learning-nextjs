import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";
import { verifyAdmin } from "@/src/infrastructure/security/AdminGuard";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  // 🛡️ Guard: Only Admin can access
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const supabase = createAdminSupabaseClient();
    
    // Fetch all active/new sessions and their unread customer messages
    const { data: sessions, error } = await supabase
      .from("chat_sessions")
      .select(`
        id,
        status,
        chat_messages (
          role,
          status
        )
      `)
      .not('status', 'eq', 'resolved');

    if (error && error.code !== 'PGRST116') {
        console.error("Supabase query error:", error);
    }
    
    // 🔥 HYBRID LOGIC: Count unique SESSIONS (rooms) that have unread messages
    // This keeps the Header Badge tidy.
    let sessionsWithUnreadCount = 0;

    sessions?.forEach(session => {
        const hasUnreadMessages = (session as any).chat_messages?.some(
            (m: any) => m.role === 'user' && m.status !== 'read'
        );
        
        if (hasUnreadMessages) {
            sessionsWithUnreadCount++;
        }
    });

    return NextResponse.json({ count: sessionsWithUnreadCount });
  } catch (error) {
    console.error("Unread count API error:", error);
    return NextResponse.json({ count: 0, error: "Failed to fetch" }, { status: 500 });
  }
}

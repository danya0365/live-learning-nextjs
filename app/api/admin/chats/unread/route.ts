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
    
    // 🔥 OPTIMIZED: Count unique sessions from the summary View
    // Filters for unread_count > 0 in one simple query.
    const { data: sessions, error } = await supabase
      .from("admin_chat_summary")
      .select("id")
      .gt("unread_count", 0)
      .not('status', 'eq', 'resolved');

    if (error && error.code !== 'PGRST116') {
        console.error("Supabase query error:", error);
    }
    
    const sessionsWithUnreadCount = sessions?.length || 0;

    return NextResponse.json({ count: sessionsWithUnreadCount });
  } catch (error) {
    console.error("Unread count API error:", error);
    return NextResponse.json({ count: 0, error: "Failed to fetch" }, { status: 500 });
  }
}

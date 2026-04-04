import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";
import { verifyAdmin } from "@/src/infrastructure/security/AdminGuard";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // 🛡️ Guard: Only Admin can access
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const supabase = createAdminSupabaseClient();
    
    // 🔥 OPTIMIZED: Query the pre-aggregated summary View
    // This is much faster and returns exactly what the list UI needs.
    const { data: sessions, error } = await supabase
      .from("admin_chat_summary")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Admin chats list error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Failed to load chats: " + message }, { status: 500 });
  }
}

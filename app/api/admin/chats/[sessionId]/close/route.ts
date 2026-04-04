import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";
import { verifyAdmin } from "@/src/infrastructure/security/AdminGuard";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  // 🛡️ Guard: Only Admin can access
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
     const { sessionId } = await params;
     const supabase = createAdminSupabaseClient();
     
     const { error } = await supabase
       .from("chat_sessions")
       .update({ 
         is_active: false,
         status: "resolved",
         updated_at: new Date().toISOString()
       })
       .eq("id", sessionId);

     if (error) throw error;

     return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Admin chat close error:`, error);
    return NextResponse.json({ error: "Failed to close session" }, { status: 500 });
  }
}

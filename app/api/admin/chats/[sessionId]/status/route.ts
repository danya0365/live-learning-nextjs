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
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    
    // Status can be: 'read' (internal message status), 'new', 'active', 'follow_up', 'resolved', 'spam'
    if (status === "read") {
       const { error } = await supabase
         .from("chat_messages")
         .update({ status: "read" })
         .eq("session_id", sessionId)
         .eq("role", "user");
       if (error) throw error;
    } else {
       // Update session status
       const { error } = await supabase
         .from("chat_sessions")
         .update({ 
           status: status,
           updated_at: new Date().toISOString()
         })
         .eq("id", sessionId);
       if (error) throw error;
    }

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error(`Admin session status update error:`, error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}

import { SupabaseChatRepository } from "@/src/infrastructure/repositories/supabase/SupabaseChatRepository";
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

    const chatRepo = new SupabaseChatRepository();
    
    // Status can be: 'read' (internal message status), 'new', 'active', 'follow_up', 'resolved', 'spam'
    if (status === "read") {
       await chatRepo.markMessagesAsReadBySession(sessionId);
    } else {
       // Update session status
       await chatRepo.updateSessionStatus(sessionId, status);
    }

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error(`Admin session status update error:`, error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}

import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";
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
    const { autoReply } = await request.json();

    if (autoReply === undefined) {
      return NextResponse.json({ error: "autoReply is required" }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    const chatRepo = new SupabaseChatRepository(supabase);

    await chatRepo.toggleAutoReply(sessionId, autoReply);

    return NextResponse.json({ success: true, autoReply });
  } catch (error) {
    console.error(`Admin auto-reply toggle error:`, error);
    return NextResponse.json({ error: "Failed to update auto-reply" }, { status: 500 });
  }
}

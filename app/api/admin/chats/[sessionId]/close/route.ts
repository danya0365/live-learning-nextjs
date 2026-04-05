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
     const supabase = createAdminSupabaseClient();
     const chatRepo = new SupabaseChatRepository(supabase);

     
     await chatRepo.updateSessionStatus(sessionId, "resolved");

     return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Admin chat close error:`, error);
    return NextResponse.json({ error: "Failed to close session" }, { status: 500 });
  }
}

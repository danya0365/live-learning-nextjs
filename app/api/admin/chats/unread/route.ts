import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";
import { SupabaseChatRepository } from "@/src/infrastructure/repositories/supabase/SupabaseChatRepository";
import { verifyAdmin } from "@/src/infrastructure/security/AdminGuard";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  // 🛡️ Guard: Only Admin can access
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const supabase = createAdminSupabaseClient();
    const chatRepo = new SupabaseChatRepository(supabase);
    const count = await chatRepo.getUnreadSessionCount();

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Unread count API error:", error);
    return NextResponse.json({ count: 0, error: "Failed to fetch" }, { status: 500 });
  }
}

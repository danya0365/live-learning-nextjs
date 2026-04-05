import { SupabaseChatRepository } from "@/src/infrastructure/repositories/supabase/SupabaseChatRepository";
import { verifyAdmin } from "@/src/infrastructure/security/AdminGuard";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  // 🛡️ Guard: Only Admin can access
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { sessionId } = await params;
    const { searchParams } = request.nextUrl;
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ messages: [] });
    }

    const chatRepo = new SupabaseChatRepository();
    const messages = await chatRepo.searchMessages(sessionId, query);

    return NextResponse.json({ messages });
  } catch (error) {
    console.error(`Admin chat search error:`, error);
    return NextResponse.json({ error: "Failed to search messages" }, { status: 500 });
  }
}

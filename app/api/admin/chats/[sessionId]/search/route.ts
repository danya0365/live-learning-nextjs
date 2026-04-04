import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";
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

    const supabase = createAdminSupabaseClient();
    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .ilike("content", `%${query}%`)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ messages });
  } catch (error) {
    console.error(`Admin chat search error:`, error);
    return NextResponse.json({ error: "Failed to search messages" }, { status: 500 });
  }
}

import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const { autoReply } = await request.json();

    if (autoReply === undefined) {
      return NextResponse.json({ error: "autoReply is required" }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    const { error } = await supabase
      .from("chat_sessions")
      .update({ auto_reply: autoReply })
      .eq("id", sessionId);

    if (error) throw error;

    return NextResponse.json({ success: true, autoReply });
  } catch (error) {
    console.error(`Admin auto-reply toggle error:`, error);
    return NextResponse.json({ error: "Failed to update auto-reply" }, { status: 500 });
  }
}

import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const resolvedParams = await params;
    const sessionId = resolvedParams.sessionId;
    const supabase = createAdminSupabaseClient();

    // Mark assistant/admin messages as read
    const { error } = await supabase
      .from('chat_messages')
      .update({ status: 'read' })
      .eq('session_id', sessionId)
      .neq('role', 'user')
      .neq('status', 'read');

    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Chat Read API error:", error);
    return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 });
  }
}

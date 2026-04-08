import { SupabaseChatRepository } from "@/src/infrastructure/repositories/supabase/SupabaseChatRepository";
import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const resolvedParams = await params;
    const sessionId = resolvedParams.sessionId;
    const chatRepo = new SupabaseChatRepository(createAdminSupabaseClient());

    // Mark assistant/admin messages as read
    await chatRepo.markMessagesAsReadForUser(sessionId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Chat Read API error:", error);
    return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 });
  }
}

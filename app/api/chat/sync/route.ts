import { SupabaseChatRepository } from "@/src/infrastructure/repositories/supabase/SupabaseChatRepository";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const lastMessageAt = searchParams.get('lastMessageAt') || undefined;
    const before = searchParams.get('before') || undefined;

    if (!sessionId) {
      return NextResponse.json({ error: "SessionId is required" }, { status: 400 });
    }

    const chatRepo = new SupabaseChatRepository();
    const messages = await chatRepo.getMessagesBySession(sessionId, {
      lastMessageAt,
      before,
      limit: 50
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Chat Sync API error:", error);
    return NextResponse.json({ error: "Failed to sync" }, { status: 500 });
  }
}

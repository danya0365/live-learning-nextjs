import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";
import { SupabaseChatRepository } from "@/src/infrastructure/repositories/supabase/SupabaseChatRepository";
import { LineMessagingService } from "@/src/infrastructure/services/LineMessagingService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, messageId } = await request.json();

    if (!message || typeof message !== "string" || !sessionId) {
      return NextResponse.json({ error: "Message and sessionId are required" }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    const chatRepo = new SupabaseChatRepository(supabase);
    const lineService = new LineMessagingService();

    // 1. Ensure session exists
    const session = await chatRepo.getSession(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // 2. Save user message
    await chatRepo.addMessage(sessionId, "user", message, {
      id: messageId,
      status: "sent"
    });

    // 3. Notify Admin via LINE
    try {
        await lineService.notifyAdmin(sessionId, `[${session.customerName}] ${message}`);
    } catch (e) {
        console.error("Failed to notify line", e);
    }

    // 4. Prepare Auto-Response Fallback
    const simpleResponse = "ได้รับข้อความแล้วครับ ทีมงานจะรีบตรวจสอบและตอบกลับให้เร็วที่สุดครับ ⚡";
    
    if (session.autoReply) {
      const aiMessage = await chatRepo.addMessage(sessionId, "assistant", simpleResponse, {
        isDraft: false
      });
        
      return NextResponse.json({ response: simpleResponse, responseId: aiMessage.id });
    } else {
       return NextResponse.json({ ack: true });
    }
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}

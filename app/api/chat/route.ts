import { LineMessagingService } from "@/src/infrastructure/services/LineMessagingService";
import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, messageId } = await request.json();

    if (!message || typeof message !== "string" || !sessionId) {
      return NextResponse.json({ error: "Message and sessionId are required" }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    const lineService = new LineMessagingService();

    // Ensure session exists
    const { data: session } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Save user message
    const { error: insertError } = await supabase
       .from('chat_messages')
       .insert({
          id: messageId,
          session_id: sessionId,
          role: 'user',
          content: message,
          status: 'sent'
       });

    if (insertError) throw insertError;

    // Notify Admin via LINE
    try {
        await lineService.notifyAdmin(sessionId, `[${session.customer_name}] ${message}`);
    } catch (e) {
        console.error("Failed to notify line", e);
    }

    // Prepare Auto-Response Fallback
    const simpleResponse = "ได้รับข้อความแล้วครับ ทีมงานจะรีบตรวจสอบและตอบกลับให้เร็วที่สุดครับ ⚡";
    
    if (session.auto_reply) {
      const { data: aiMessage, error: aiError } = await supabase
        .from('chat_messages')
        .insert({
           session_id: sessionId,
           role: 'assistant',
           content: simpleResponse,
           is_draft: false
        })
        .select()
        .single();
        
      if (aiError) throw aiError;
      return NextResponse.json({ response: simpleResponse, responseId: aiMessage.id });
    } else {
       return NextResponse.json({ ack: true });
    }
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}

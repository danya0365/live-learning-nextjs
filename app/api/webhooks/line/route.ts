import { SupabaseChatRepository } from "@/src/infrastructure/repositories/supabase/SupabaseChatRepository";
import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";
import { LineMessagingService } from "@/src/infrastructure/services/LineMessagingService";
import { TextEventMessage, WebhookEvent } from "@line/bot-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-line-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const lineService = new LineMessagingService();
    
    // Verify signature
    if (!lineService.validateSignature(rawBody, signature)) {
      console.warn("[LINE Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const events: WebhookEvent[] = body.events || [];

    const chatRepo = new SupabaseChatRepository(createAdminSupabaseClient());

    for (const event of events) {
      if (event.type === "message" && event.message.type === "text") {
        const textMessage = event.message as TextEventMessage; // Cast for simpler access
        const replyText = textMessage.text;

        // Parse Session ID & Message
        let sessionId = "";
        let adminContent = "";

        // 1. Check for specific session short ID command (e.g. !8a361234 สวัสดีครับ)
        // Matches '!8-char-hex space content'
        const specificMatch = replyText.match(/^!([A-Za-z0-9_-]{4,16})\s+([\s\S]+)$/i);
        
        // 2. Check for "reply to latest" command (e.g. ตอบ สวัสดี, > สวัสดี, . สวัสดี)
        const latestMatch = replyText.match(/^(ตอบ|>|\.|!)\s+([\s\S]+)$/i);

        if (specificMatch) {
           const shortId = specificMatch[1];
           adminContent = specificMatch[2];
           
           const session = await chatRepo.getSessionByShortId(shortId);
           if (session) {
             sessionId = session.id;
           } else {
             await lineService.pushMessageToAdmin(`❌ ไม่พบแชทที่ขึ้นต้นด้วยรหัส "${shortId}" หรือแชทถูกปิดไปแล้ว`);
             continue;
           }
        } else if (latestMatch) {
           adminContent = latestMatch[2];
           
           const session = await chatRepo.getLatestActiveSession();
           if (session) {
             sessionId = session.id;
           } else {
             await lineService.pushMessageToAdmin(`❌ ไม่มีแชทใดที่กำลัง Active อยู่ในขณะนี้`);
             continue;
           }
        } else {
           // Not a command, ignore or handle as general feedback if needed
           console.log("[LINE Webhook] Received message without recognized command format:", replyText);
           continue; 
        }

        // Save Admin reply to Supabase
        await chatRepo.addMessage(sessionId, "admin", adminContent);
        
        // Auto-transition session to 'active' if it's new
        const session = await chatRepo.getSession(sessionId);
        if (session && session.status === 'new') {
            await chatRepo.updateSessionStatus(sessionId, 'active');
        }

        console.log(`[LINE Webhook] Saved admin reply for session ${sessionId.slice(0, 8)}`);
      }
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("[LINE Webhook Error]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

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
    const chatRepo = new SupabaseChatRepository();
    
    // 1. Fetch Session Info for dynamic statuses
    const session = await chatRepo.getSession(sessionId);

    const searchParams = request.nextUrl.searchParams;
    const lastMessageAt = searchParams.get("lastMessageAt") || undefined;
    const beforeDate = searchParams.get("before") || undefined;

    let messages = await chatRepo.getMessagesBySession(sessionId, {
      lastMessageAt,
      before: beforeDate,
      limit: 50
    });

    // 2. Auto-mark customer messages as read
    await chatRepo.markMessagesAsReadBySession(sessionId);

    // 3. Mark session as 'active' if it was 'new' when viewed by admin
    if (session?.status === 'new') {
        await chatRepo.updateSessionStatus(sessionId, 'active');
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error(`Admin chat messages error:`, error);
    return NextResponse.json({ error: "Failed to load messages" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  // 🛡️ Guard: Only Admin can access
  const auth = await verifyAdmin();
  if (!auth.authorized) return auth.response;

  try {
     const { sessionId } = await params;
     const { message } = await request.json();

     if (!message) {
       return NextResponse.json({ error: "Message is required" }, { status: 400 });
     }

     const chatRepo = new SupabaseChatRepository();
     
     // 1. Save admin reply
     const newMessage = await chatRepo.addMessage(sessionId, "admin", message, {
       status: "sent"
     });

     // 2. Update session status to 'active'
     await chatRepo.updateSessionStatus(sessionId, 'active');

     return NextResponse.json({ message: newMessage });
  } catch (error) {
    console.error(`Admin chat reply error:`, error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

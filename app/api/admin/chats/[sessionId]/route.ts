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
    const supabase = createAdminSupabaseClient();
    
    // 1. Fetch Session Info
    const { data: session } = await supabase
      .from("chat_sessions")
      .select("status")
      .eq("id", sessionId)
      .single();

    const searchParams = request.nextUrl.searchParams;
    const lastMessageAt = searchParams.get("lastMessageAt");
    const beforeDate = searchParams.get("before");

    let query = supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (lastMessageAt) {
      query = query.gt("created_at", lastMessageAt);
    } else if (beforeDate) {
      query = supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .lt("created_at", beforeDate)
        .order("created_at", { ascending: false })
        .limit(50);
    } else {
      query = query.limit(50);
    }

    let { data: messages, error } = await query;

    if (error) throw error;
    
    if (beforeDate && messages) {
       messages = messages.reverse();
    }

    // 2. Auto-mark customer messages as read & auto-transition 'new' status
    if (messages && messages.length > 0) {
      const unreadUserMessages = messages
        .filter((m) => m.role === "user" && m.status !== "read")
        .map((m) => m.id);

      if (unreadUserMessages.length > 0) {
        await supabase
          .from("chat_messages")
          .update({ status: "read" })
          .in("id", unreadUserMessages);
          
        messages = messages.map(m => 
          unreadUserMessages.includes(m.id) ? { ...m, status: "read" } : m
        );
      }
    }

    // 3. Mark session as 'active' if it was 'new' when viewed by admin
    if (session?.status === 'new') {
        await supabase
          .from("chat_sessions")
          .update({ status: 'active' })
          .eq("id", sessionId);
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

     const supabase = createAdminSupabaseClient();
     
     // 1. Save admin reply
     const { data: newMessage, error } = await supabase
       .from("chat_messages")
       .insert([
         {
           session_id: sessionId,
           role: "admin",
           content: message,
           status: "sent"
         },
       ])
       .select()
       .single();

     if (error) throw error;

     // 2. Update session metadata and auto-transition from 'new' to 'active'
     await supabase
       .from("chat_sessions")
       .update({ 
         updated_at: new Date().toISOString(),
         status: 'active' // Ensure status is active when admin replies
       })
       .eq("id", sessionId);

     return NextResponse.json({ message: newMessage });
  } catch (error) {
    console.error(`Admin chat reply error:`, error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

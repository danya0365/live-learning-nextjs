import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const supabase = createAdminSupabaseClient();
    
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
      // Load history before a specific date, limit to 50
      query = supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .lt("created_at", beforeDate)
        .order("created_at", { ascending: false })
        .limit(50);
    } else {
      // Initial load, limit to 50
      query = query.limit(50);
    }

    let { data: messages, error } = await query;

    if (error) throw error;
    
    // Sort ascending for UI if we fetched history (which was desc)
    if (beforeDate && messages) {
       messages = messages.reverse();
    }

    // Auto-mark customer messages as read when admin views
    if (messages && messages.length > 0) {
      const unreadUserMessages = messages
        .filter((m) => m.role === "user" && m.status !== "read")
        .map((m) => m.id);

      if (unreadUserMessages.length > 0) {
        await supabase
          .from("chat_messages")
          .update({ status: "read" })
          .in("id", unreadUserMessages);
          
        // Reflect in response
        messages = messages.map(m => 
          unreadUserMessages.includes(m.id) ? { ...m, status: "read" } : m
        );
      }
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
  try {
     const { sessionId } = await params;
     const { message } = await request.json();

     if (!message) {
       return NextResponse.json({ error: "Message is required" }, { status: 400 });
     }

     const supabase = createAdminSupabaseClient();
     
     // Save admin reply to database
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

     // Update session's updated_at
     await supabase
       .from("chat_sessions")
       .update({ updated_at: new Date().toISOString() })
       .eq("id", sessionId);

     return NextResponse.json({ message: newMessage });
  } catch (error) {
    console.error(`Admin chat reply error:`, error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

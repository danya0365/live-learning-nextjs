import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, phone } = await request.json();
    if (!name || typeof name !== "string" || !phone || typeof phone !== "string") {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    
    // Check if user session exists by phone number
    let { data: session } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('customer_phone', phone)
      .single();

    if (!session) {
      // Create new session
      const { data: newSession, error: createError } = await supabase
        .from('chat_sessions')
        .insert({ customer_name: name, customer_phone: phone })
        .select()
        .single();
        
      if (createError) throw createError;
      session = newSession;
    } else {
      // Update name if changed
      if (session.customer_name !== name) {
        await supabase
          .from('chat_sessions')
          .update({ customer_name: name, updated_at: new Date().toISOString() })
          .eq('id', session.id);
      }
    }

    // Get chat history
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', session.id)
      .order('created_at', { ascending: false })
      .limit(50);
      
    const history = (messages || []).reverse().map((m: any) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      status: m.status,
      isDraft: m.is_draft,
      createdAt: m.created_at
    }));

    return NextResponse.json({
      sessionId: session.id,
      customerAuth: { name, phone },
      history
    });
  } catch (error) {
    console.error("Chat Init API error:", error);
    return NextResponse.json({ error: "Failed to initialize chat" }, { status: 500 });
  }
}

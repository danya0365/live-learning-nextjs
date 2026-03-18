import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const lastMessageAt = searchParams.get('lastMessageAt');
    const before = searchParams.get('before');

    if (!sessionId) {
      return NextResponse.json({ error: "SessionId is required" }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    
    let query = supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .eq('is_draft', false);

    if (lastMessageAt) {
      query = query.gt('created_at', lastMessageAt).order('created_at', { ascending: true });
    } else if (before) {
      query = query.lt('created_at', before).order('created_at', { ascending: false }).limit(50);
    } else {
      query = query.order('created_at', { ascending: false }).limit(50);
    }
    
    const { data: messages, error } = await query;
    if (error) throw error;
    
    let results = messages || [];
    if (!lastMessageAt) {
       results = results.reverse();
    }

    const formattedMessages = results.map((m: any) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      status: m.status,
      isDraft: m.is_draft,
      createdAt: m.created_at
    }));

    return NextResponse.json({ messages: formattedMessages });
  } catch (error) {
    console.error("Chat Sync API error:", error);
    return NextResponse.json({ error: "Failed to sync" }, { status: 500 });
  }
}

import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createAdminSupabaseClient();
    
    // We cannot use complex nested .or() filters in Supabase PostgREST for relations.
    // Instead, we'll fetch sessions that are either 'new' OR have messages, 
    // and then filter in JavaScript for accurate unread counts.
    
    const { data: sessions, error } = await supabase
      .from("chat_sessions")
      .select(`
        id,
        status,
        chat_messages!inner (
          role,
          status
        )
      `);

    // Also fetch sessions with status 'new' that might not have messages yet
    const { data: newSessions, error: newError } = await supabase
      .from("chat_sessions")
      .select("id, status")
      .eq("status", "new");

    if (error && error.code !== 'PGRST116') { // Ignore "no rows found" errors if any
        console.error("Supabase query error:", error);
    }
    
    const combinedSessions = [
        ...(sessions || []),
        ...(newSessions || [])
    ];

    // Deduplicate by ID
    const uniqueSessions = Array.from(new Map(combinedSessions.map(s => [s.id, s])).values());

    // Filter logic: count sessions that meet unread criteria
    const unreadCount = uniqueSessions.filter(session => {
        // 1. Session is explicitly marked as 'new'
        if (session.status === 'new') return true;
        
        // 2. Session has any message from a user that hasn't been read by admin
        const hasUnreadUserMessages = (session as any).chat_messages?.some(
            (m: any) => m.role === 'user' && m.status !== 'read'
        );
        
        return hasUnreadUserMessages;
    }).length;

    return NextResponse.json({ count: unreadCount });
  } catch (error) {
    console.error("Unread count API error:", error);
    return NextResponse.json({ count: 0, error: "Failed to fetch" }, { status: 500 });
  }
}

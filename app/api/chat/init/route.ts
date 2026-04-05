import { createAdminSupabaseClient } from "@/src/infrastructure/supabase/admin";
import { SupabaseChatRepository } from "@/src/infrastructure/repositories/supabase/SupabaseChatRepository";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, phone } = await request.json();
    if (!name || typeof name !== "string" || !phone || typeof phone !== "string") {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const supabase = createAdminSupabaseClient();
    const chatRepo = new SupabaseChatRepository(supabase);
    
    // 1. Get or Create session
    const session = await chatRepo.getOrCreateSession(name, phone);

    // 2. Get chat history
    const history = await chatRepo.getMessagesBySession(session.id, {
      limit: 50,
      ascending: true
    });

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

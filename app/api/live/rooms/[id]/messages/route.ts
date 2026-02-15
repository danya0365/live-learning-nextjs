
import { SupabaseLiveRoomRepository } from "@/src/infrastructure/repositories/supabase/SupabaseLiveRoomRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseLiveRoomRepository(supabase);

  try {
    const messages = await repository.getMessages(id);
    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseLiveRoomRepository(supabase);
  
  try {
    const { text } = await request.json();
    const message = await repository.sendMessage(id, text);
    return NextResponse.json(message);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


import { SupabaseLiveRoomRepository } from "@/src/infrastructure/repositories/supabase/SupabaseLiveRoomRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseLiveRoomRepository(supabase);

  // Here 'id' might be roomId or courseId. 
  // Let's assume frontend passes courseId as roomId initially.
  try {
    const room = await repository.getRoom(id);
    if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    return NextResponse.json(room);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { SupabaseBookingRepository } from "@/src/infrastructure/repositories/supabase/SupabaseBookingRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ instructorId: string }> }
) {
  const { instructorId } = await params;

  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseBookingRepository(supabase);

  try {
    const result = await repository.getByInstructorId(instructorId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

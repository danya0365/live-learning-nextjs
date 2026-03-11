import { SupabaseInstructorRepository } from "@/src/infrastructure/repositories/supabase/SupabaseInstructorRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: instructorId } = await params;
    const body = await request.json();
    const { dayOfWeek, startTime, endTime } = body;

    const supabase = await createServerSupabaseClient();
    const repository = new SupabaseInstructorRepository(supabase);
    
    const availability = await repository.addAvailability(instructorId, dayOfWeek, startTime, endTime);
    
    return NextResponse.json(availability);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


import { SupabaseConsultationRepository } from "@/src/infrastructure/repositories/supabase/SupabaseConsultationRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const instructorId = searchParams.get('instructorId');
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseConsultationRepository(supabase);

  try {
    if (instructorId) {
        const results = await repository.getOffersByInstructorId(instructorId);
        return NextResponse.json(results);
    }
    return NextResponse.json([]); // Or throw error?
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

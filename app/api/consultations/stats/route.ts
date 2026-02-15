
import { SupabaseConsultationRepository } from "@/src/infrastructure/repositories/supabase/SupabaseConsultationRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const studentId = searchParams.get('studentId');
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseConsultationRepository(supabase);

  try {
    const result = await repository.getRequestStats(studentId || undefined);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

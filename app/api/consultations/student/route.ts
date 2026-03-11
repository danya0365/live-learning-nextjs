
import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/supabase/SupabaseAuthRepository";
import { SupabaseConsultationRepository } from "@/src/infrastructure/repositories/supabase/SupabaseConsultationRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseConsultationRepository(supabase);
  const authRepo = new SupabaseAuthRepository(supabase);

  try {
    const profile = await authRepo.getProfile();
    if (!profile) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await repository.getRequestsByStudentId(profile.id);
    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

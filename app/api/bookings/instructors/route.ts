
import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/supabase/SupabaseAuthRepository";
import { SupabaseBookingRepository } from "@/src/infrastructure/repositories/supabase/SupabaseBookingRepository";
import { SupabaseInstructorRepository } from "@/src/infrastructure/repositories/supabase/SupabaseInstructorRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseBookingRepository(supabase);
  const authRepo = new SupabaseAuthRepository(supabase);
  const instructorRepo = new SupabaseInstructorRepository(supabase);

  try {
    const profile = await authRepo.getProfile();
    if (!profile) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const myInstructor = await instructorRepo.getByProfileId(profile.id);
    if (!myInstructor) {
        return NextResponse.json({ error: 'Unauthorized: No instructor profile found' }, { status: 403 });
    }
    
    const result = await repository.getByInstructorId(myInstructor.id);
    return NextResponse.json(result);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

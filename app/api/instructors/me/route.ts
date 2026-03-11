
import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/supabase/SupabaseAuthRepository";
import { SupabaseInstructorRepository } from "@/src/infrastructure/repositories/supabase/SupabaseInstructorRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const authRepo = new SupabaseAuthRepository(supabase);
  const instructorRepo = new SupabaseInstructorRepository(supabase);
  
  try {
    // 1. Get the current active profile (handles multiple profiles context)
    const profile = await authRepo.getProfile();
    
    if (!profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // 2. Get the specific instructor profile linked to this profile
    const instructor = await instructorRepo.getByProfileId(profile.id);

    if (!instructor) {
        return NextResponse.json({ error: 'Instructor profile not found' }, { status: 404 });
    }

    return NextResponse.json(instructor);

  } catch (error: any) {
    console.error('API Error in instructors/me:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

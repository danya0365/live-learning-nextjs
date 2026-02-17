
import { SupabaseCourseRepository } from "@/src/infrastructure/repositories/supabase/SupabaseCourseRepository";
import { SupabaseInstructorRepository } from "@/src/infrastructure/repositories/supabase/SupabaseInstructorRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseCourseRepository(supabase);
  const instructorRepo = new SupabaseInstructorRepository(supabase);

  try {
    // SECURE: Verify user is an instructor
    const currentInstructor = await instructorRepo.getMe();
    
    if (!currentInstructor) {
        return NextResponse.json({ error: 'Unauthorized: You must be a registered instructor' }, { status: 403 });
    }

    const courses = await repository.getByInstructorId(currentInstructor.id);
    return NextResponse.json(courses);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

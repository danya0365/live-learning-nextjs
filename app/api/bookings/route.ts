import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/supabase/SupabaseAuthRepository";
import { SupabaseBookingRepository } from "@/src/infrastructure/repositories/supabase/SupabaseBookingRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const instructorId = searchParams.get('instructorId') || undefined;
  const studentId = searchParams.get('studentId') || undefined;
  const month = searchParams.get('month');
  const year = searchParams.get('year');

  // Priority 1: Month/Year filtering (Efficient)
  if (month && year) {
    const supabase = await createServerSupabaseClient();
    const repository = new SupabaseBookingRepository(supabase);
    
    const result = await repository.getByMonth(
      parseInt(month), 
      parseInt(year), 
      { instructorId, studentId }
    );
    return NextResponse.json(result);
  }

  // Priority 2: Filter by instructor/course (Still better than global getAll)
  if (instructorId || searchParams.get('courseId')) {
    const supabase = await createServerSupabaseClient();
    const repository = new SupabaseBookingRepository(supabase);
    
    if (instructorId) {
       const result = await repository.getByInstructorId(instructorId);
       return NextResponse.json(result);
    }
    
    const courseId = searchParams.get('courseId');
    if (courseId) {
      const result = await repository.getByCourseId(courseId);
      return NextResponse.json(result);
    }
  }

  // Fallback: Disallow purely generic "fetch all"
  return NextResponse.json(
    { error: 'Deprecated endpoint. Use /api/bookings/students or /api/bookings/instructors' },
    { status: 410 } // Gone
  );
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseBookingRepository(supabase);
  const authRepo = new SupabaseAuthRepository(supabase);

  try {
    const profile = await authRepo.getProfile();

    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized: No active profile found' }, { status: 401 });
    }

    const body = await request.json();
    
    // 🔒 Server-Injected Identity: pass studentId as separate parameter
    const result = await repository.create(body, profile.id);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


import { SupabaseBookingRepository } from "@/src/infrastructure/repositories/supabase/SupabaseBookingRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseBookingRepository(supabase);

  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page');
  const perPage = searchParams.get('perPage');
  const studentId = searchParams.get('studentId');
  const instructorId = searchParams.get('instructorId');
  const courseId = searchParams.get('courseId');

  try {
    if (page && perPage) {
        const result = await repository.getPaginated(Number(page), Number(perPage));
        return NextResponse.json(result);
    }

    if (studentId) {
        const result = await repository.getByStudentId(studentId);
        return NextResponse.json(result);
    }

    if (instructorId) {
        const result = await repository.getByInstructorId(instructorId);
        return NextResponse.json(result);
    }
    
    if (courseId) {
        const result = await repository.getByCourseId(courseId);
        return NextResponse.json(result);
    }

    const result = await repository.getAll();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseBookingRepository(supabase);

  try {
    const body = await request.json();
    const result = await repository.create(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

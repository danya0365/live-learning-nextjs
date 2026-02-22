import { SupabaseEnrollmentRepository } from '@/src/infrastructure/repositories/supabase/SupabaseEnrollmentRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/enrollments
 * List enrollments for current user
 */
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const repository = new SupabaseEnrollmentRepository(supabase);
    const enrollments = await repository.getMyEnrollments();
    return NextResponse.json({ data: enrollments });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 });
  }
}

/**
 * POST /api/enrollments
 * Create a new enrollment (status = pending until payment)
 * Body: { courseId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const repository = new SupabaseEnrollmentRepository(supabase);
    const body = await request.json();

    if (!body.courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
    }

    // Check if already enrolled
    const existing = await repository.checkEnrollment(body.courseId);
    if (existing) {
      return NextResponse.json({ error: 'Already enrolled in this course', enrollment: existing }, { status: 409 });
    }

    const enrollment = await repository.createEnrollment({ courseId: body.courseId });
    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to create enrollment' }, { status: 500 });
  }
}

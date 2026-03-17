import { createServerEnrollmentsPresenter } from '@/src/presentation/presenters/enrollments/EnrollmentsPresenterServerFactory';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/enrollments
 * List enrollments for current user
 */
export async function GET() {
  try {
    const presenter = await createServerEnrollmentsPresenter();
    const enrollments = await presenter.getMyEnrollments();
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
    const presenter = await createServerEnrollmentsPresenter();
    const body = await request.json();

    if (!body.courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
    }

    // Check if already enrolled
    const existing = await presenter.checkEnrollment(body.courseId);
    if (existing) {
      return NextResponse.json({ error: 'Already enrolled in this course', enrollment: existing }, { status: 409 });
    }

    const enrollment = await presenter.createEnrollment({ courseId: body.courseId });
    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to create enrollment' }, { status: 500 });
  }
}

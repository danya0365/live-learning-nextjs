import { createServerEnrollmentsPresenter } from '@/src/presentation/presenters/enrollments/EnrollmentsPresenterServerFactory';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/enrollments/check?courseId=xxx
 * Check if current user is enrolled in a specific course
 */
export async function GET(request: NextRequest) {
  try {
    const courseId = request.nextUrl.searchParams.get('courseId');
    if (!courseId) {
      return NextResponse.json({ error: 'courseId query parameter is required' }, { status: 400 });
    }

    const presenter = await createServerEnrollmentsPresenter();
    const enrollment = await presenter.checkEnrollment(courseId);

    return NextResponse.json({
      enrolled: !!enrollment,
      enrollment: enrollment,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to check enrollment' }, { status: 500 });
  }
}

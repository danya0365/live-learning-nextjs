import { createServerInstructorsPresenter } from "@/src/presentation/presenters/instructors/InstructorsPresenterServerFactory";
import { createServerProfilePresenter } from "@/src/presentation/presenters/profile/ProfilePresenterServerFactory";
import { createServerCoursesPresenter } from '@/src/presentation/presenters/courses/CoursesPresenterServerFactory';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const presenter = await createServerCoursesPresenter();
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');
    const instructorId = searchParams.get('instructorId');
    const featured = searchParams.get('featured') === 'true';
    const page = searchParams.get('page');
    const perPage = searchParams.get('perPage');

    if (page && perPage) {
        const paginated = await presenter.getPaginated(Number(page), Number(perPage));
        return NextResponse.json(paginated);
    }

    let courses;

    if (featured) {
      courses = await presenter.getFeatured();
    } else if (categoryId) {
      courses = await presenter.getByCategory(categoryId);
    } else if (instructorId) {
      courses = await presenter.getByInstructorId(instructorId);
    } else {
      courses = await presenter.getAll();
    }

    return NextResponse.json(courses);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const presenter = await createServerCoursesPresenter();
    const profilePresenter = await createServerProfilePresenter();
    const instructorsPresenter = await createServerInstructorsPresenter();
    const profile = await profilePresenter.getProfile();
    
    if (!profile) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // SECURE: Verify user is an instructor
    const currentInstructor = await instructorsPresenter.getByProfileId(profile.id);
    
    if (!currentInstructor) {
        return NextResponse.json({ error: 'Unauthorized: You must be a registered instructor to create courses' }, { status: 403 });
    }
    
    const body = await request.json();
    
    // SECURE: Force instructorId to match the authenticated user's instructor profile
    const safeBody = {
        ...body,
        instructorId: currentInstructor.id
    };
    
    const course = await presenter.create(safeBody);
    
    return NextResponse.json(course);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}

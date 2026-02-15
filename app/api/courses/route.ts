
import { SupabaseCourseRepository } from '@/src/infrastructure/repositories/supabase/SupabaseCourseRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const repository = new SupabaseCourseRepository(supabase);
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');
    const instructorId = searchParams.get('instructorId');
    const featured = searchParams.get('featured') === 'true';
    const page = searchParams.get('page');
    const perPage = searchParams.get('perPage');

    if (page && perPage) {
        const paginated = await repository.getPaginated(Number(page), Number(perPage));
        return NextResponse.json(paginated);
    }

    let courses;

    if (featured) {
      courses = await repository.getFeatured();
    } else if (categoryId) {
      courses = await repository.getByCategory(categoryId);
    } else if (instructorId) {
      courses = await repository.getByInstructorId(instructorId);
    } else {
      courses = await repository.getAll();
    }

    return NextResponse.json(courses);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createServerSupabaseClient();
    const repository = new SupabaseCourseRepository(supabase);
    
    // TODO: Verify permissions (instructor/admin)
    // const { data: user } = await supabase.auth.getUser();
    
    const course = await repository.create(body);
    
    return NextResponse.json(course);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}

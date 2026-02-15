
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
    const featured = searchParams.get('featured') === 'true';

    let courses;

    if (featured) {
      courses = await repository.getFeatured();
    } else if (categoryId) {
      courses = await repository.getByCategory(categoryId);
    } else {
      courses = await repository.getAll();
    }

    return NextResponse.json(courses);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

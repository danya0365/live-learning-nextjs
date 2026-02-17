
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

import { SupabaseInstructorRepository } from "@/src/infrastructure/repositories/supabase/SupabaseInstructorRepository";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const repository = new SupabaseCourseRepository(supabase);
    const instructorRepo = new SupabaseInstructorRepository(supabase);
    
    // SECURE: Verify user is an instructor
    const currentInstructor = await instructorRepo.getMe();
    
    if (!currentInstructor) {
        return NextResponse.json({ error: 'Unauthorized: You must be a registered instructor to create courses' }, { status: 403 });
    }
    
    const body = await request.json();
    
    // SECURE: Force instructorId to match the authenticated user's instructor profile
    const safeBody = {
        ...body,
        instructorId: currentInstructor.id
    };
    
    const course = await repository.create(safeBody);
    
    return NextResponse.json(course);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}


import { SupabaseInstructorRepository } from "@/src/infrastructure/repositories/supabase/SupabaseInstructorRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const repository = new SupabaseInstructorRepository(supabase);
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page');
    const perPage = searchParams.get('perPage');
    const available = searchParams.get('available') === 'true';
    const topRated = searchParams.get('topRated') === 'true';
    const limit = searchParams.get('limit');

    if (page && perPage) {
        const paginated = await repository.getPaginated(Number(page), Number(perPage));
        return NextResponse.json(paginated);
    }
    
    if (available) {
        const result = await repository.getAvailable();
        return NextResponse.json(result);
    }
    
    if (topRated) {
        const result = await repository.getTopRated(Number(limit) || 4);
        return NextResponse.json(result);
    }

    const instructors = await repository.getAll();
    return NextResponse.json(instructors);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch instructors' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createServerSupabaseClient();
    const repository = new SupabaseInstructorRepository(supabase);
    
    // TODO: Permissions check
    
    const instructor = await repository.create(body);
    
    return NextResponse.json(instructor);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to create instructor' }, { status: 500 });
  }
}

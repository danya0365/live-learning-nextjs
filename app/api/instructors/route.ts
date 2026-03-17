import { createServerInstructorsPresenter } from "@/src/presentation/presenters/instructors/InstructorsPresenterServerFactory";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const presenter = await createServerInstructorsPresenter();
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page');
    const perPage = searchParams.get('perPage');
    const available = searchParams.get('available') === 'true';
    const topRated = searchParams.get('topRated') === 'true';
    const limit = searchParams.get('limit');

    if (page && perPage) {
        const paginated = await presenter.getPaginated(Number(page), Number(perPage));
        return NextResponse.json(paginated);
    }
    
    if (available) {
        const result = await presenter.getAvailable();
        return NextResponse.json(result);
    }
    
    if (topRated) {
        const result = await presenter.getTopRated(Number(limit) || 4);
        return NextResponse.json(result);
    }

    const instructors = await presenter.getAll();
    return NextResponse.json(instructors);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch instructors' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // SECURE: Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const presenter = await createServerInstructorsPresenter();
    
    // TODO: Add stricter Admin check here if this is an admin-only endpoint
    
    const body = await request.json();
    const instructor = await presenter.create(body);
    
    return NextResponse.json(instructor);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to create instructor' }, { status: 500 });
  }
}


import { SupabaseCategoryRepository } from "@/src/infrastructure/repositories/supabase/SupabaseCategoryRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const repository = new SupabaseCategoryRepository(supabase);
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page');
    const perPage = searchParams.get('perPage');

    if (page && perPage) {
        const paginated = await repository.getPaginated(Number(page), Number(perPage));
        return NextResponse.json(paginated);
    }

    const categories = await repository.getAll();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createServerSupabaseClient();
    
    // SECURE: Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const repository = new SupabaseCategoryRepository(supabase);
    
    // TODO: Add Admin role check here
    
    const category = await repository.create(body);
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

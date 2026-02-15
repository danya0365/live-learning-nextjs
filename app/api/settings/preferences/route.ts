
import { UserPreferences } from "@/src/application/repositories/ISettingsRepository";
import { SupabaseSettingsRepository } from "@/src/infrastructure/repositories/supabase/SupabaseSettingsRepository";
import { createServerSupabaseClient } from "@/src/infrastructure/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseSettingsRepository(supabase);

  if (!userId) {
     return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const result = await repository.getPreferences(userId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const repository = new SupabaseSettingsRepository(supabase);
  
  try {
    const body: UserPreferences = await request.json();
    const result = await repository.updatePreferences(body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

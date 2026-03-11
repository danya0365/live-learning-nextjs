import { SupabaseLiveSessionRepository } from '@/src/infrastructure/repositories/supabase/SupabaseLiveSessionRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const repository = new SupabaseLiveSessionRepository(supabase);
    
    const sessions = await repository.getActiveSessions();
    
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch live sessions' }, { status: 500 });
  }
}

import { SupabaseAuthRepository } from '@/src/infrastructure/repositories/supabase/SupabaseAuthRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const repo = new SupabaseAuthRepository(supabase);
  
  try {
    const sessions = await repo.getActiveSessions();
    return NextResponse.json(sessions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  const supabase = await createServerSupabaseClient();
  const repo = new SupabaseAuthRepository(supabase);
  
  try {
    const success = await repo.revokeOtherSessions();
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

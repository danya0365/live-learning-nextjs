import { SupabaseLiveRoomRepository } from '@/src/infrastructure/repositories/supabase/SupabaseLiveRoomRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { LiveRoomPresenter } from './LiveRoomPresenter';

export async function createServerLiveRoomPresenter(): Promise<LiveRoomPresenter> {
  const supabase = await createServerSupabaseClient();
  return new LiveRoomPresenter(new SupabaseLiveRoomRepository(supabase));
}

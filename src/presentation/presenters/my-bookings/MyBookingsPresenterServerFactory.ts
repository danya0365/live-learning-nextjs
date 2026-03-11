import { SupabaseBookingRepository } from '@/src/infrastructure/repositories/supabase/SupabaseBookingRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { MyBookingsPresenter } from './MyBookingsPresenter';

export async function createServerMyBookingsPresenter(): Promise<MyBookingsPresenter> {
  const supabase = await createServerSupabaseClient();
  return new MyBookingsPresenter(new SupabaseBookingRepository(supabase));
}

import { SupabaseCouponRepository } from '@/src/infrastructure/repositories/supabase/SupabaseCouponRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { CouponPresenter } from './CouponPresenter';

export async function createServerCouponPresenter(): Promise<CouponPresenter> {
  const supabase = await createServerSupabaseClient();
  return new CouponPresenter(new SupabaseCouponRepository(supabase));
}

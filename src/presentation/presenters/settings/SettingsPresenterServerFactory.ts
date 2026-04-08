import { SupabaseSettingsRepository } from '@/src/infrastructure/repositories/supabase/SupabaseSettingsRepository';
import { SupabaseAuthRepository } from '@/src/infrastructure/repositories/supabase/SupabaseAuthRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { SettingsPresenter } from './SettingsPresenter';

export async function createServerSettingsPresenter() {
  const supabase = await createServerSupabaseClient();
  return new SettingsPresenter(
    new SupabaseSettingsRepository(supabase),
    new SupabaseAuthRepository(supabase)
  );
}

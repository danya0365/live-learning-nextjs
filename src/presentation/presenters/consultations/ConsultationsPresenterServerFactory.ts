import { SupabaseConsultationRepository } from '@/src/infrastructure/repositories/supabase/SupabaseConsultationRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { ConsultationsPresenter } from './ConsultationsPresenter';

export async function createServerConsultationsPresenter(): Promise<ConsultationsPresenter> {
  const supabase = await createServerSupabaseClient();
  return new ConsultationsPresenter(new SupabaseConsultationRepository(supabase));
}

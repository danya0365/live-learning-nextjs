'use client';

import { ApiConsultationRepository } from '@/src/infrastructure/repositories/api/ApiConsultationRepository';
import { ConsultationsPresenter } from './ConsultationsPresenter';

export function createClientConsultationsPresenter(): ConsultationsPresenter {
  return new ConsultationsPresenter(new ApiConsultationRepository());
}

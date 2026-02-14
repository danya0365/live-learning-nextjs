'use client';

import { MockConsultationRepository } from '@/src/infrastructure/repositories/mock/MockConsultationRepository';
import { ConsultationsPresenter } from './ConsultationsPresenter';

export function createClientConsultationsPresenter(): ConsultationsPresenter {
  return new ConsultationsPresenter(new MockConsultationRepository());
}

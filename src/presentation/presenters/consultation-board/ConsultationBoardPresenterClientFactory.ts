'use client';

import { MockConsultationRepository } from '@/src/infrastructure/repositories/mock/MockConsultationRepository';
import { ConsultationBoardPresenter } from './ConsultationBoardPresenter';

export function createClientConsultationBoardPresenter(): ConsultationBoardPresenter {
  return new ConsultationBoardPresenter(new MockConsultationRepository());
}

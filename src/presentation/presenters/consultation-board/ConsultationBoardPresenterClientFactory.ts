'use client';

import { ApiConsultationRepository } from '@/src/infrastructure/repositories/api/ApiConsultationRepository';
import { ConsultationBoardPresenter } from './ConsultationBoardPresenter';

export function createClientConsultationBoardPresenter(): ConsultationBoardPresenter {
  return new ConsultationBoardPresenter(new ApiConsultationRepository());
}

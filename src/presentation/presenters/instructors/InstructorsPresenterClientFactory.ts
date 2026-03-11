'use client';

import { ApiInstructorRepository } from '@/src/infrastructure/repositories/api/ApiInstructorRepository';
import { InstructorsPresenter } from './InstructorsPresenter';

export function createClientInstructorsPresenter(): InstructorsPresenter {
  return new InstructorsPresenter(new ApiInstructorRepository());
}

'use client';

import { MockInstructorRepository } from '@/src/infrastructure/repositories/mock/MockInstructorRepository';
import { InstructorsPresenter } from './InstructorsPresenter';

export function createClientInstructorsPresenter(): InstructorsPresenter {
  return new InstructorsPresenter(new MockInstructorRepository());
}

import { MockInstructorRepository } from '@/src/infrastructure/repositories/mock/MockInstructorRepository';
import { InstructorsPresenter } from './InstructorsPresenter';

export function createServerInstructorsPresenter(): InstructorsPresenter {
  return new InstructorsPresenter(new MockInstructorRepository());
}

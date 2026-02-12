'use client';

import { MockCourseRepository } from '@/src/infrastructure/repositories/mock/MockCourseRepository';
import { MockInstructorRepository } from '@/src/infrastructure/repositories/mock/MockInstructorRepository';
import { InstructorDetailPresenter } from './InstructorDetailPresenter';

export function createClientInstructorDetailPresenter(): InstructorDetailPresenter {
  return new InstructorDetailPresenter(new MockInstructorRepository(), new MockCourseRepository());
}

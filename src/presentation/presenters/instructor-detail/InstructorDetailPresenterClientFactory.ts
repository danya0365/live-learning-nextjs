'use client';

import { ApiCourseRepository } from '@/src/infrastructure/repositories/api/ApiCourseRepository';
import { ApiInstructorRepository } from '@/src/infrastructure/repositories/api/ApiInstructorRepository';
import { InstructorDetailPresenter } from './InstructorDetailPresenter';

export function createClientInstructorDetailPresenter(): InstructorDetailPresenter {
  return new InstructorDetailPresenter(new ApiInstructorRepository(), new ApiCourseRepository());
}

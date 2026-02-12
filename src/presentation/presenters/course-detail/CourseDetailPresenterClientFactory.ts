'use client';

import { MockCourseRepository } from '@/src/infrastructure/repositories/mock/MockCourseRepository';
import { MockInstructorRepository } from '@/src/infrastructure/repositories/mock/MockInstructorRepository';
import { CourseDetailPresenter } from './CourseDetailPresenter';

export function createClientCourseDetailPresenter(): CourseDetailPresenter {
  return new CourseDetailPresenter(new MockCourseRepository(), new MockInstructorRepository());
}

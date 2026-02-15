'use client';

import { ApiCourseRepository } from '@/src/infrastructure/repositories/api/ApiCourseRepository';
import { ApiInstructorRepository } from '@/src/infrastructure/repositories/api/ApiInstructorRepository';
import { CourseDetailPresenter } from './CourseDetailPresenter';

export function createClientCourseDetailPresenter(): CourseDetailPresenter {
  return new CourseDetailPresenter(new ApiCourseRepository(), new ApiInstructorRepository());
}

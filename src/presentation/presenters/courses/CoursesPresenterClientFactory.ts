'use client';

import { ApiCategoryRepository } from '@/src/infrastructure/repositories/api/ApiCategoryRepository';
import { ApiCourseRepository } from '@/src/infrastructure/repositories/api/ApiCourseRepository';
import { CoursesPresenter } from './CoursesPresenter';

export function createClientCoursesPresenter(): CoursesPresenter {
  return new CoursesPresenter(new ApiCourseRepository(), new ApiCategoryRepository());
}

'use client';

import { ApiCategoryRepository } from '@/src/infrastructure/repositories/api/ApiCategoryRepository';
import { ApiCourseRepository } from '@/src/infrastructure/repositories/api/ApiCourseRepository';
import { CategoriesPresenter } from './CategoriesPresenter';

export function createClientCategoriesPresenter(): CategoriesPresenter {
  return new CategoriesPresenter(new ApiCategoryRepository(), new ApiCourseRepository());
}

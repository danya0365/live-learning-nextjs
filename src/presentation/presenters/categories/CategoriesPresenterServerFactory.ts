import { MockCategoryRepository } from '@/src/infrastructure/repositories/mock/MockCategoryRepository';
import { MockCourseRepository } from '@/src/infrastructure/repositories/mock/MockCourseRepository';
import { CategoriesPresenter } from './CategoriesPresenter';

export function createServerCategoriesPresenter(): CategoriesPresenter {
  return new CategoriesPresenter(new MockCategoryRepository(), new MockCourseRepository());
}

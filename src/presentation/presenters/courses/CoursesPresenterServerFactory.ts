import { MockCategoryRepository } from '@/src/infrastructure/repositories/mock/MockCategoryRepository';
import { MockCourseRepository } from '@/src/infrastructure/repositories/mock/MockCourseRepository';
import { CoursesPresenter } from './CoursesPresenter';

export function createServerCoursesPresenter(): CoursesPresenter {
  return new CoursesPresenter(new MockCourseRepository(), new MockCategoryRepository());
}

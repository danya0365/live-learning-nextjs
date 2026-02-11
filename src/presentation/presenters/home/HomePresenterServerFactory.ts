/**
 * HomePresenterServerFactory
 * Factory for creating HomePresenter on the server side
 * ✅ Injects Mock repositories for development
 */

import { MockCategoryRepository } from '@/src/infrastructure/repositories/mock/MockCategoryRepository';
import { MockCourseRepository } from '@/src/infrastructure/repositories/mock/MockCourseRepository';
import { MockInstructorRepository } from '@/src/infrastructure/repositories/mock/MockInstructorRepository';
import { HomePresenter } from './HomePresenter';

export class HomePresenterServerFactory {
  static create(): HomePresenter {
    const courseRepository = new MockCourseRepository();
    const instructorRepository = new MockInstructorRepository();
    const categoryRepository = new MockCategoryRepository();

    return new HomePresenter(courseRepository, instructorRepository, categoryRepository);
  }
}

export function createServerHomePresenter(): HomePresenter {
  return HomePresenterServerFactory.create();
}

/**
 * HomePresenterClientFactory
 * Factory for creating HomePresenter on the client side
 * ✅ Injects API repositories for client-side data fetching
 */

'use client';

import { ApiBookingRepository } from '@/src/infrastructure/repositories/api/ApiBookingRepository';
import { ApiCategoryRepository } from '@/src/infrastructure/repositories/api/ApiCategoryRepository';
import { ApiCourseRepository } from '@/src/infrastructure/repositories/api/ApiCourseRepository';
import { ApiInstructorRepository } from '@/src/infrastructure/repositories/api/ApiInstructorRepository';
import { HomePresenter } from './HomePresenter';

export class HomePresenterClientFactory {
  static create(): HomePresenter {
    const courseRepository = new ApiCourseRepository();
    const instructorRepository = new ApiInstructorRepository();
    const categoryRepository = new ApiCategoryRepository();
    const bookingRepository = new ApiBookingRepository();

    return new HomePresenter(courseRepository, instructorRepository, categoryRepository, bookingRepository);
  }
}

export function createClientHomePresenter(): HomePresenter {
  return HomePresenterClientFactory.create();
}

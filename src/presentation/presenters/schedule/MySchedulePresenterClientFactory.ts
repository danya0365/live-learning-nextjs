'use client';

import { ApiBookingRepository } from '@/src/infrastructure/repositories/api/ApiBookingRepository';
import { ApiCourseRepository } from '@/src/infrastructure/repositories/api/ApiCourseRepository';
import { ApiInstructorRepository } from '@/src/infrastructure/repositories/api/ApiInstructorRepository';
import { ApiProfileRepository } from '@/src/infrastructure/repositories/api/ApiProfileRepository';
import { MySchedulePresenter } from './MySchedulePresenter';

export function createClientMySchedulePresenter() {
  const instructorRepository = new ApiInstructorRepository();
  const bookingRepository = new ApiBookingRepository();
  const courseRepository = new ApiCourseRepository();
  const profileRepository = new ApiProfileRepository();

  return new MySchedulePresenter(
    instructorRepository,
    bookingRepository,
    courseRepository,
    profileRepository
  );
}

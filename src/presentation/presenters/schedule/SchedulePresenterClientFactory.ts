'use client';

import { ApiBookingRepository } from '@/src/infrastructure/repositories/api/ApiBookingRepository';
import { ApiCourseRepository } from '@/src/infrastructure/repositories/api/ApiCourseRepository';
import { ApiInstructorRepository } from '@/src/infrastructure/repositories/api/ApiInstructorRepository';
import { SchedulePresenter } from './SchedulePresenter';

export function createClientSchedulePresenter(): SchedulePresenter {
  return new SchedulePresenter(
    new ApiInstructorRepository(),
    new ApiBookingRepository(),
    new ApiCourseRepository(),
  );
}

'use client';

import { ApiBookingRepository } from '@/src/infrastructure/repositories/api/ApiBookingRepository';
import { ApiCourseRepository } from '@/src/infrastructure/repositories/api/ApiCourseRepository';
import { ApiInstructorRepository } from '@/src/infrastructure/repositories/api/ApiInstructorRepository';
import { LiveSessionsPresenter } from './LiveSessionsPresenter';

export function createClientLiveSessionsPresenter(): LiveSessionsPresenter {
  return new LiveSessionsPresenter(
    new ApiCourseRepository(),
    new ApiInstructorRepository(),
    new ApiBookingRepository(),
  );
}

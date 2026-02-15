'use client';

import { ApiBookingRepository } from '@/src/infrastructure/repositories/api/ApiBookingRepository';
import { ApiCourseRepository } from '@/src/infrastructure/repositories/api/ApiCourseRepository';
import { ApiProfileRepository } from '@/src/infrastructure/repositories/api/ApiProfileRepository';
import { ProfilePresenter } from './ProfilePresenter';

export function createClientProfilePresenter(): ProfilePresenter {
  return new ProfilePresenter(
    new ApiBookingRepository(),
    new ApiCourseRepository(),
    new ApiProfileRepository(),
  );
}

'use client';

import { MockBookingRepository } from '@/src/infrastructure/repositories/mock/MockBookingRepository';
import { MockCourseRepository } from '@/src/infrastructure/repositories/mock/MockCourseRepository';
import { ProfilePresenter } from './ProfilePresenter';

export function createClientProfilePresenter(): ProfilePresenter {
  return new ProfilePresenter(new MockBookingRepository(), new MockCourseRepository());
}

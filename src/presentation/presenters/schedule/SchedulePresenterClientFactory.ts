'use client';

import { MockBookingRepository } from '@/src/infrastructure/repositories/mock/MockBookingRepository';
import { MockCourseRepository } from '@/src/infrastructure/repositories/mock/MockCourseRepository';
import { MockInstructorRepository } from '@/src/infrastructure/repositories/mock/MockInstructorRepository';
import { SchedulePresenter } from './SchedulePresenter';

export function createClientSchedulePresenter(): SchedulePresenter {
  return new SchedulePresenter(
    new MockInstructorRepository(),
    new MockBookingRepository(),
    new MockCourseRepository(),
  );
}

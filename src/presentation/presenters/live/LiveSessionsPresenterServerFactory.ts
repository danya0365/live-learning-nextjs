import { MockBookingRepository } from '@/src/infrastructure/repositories/mock/MockBookingRepository';
import { MockCourseRepository } from '@/src/infrastructure/repositories/mock/MockCourseRepository';
import { MockInstructorRepository } from '@/src/infrastructure/repositories/mock/MockInstructorRepository';
import { LiveSessionsPresenter } from './LiveSessionsPresenter';

export function createServerLiveSessionsPresenter(): LiveSessionsPresenter {
  return new LiveSessionsPresenter(
    new MockCourseRepository(),
    new MockInstructorRepository(),
    new MockBookingRepository(),
  );
}

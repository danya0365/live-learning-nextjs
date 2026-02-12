/**
 * LiveSessionsPresenter
 * Shows currently active live courses that students can join
 */

import {
    Booking,
    IBookingRepository,
} from '@/src/application/repositories/IBookingRepository';
import {
    Course,
    ICourseRepository,
} from '@/src/application/repositories/ICourseRepository';
import {
    IInstructorRepository,
    Instructor,
} from '@/src/application/repositories/IInstructorRepository';

export interface LiveSession {
  course: Course;
  instructor: Instructor;
  booking: Booking | null;
  viewerCount: number;
}

export interface LiveSessionsViewModel {
  sessions: LiveSession[];
  totalLive: number;
}

export class LiveSessionsPresenter {
  constructor(
    private readonly courseRepository: ICourseRepository,
    private readonly instructorRepository: IInstructorRepository,
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async getViewModel(): Promise<LiveSessionsViewModel> {
    const [courses, instructors, bookings] = await Promise.all([
      this.courseRepository.getAll(),
      this.instructorRepository.getAll(),
      this.bookingRepository.getAll(),
    ]);

    const liveCourses = courses.filter((c) => c.isLive && c.isActive);

    const sessions: LiveSession[] = liveCourses.map((course) => {
      const instructor = instructors.find((i) => i.id === course.instructorId) || null;
      const booking = bookings.find(
        (b) => b.courseId === course.id && (b.status === 'confirmed' || b.status === 'pending'),
      ) || null;

      return {
        course,
        instructor: instructor!,
        booking,
        viewerCount: Math.floor(Math.random() * 50) + 5,
      };
    });

    return {
      sessions,
      totalLive: sessions.length,
    };
  }
}

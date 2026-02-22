/**
 * CourseDetailPresenter
 * Handles business logic for a single course detail page
 */

import {
    Course,
    ICourseRepository,
} from '@/src/application/repositories/ICourseRepository';
import {
    Enrollment,
    IEnrollmentRepository,
} from '@/src/application/repositories/IEnrollmentRepository';
import {
    IInstructorRepository,
    Instructor,
    TimeSlot,
} from '@/src/application/repositories/IInstructorRepository';
import { type Metadata } from 'next';

export interface CourseDetailViewModel {
  course: Course;
  instructor: Instructor;
  instructorTimeSlots: TimeSlot[];
  relatedCourses: Course[];
  enrollment: Enrollment | null;       // null = not enrolled
  remainingHours: number;              // 0 if not enrolled
}

export class CourseDetailPresenter {
  constructor(
    private readonly courseRepository: ICourseRepository,
    private readonly instructorRepository: IInstructorRepository,
    private readonly enrollmentRepository: IEnrollmentRepository,
  ) {}

  async getViewModel(courseId: string): Promise<CourseDetailViewModel | null> {
    const course = await this.courseRepository.getById(courseId);
    if (!course) return null;

    const [instructor, timeSlots, allCourses, enrollment] = await Promise.all([
      this.instructorRepository.getById(course.instructorId),
      this.instructorRepository.getTimeSlots(course.instructorId),
      this.courseRepository.getByCategory(course.categoryId),
      this.enrollmentRepository.checkEnrollment(courseId),
    ]);

    if (!instructor) return null;

    const relatedCourses = allCourses
      .filter((c) => c.id !== course.id)
      .slice(0, 3);

    return {
      course,
      instructor,
      instructorTimeSlots: timeSlots,
      relatedCourses,
      enrollment,
      remainingHours: enrollment ? enrollment.remainingHours : 0,
    };
  }

  async generateMetadata(courseId: string): Promise<Metadata> {
    const course = await this.courseRepository.getById(courseId);
    if (!course) {
      return { title: 'ไม่พบคอร์ส — Live Learning' };
    }
    return {
      title: `${course.title} — Live Learning`,
      description: course.description,
    };
  }
}

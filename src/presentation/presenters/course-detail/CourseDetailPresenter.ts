/**
 * CourseDetailPresenter
 * Handles business logic for a single course detail page
 */

import {
    Course,
    ICourseRepository,
} from '@/src/application/repositories/ICourseRepository';
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
}

export class CourseDetailPresenter {
  constructor(
    private readonly courseRepository: ICourseRepository,
    private readonly instructorRepository: IInstructorRepository,
  ) {}

  async getViewModel(courseId: string): Promise<CourseDetailViewModel | null> {
    const course = await this.courseRepository.getById(courseId);
    if (!course) return null;

    const [instructor, timeSlots, allCourses] = await Promise.all([
      this.instructorRepository.getById(course.instructorId),
      this.instructorRepository.getTimeSlots(course.instructorId),
      this.courseRepository.getByCategory(course.categoryId),
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

/**
 * InstructorDetailPresenter
 * Handles business logic for a single instructor detail page
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

export interface InstructorDetailViewModel {
  instructor: Instructor;
  courses: Course[];
  timeSlots: TimeSlot[];
  availableSlots: number;
  bookedSlots: number;
}

export class InstructorDetailPresenter {
  constructor(
    private readonly instructorRepository: IInstructorRepository,
    private readonly courseRepository: ICourseRepository,
  ) {}

  async getViewModel(instructorId: string): Promise<InstructorDetailViewModel | null> {
    const instructor = await this.instructorRepository.getById(instructorId);
    if (!instructor) return null;

    const [courses, timeSlots] = await Promise.all([
      this.courseRepository.getByInstructorId(instructorId),
      this.instructorRepository.getTimeSlots(instructorId),
    ]);

    return {
      instructor,
      courses,
      timeSlots,
      availableSlots: timeSlots.filter((s) => !s.isBooked).length,
      bookedSlots: timeSlots.filter((s) => s.isBooked).length,
    };
  }

  async generateMetadata(instructorId: string): Promise<Metadata> {
    const instructor = await this.instructorRepository.getById(instructorId);
    if (!instructor) {
      return { title: 'ไม่พบอาจารย์ — Live Learning' };
    }
    return {
      title: `${instructor.name} — Live Learning`,
      description: instructor.bio,
    };
  }
}

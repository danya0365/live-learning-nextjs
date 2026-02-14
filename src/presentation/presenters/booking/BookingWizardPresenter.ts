import {
    CreateWizardBookingData,
    IBookingWizardRepository,
    WizardCourse,
    WizardInstructor,
    WizardSlot,
} from '@/src/application/repositories/IBookingWizardRepository';

import { Booking } from '@/src/application/repositories/IBookingRepository';

export class BookingWizardPresenter {
  constructor(private readonly repo: IBookingWizardRepository) {}

  async getCourses(): Promise<WizardCourse[]> {
    return this.repo.getCourses();
  }

  async getInstructorsByCourse(courseId: string): Promise<WizardInstructor[]> {
    return this.repo.getInstructorsByCourse(courseId);
  }

  async getSlotsByInstructor(instructorId: string): Promise<WizardSlot[]> {
     return this.repo.getSlotsByInstructor(instructorId);
  }

  async createBooking(data: CreateWizardBookingData): Promise<Booking> {
    return this.repo.createBooking(data);
  }
}

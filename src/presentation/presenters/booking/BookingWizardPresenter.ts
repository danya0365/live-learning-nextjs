import {
  CreateWizardBookingData,
  IBookingWizardRepository,
  WizardBookingResult,
  WizardCourse,
  WizardInstructor,
  WizardSlot,
} from '@/src/application/repositories/IBookingWizardRepository';
import { Enrollment, IEnrollmentRepository } from '@/src/application/repositories/IEnrollmentRepository';

export class BookingWizardPresenter {
  constructor(
    private readonly repo: IBookingWizardRepository,
    private readonly enrollmentRepo: IEnrollmentRepository
  ) {}

  async getCourses(): Promise<WizardCourse[]> {
    return this.repo.getCourses();
  }

  async getInstructorsByCourse(courseId: string): Promise<WizardInstructor[]> {
    return this.repo.getInstructorsByCourse(courseId);
  }

  async getSlotsByInstructor(instructorId: string): Promise<WizardSlot[]> {
     return this.repo.getSlotsByInstructor(instructorId);
  }

  async createBooking(data: CreateWizardBookingData): Promise<WizardBookingResult> {
    return this.repo.createBooking(data);
  }

  async checkEnrollment(courseId: string): Promise<Enrollment | null> {
    return this.enrollmentRepo.checkEnrollment(courseId);
  }
}

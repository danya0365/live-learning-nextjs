import {
    InitiateWizardTransactionData,
    IBookingWizardRepository,
    WizardTransactionResult,
    WizardCourse,
    WizardInstructor,
    WizardSlot,
} from '@/src/application/repositories/IBookingWizardRepository';
import { ALL_COURSES, ALL_INSTRUCTORS, ALL_SLOTS } from '@/src/data/mock/booking-wizard';

export class MockBookingWizardRepository implements IBookingWizardRepository {
  async getCourses(): Promise<WizardCourse[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return ALL_COURSES;
  }

  async getInstructorsByCourse(courseId: string): Promise<WizardInstructor[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return ALL_INSTRUCTORS.filter((inst) => inst.coursesForSelected.includes(courseId));
  }

  async getSlotsByInstructor(instructorId: string): Promise<WizardSlot[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return ALL_SLOTS[instructorId] || [];
  }

  async initiateBookingTransaction(data: InitiateWizardTransactionData): Promise<WizardTransactionResult> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Mock initiateBookingTransaction:', data);
    
    const course = ALL_COURSES.find(c => c.id === data.courseId);
    
    const finalPrice = course?.price || 0;
    
    return {
        paymentId: finalPrice > 0 ? `pay-${Date.now()}` : undefined,
        bookingId: finalPrice === 0 ? `book-${Date.now()}` : undefined,
        finalPrice: finalPrice,
        status: finalPrice > 0 ? 'awaiting_payment' : 'success',
        checkoutUrl: finalPrice > 0 ? 'https://checkout.stripe.com/mock' : undefined
    };
  }
}

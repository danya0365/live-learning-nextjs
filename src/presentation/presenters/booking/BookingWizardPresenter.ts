import {
  InitiateWizardTransactionData,
  IBookingWizardRepository,
  WizardTransactionResult,
  WizardCourse,
  WizardInstructor,
  WizardSlot,
} from '@/src/application/repositories/IBookingWizardRepository';
import { Enrollment, IEnrollmentRepository } from '@/src/application/repositories/IEnrollmentRepository';
import { IStripeRepository } from '@/src/application/repositories/IStripeRepository';

export class BookingWizardPresenter {
  constructor(
    private readonly repo: IBookingWizardRepository,
    private readonly enrollmentRepo: IEnrollmentRepository,
    private readonly stripeRepo?: IStripeRepository
  ) {}

  async getCourses(): Promise<WizardCourse[]> {
    return this.repo.getCourses();
  }

  async getInstructorsByCourse(courseId: string): Promise<WizardInstructor[]> {
    return this.repo.getInstructorsByCourse(courseId);
  }

  async getSlotsByInstructor(instructorId: string, startDateIso?: string, endDateIso?: string): Promise<WizardSlot[]> {
     return this.repo.getSlotsByInstructor(instructorId, startDateIso, endDateIso);
  }

  async initiateBookingTransaction(data: InitiateWizardTransactionData): Promise<WizardTransactionResult> {
    return this.repo.initiateBookingTransaction(data);
  }

  async checkEnrollment(courseId: string): Promise<Enrollment | null> {
    return this.enrollmentRepo.checkEnrollment(courseId);
  }

  async getMyEnrollments(): Promise<Enrollment[]> {
    return this.enrollmentRepo.getMyEnrollments();
  }

  async processTransaction(
    data: InitiateWizardTransactionData,
    userAuth: { email: string },
    origin: string
  ): Promise<WizardTransactionResult> {
    const paymentMethodToUse = data.paymentMethod === 'wallet' ? 'wallet' : 'stripe';
    
    // 1. Core Logic: Process metadata and create pending/free record
    const result = await this.initiateBookingTransaction(data);

    // Update payment method in Payments table to reflect 'wallet' or 'stripe'
    if (result.paymentId && result.status === 'awaiting_payment') {
      await this.repo.updatePaymentMethod(result.paymentId, paymentMethodToUse);
    }

    // 2. Stripe Logic: If Price > 0 and method is stripe, generate checkout session
    if (result.status === 'awaiting_payment' && result.paymentId && paymentMethodToUse === 'stripe') {
      if (!this.stripeRepo) throw new Error("StripeRepository is not initialized for Server-Side checkout");
      
      const courses = await this.repo.getCourses();
      const course = courses.find(c => c.id === data.courseId);
      
      const session = await this.stripeRepo.createCheckoutSession({
        paymentId: result.paymentId,
        courseTitle: course?.title || 'Course Booking',
        amount: result.finalPrice,
        currency: 'thb',
        customerEmail: userAuth.email,
        successUrl: `${origin}/book/success?payment_id=${result.paymentId}&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${origin}/book?error=payment_cancelled`,
        metadata: {
          instructorId: data.instructorId,
          slotId: data.slotId,
          scheduledDate: data.date,
          courseId: data.courseId
        }
      });

      return {
        ...result,
        checkoutUrl: session.url
      };
    }

    // 3. Wallet Logic: If Price > 0 and method is wallet, deduct and fulfill
    if (result.status === 'awaiting_payment' && result.paymentId && paymentMethodToUse === 'wallet') {
      try {
          const txId = await this.repo.payWithWallet(
              result.finalPrice,
              result.paymentId,
              'ชำระค่าคอร์สเรียนผ่านกระเป๋าเงิน'
          );

          const fulfillment = await this.repo.fulfillWalletPayment(
              result.paymentId,
              txId,
              data.instructorId,
              data.slotId,
              data.date
          );

          return {
              ...result,
              status: 'success',
              bookingId: fulfillment.bookingId,
              paymentId: result.paymentId // Map it explicitly if needed, but it exists in ...result
          };
      } catch (error: any) {
          await this.repo.failPayment(result.paymentId);
          throw new Error(error.message || 'Insufficient wallet balance');
      }
    }

    // 4. Free Booking: Return success immediately
    return result;
  }

  async fulfillWalletPayment(
    paymentId: string,
    txId: string,
    instructorId: string,
    slotId: string,
    date: string
  ): Promise<{ bookingId?: string; enrollmentId?: string }> {
    return this.repo.fulfillWalletPayment(paymentId, txId, instructorId, slotId, date);
  }
}

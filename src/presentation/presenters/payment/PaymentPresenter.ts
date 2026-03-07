import { IBookingRepository } from '@/src/application/repositories/IBookingRepository';
import { ICourseRepository } from '@/src/application/repositories/ICourseRepository';
import { IPaymentRepository, Payment } from '@/src/application/repositories/IPaymentRepository';
import { IProfileRepository } from '@/src/application/repositories/IProfileRepository';
import { CheckoutSessionResult, IStripeRepository } from '@/src/application/repositories/IStripeRepository';
import { Metadata } from 'next';

export class PaymentPresenter {
  constructor(
    private readonly repository: IPaymentRepository,
    private readonly bookingRepo: IBookingRepository,
    private readonly courseRepo: ICourseRepository,
    private readonly profileRepo: IProfileRepository,
    private readonly stripeRepo: IStripeRepository
  ) {}

  /**
   * Process checkout for a booking
   */
  async processCheckout(userId: string, userEmail: string, bookingId: string, origin: string): Promise<CheckoutSessionResult> {
    // 1. Get Booking
    const booking = await this.bookingRepo.getById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // 2. Verify Ownership
    // Get all profiles associated with the current authenticated user
    const profiles = await this.profileRepo.getProfiles();
    
    // Check if the booking's studentId matches any of the user's profile IDs
    const isOwner = profiles.some(p => p.id === booking.studentId);
    
    if (!isOwner) {
       throw new Error('Unauthorized access to this booking');
    }

    // 3. Get Course (for price)
    const course = await this.courseRepo.getById(booking.courseId);
    if (!course) {
        throw new Error('Course not found');
    }

    if (course.price === 0) {
        throw new Error('Course is free');
    }

    // 4. Create Payment Record (Pending) via SupabasePaymentRepository
    const payment = await this.repository.create({
        amount: course.price,
        currency: 'thb',
        paymentMethod: 'stripe_checkout',
        status: 'pending',
    });

    // 5. Create Checkout Session via StripeRepository
    const session = await this.stripeRepo.createCheckoutSession({
      paymentId: payment.id,
      courseTitle: course.title,
      amount: course.price,
      currency: 'thb',
      customerEmail: userEmail,
      successUrl: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/payment/cancel`,
    });

    // 6. Update Payment Record with Transaction ID
    await this.repository.update(payment.id, {
        transactionId: session.sessionId,
    });

    return session;
  }

  /**
   * Get payment details by ID
   */
  async getPaymentById(id: string): Promise<Payment | null> {
    try {
      return await this.repository.getById(id);
    } catch (error) {
      console.error('Error getting payment:', error);
      return null;
    }
  }

  /**
   * Get payment details by Transaction/Session ID (if applicable)
   * For now we assume the ID passed to success page is the Payment ID or Session ID
   */
  async getSuccessViewModel(sessionId: string): Promise<PaymentSuccessViewModel> {
    const payment = await this.getPaymentById(sessionId);
    return {
      payment,
      sessionId
    };
  }

  /**
   * Generate metadata for the payment success page
   */
  generateMetadata(): Metadata {
    return {
      title: "ชำระเงินสำเร็จ | Live Learning",
      description: "การชำระเงินของคุณเสร็จสมบูรณ์",
    };
  }

  /**
   * Generate metadata for the payment cancel page
   */
  generateCancelMetadata(): Metadata {
    return {
      title: "ยกเลิกการชำระเงิน | Live Learning",
      description: "การชำระเงินถูกยกเลิก",
    };
  }
}

export interface PaymentSuccessViewModel {
  payment: Payment | null;
  sessionId: string;
}

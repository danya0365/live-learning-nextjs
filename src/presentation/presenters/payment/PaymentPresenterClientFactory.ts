import { ApiBookingRepository } from '@/src/infrastructure/repositories/api/ApiBookingRepository';
import { ApiCourseRepository } from '@/src/infrastructure/repositories/api/ApiCourseRepository';
import { ApiPaymentRepository } from '@/src/infrastructure/repositories/api/ApiPaymentRepository';
import { ApiProfileRepository } from '@/src/infrastructure/repositories/api/ApiProfileRepository';
import { ApiStripeRepository } from '@/src/infrastructure/repositories/api/ApiStripeRepository';
import { PaymentPresenter } from './PaymentPresenter';

export class PaymentPresenterClientFactory {
  static create(): PaymentPresenter {
    // ✅ Use API Repositories for client-side
    // This allows the presenter to fetch data via Next.js API Routes
    
    const paymentRepo = new ApiPaymentRepository();
    const bookingRepo = new ApiBookingRepository();
    const courseRepo = new ApiCourseRepository();
    const profileRepo = new ApiProfileRepository();
    const stripeRepo = new ApiStripeRepository();

    return new PaymentPresenter(
      paymentRepo,
      bookingRepo,
      courseRepo,
      profileRepo,
      stripeRepo
    );
  }
}

export function createClientPaymentPresenter(): PaymentPresenter {
  return PaymentPresenterClientFactory.create();
}

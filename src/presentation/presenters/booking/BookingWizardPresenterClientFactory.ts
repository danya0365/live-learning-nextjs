import { ApiBookingWizardRepository } from '@/src/infrastructure/repositories/api/ApiBookingWizardRepository';
import { ApiEnrollmentRepository } from '@/src/infrastructure/repositories/api/ApiEnrollmentRepository';
import { BookingWizardPresenter } from './BookingWizardPresenter';

export class BookingWizardPresenterClientFactory {
  static create(): BookingWizardPresenter {
    return new BookingWizardPresenter(
      new ApiBookingWizardRepository(),
      new ApiEnrollmentRepository()
    );
  }
}

export function createClientBookingWizardPresenter(): BookingWizardPresenter {
  return BookingWizardPresenterClientFactory.create();
}

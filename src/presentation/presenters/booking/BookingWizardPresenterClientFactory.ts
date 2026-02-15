import { ApiBookingWizardRepository } from '@/src/infrastructure/repositories/api/ApiBookingWizardRepository';
import { BookingWizardPresenter } from './BookingWizardPresenter';

export class BookingWizardPresenterClientFactory {
  static create(): BookingWizardPresenter {
    return new BookingWizardPresenter(new ApiBookingWizardRepository());
  }
}

export function createClientBookingWizardPresenter(): BookingWizardPresenter {
  return BookingWizardPresenterClientFactory.create();
}

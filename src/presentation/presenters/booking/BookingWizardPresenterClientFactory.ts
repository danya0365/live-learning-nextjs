import { MockBookingWizardRepository } from '@/src/infrastructure/repositories/mock/MockBookingWizardRepository';
import { BookingWizardPresenter } from './BookingWizardPresenter';

export class BookingWizardPresenterClientFactory {
  static create(): BookingWizardPresenter {
    return new BookingWizardPresenter(new MockBookingWizardRepository());
  }
}

export function createClientBookingWizardPresenter(): BookingWizardPresenter {
  return BookingWizardPresenterClientFactory.create();
}

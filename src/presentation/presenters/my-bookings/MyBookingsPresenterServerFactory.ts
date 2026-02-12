import { MockBookingRepository } from '@/src/infrastructure/repositories/mock/MockBookingRepository';
import { MyBookingsPresenter } from './MyBookingsPresenter';

export function createServerMyBookingsPresenter(): MyBookingsPresenter {
  return new MyBookingsPresenter(new MockBookingRepository());
}

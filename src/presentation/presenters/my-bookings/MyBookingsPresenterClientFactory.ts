'use client';

import { MockBookingRepository } from '@/src/infrastructure/repositories/mock/MockBookingRepository';
import { MyBookingsPresenter } from './MyBookingsPresenter';

export function createClientMyBookingsPresenter(): MyBookingsPresenter {
  return new MyBookingsPresenter(new MockBookingRepository());
}

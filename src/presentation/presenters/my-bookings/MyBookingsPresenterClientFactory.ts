'use client';

import { ApiBookingRepository } from '@/src/infrastructure/repositories/api/ApiBookingRepository';
import { MyBookingsPresenter } from './MyBookingsPresenter';

export function createClientMyBookingsPresenter(): MyBookingsPresenter {
  return new MyBookingsPresenter(new ApiBookingRepository());
}

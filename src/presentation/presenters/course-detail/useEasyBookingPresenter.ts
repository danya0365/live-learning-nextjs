import { WizardSlot } from '@/src/application/repositories/IBookingWizardRepository';
import { createClientBookingWizardPresenter } from '@/src/presentation/presenters/booking/BookingWizardPresenterClientFactory';
import { useCallback, useMemo, useState } from 'react';

export interface EasyBookingState {
  slides: WizardSlot[];
  loading: boolean;
  isBooking: boolean;
  bookingSuccess: boolean;
  bookingId: string | null;
  error: string | null;
}

export interface EasyBookingActions {
  loadSlots: (instructorId: string) => Promise<void>;
  confirmBooking: (courseId: string, instructorId: string, slot: WizardSlot) => Promise<string | undefined>;
  reset: () => void;
}

export function useEasyBookingPresenter() {
  const presenter = useMemo(() => createClientBookingWizardPresenter(), []);

  const [slots, setSlots] = useState<WizardSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadSlots = useCallback(async (instructorId: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedSlots = await presenter.getSlotsByInstructor(instructorId);
      setSlots(fetchedSlots);
    } catch (err) {
      console.error('Failed to load slots:', err);
      setError('Failed to load available time slots. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [presenter]);

  const confirmBooking = useCallback(async (courseId: string, instructorId: string, slot: WizardSlot) => {
    setIsBooking(true);
    setError(null);
    try {
      const action = slot.status === 'booked' ? 'join' : 'new';
      const booking = await presenter.createBooking({
        courseId,
        instructorId,
        slotId: slot.id,
        date: new Date().toISOString(),
        action,
      });
      setBookingId(booking.id);
      setBookingSuccess(true);
      return booking.id;
    } catch (err) {
      console.error('Booking failed:', err);
      setError('Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  }, [presenter]);

  const reset = useCallback(() => {
    setBookingSuccess(false);
    setError(null);
    setSlots([]);
  }, []);

  return {
    state: {
      slots,
      loading,
      isBooking,
      bookingSuccess,
      bookingId,
      error,
    },
    actions: {
      loadSlots,
      confirmBooking,
      reset,
    },
  };
}

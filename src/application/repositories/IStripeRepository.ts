/**
 * IStripeRepository
 * Repository interface for Stripe interactions
 * Following Clean Architecture - Application layer
 */

export interface CheckoutSessionParams {
  bookingId: string;
  courseTitle: string;
  amount: number;
  currency: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CheckoutSessionResult {
  sessionId: string;
  url: string;
}

export interface StripeEvent {
  type: string;
  data: any;
}

export interface IStripeRepository {
  createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutSessionResult>;
  constructEvent(payload: string | Buffer, signature: string, secret: string): Promise<StripeEvent>;
}

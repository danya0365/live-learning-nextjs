/**
 * ApiStripeRepository
 * Implements IStripeRepository for client-side usage
 * 
 * ✅ For use in CLIENT-SIDE components only
 * ⚠️ Most operations should be server-side for security
 */

'use client';

import {
  CheckoutSessionParams,
  CheckoutSessionResult,
  IStripeRepository,
  StripeEvent
} from '@/src/application/repositories/IStripeRepository';

export class ApiStripeRepository implements IStripeRepository {
  private baseUrl = '/api/stripe';

  async createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutSessionResult> {
    const res = await fetch(`${this.baseUrl}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to create checkout session' }));
      throw new Error(error.error || 'Failed to create checkout session');
    }

    return res.json();
  }

  async constructEvent(payload: string | Buffer, signature: string, secret: string): Promise<StripeEvent> {
    // Convert Buffer to string if necessary for JSON transport
    const payloadString = Buffer.isBuffer(payload) ? payload.toString('utf-8') : payload;

    const res = await fetch(`${this.baseUrl}/construct-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payload: payloadString, signature, secret }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to construct event' }));
      throw new Error(error.error || 'Failed to construct event');
    }

    return res.json();
  }
}

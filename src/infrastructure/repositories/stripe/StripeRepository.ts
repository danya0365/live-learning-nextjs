/**
 * StripeRepository
 * Implementation of IStripeRepository using Stripe
 * Following Clean Architecture - Infrastructure layer
 */

import { CheckoutSessionParams, CheckoutSessionResult, IStripeRepository, StripeEvent } from '@/src/application/repositories/IStripeRepository';
import Stripe from 'stripe';

export class StripeRepository implements IStripeRepository {
  private stripe: Stripe;

  constructor(secretKey: string) {
    if (!secretKey) {
      throw new Error('Stripe secret key is missing');
    }
    this.stripe = new Stripe(secretKey, {
      apiVersion: '2026-02-25.clover', // Keep consistent with env
      typescript: true,
    });
  }

  async createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutSessionResult> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card', 'promptpay'],
      line_items: [
        {
          price_data: {
            currency: params.currency,
            product_data: {
              name: params.courseTitle,
            },
            unit_amount: Math.round(params.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      client_reference_id: params.bookingId,
      customer_email: params.customerEmail,
      metadata: {
        bookingId: params.bookingId,
        ...params.metadata,
      },
    });

    if (!session.url) {
      throw new Error('Failed to create checkout session URL');
    }

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  async constructEvent(payload: string | Buffer, signature: string, secret: string): Promise<StripeEvent> {
    return this.stripe.webhooks.constructEvent(payload, signature, secret);
  }
}

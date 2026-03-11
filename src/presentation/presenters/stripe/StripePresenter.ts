import { IBookingRepository } from '@/src/application/repositories/IBookingRepository';
import { IPaymentRepository } from '@/src/application/repositories/IPaymentRepository';
import { IStripeRepository } from '@/src/application/repositories/IStripeRepository';

interface StripeSession {
  id: string;
  client_reference_id: string | null;
}

export class StripePresenter {
  constructor(
    private readonly stripeRepo: IStripeRepository,
    private readonly paymentRepo: IPaymentRepository,
    private readonly bookingRepo: IBookingRepository,
    private readonly webhookSecret: string
  ) {}

  async handleWebhook(request: Request): Promise<{ received: boolean }> {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') as string;

    if (!signature) {
      throw new Error('Missing stripe-signature header');
    }

    let event;
    try {
      event = await this.stripeRepo.constructEvent(
        body,
        signature,
        this.webhookSecret
      );
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      throw new Error(`Webhook signature verification failed: ${errorMessage}`);
    }

    if (event.type === 'checkout.session.completed') {
       await this.handleCheckoutSessionCompleted(event.data.object as StripeSession);
    }

    return { received: true };
  }

  private async handleCheckoutSessionCompleted(session: StripeSession) {
    const paymentId = session.client_reference_id;
    const transactionId = session.id;

    if (!paymentId) {
      console.warn('Payment ID missing in session client_reference_id');
      return;
    }

    console.log(`Payment succeeded for ID: ${paymentId}`);

    // Maximum attempts to find payment (in case of race condition where webhook arrives before local DB insert completes)
    // Note: In real world, we might want a better retry mechanism or queue. 
    // For now, we just try to fetch.
    const payment = await this.paymentRepo.getById(paymentId);

    if (payment) {
        await this.paymentRepo.update(payment.id, {
            status: 'succeeded',
            transactionId: transactionId
        });
    } else {
        console.error(`Payment record not found for ID ${paymentId}`);
    }
  }
}

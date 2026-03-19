import { IBookingRepository } from '@/src/application/repositories/IBookingRepository';
import { IPaymentRepository } from '@/src/application/repositories/IPaymentRepository';
import { IStripeRepository } from '@/src/application/repositories/IStripeRepository';
import { IWalletRepository } from '@/src/application/repositories/IWalletRepository';
import { IBookingWizardRepository } from '@/src/application/repositories/IBookingWizardRepository';
import Stripe from 'stripe';

export class StripePresenter {
  constructor(
    private readonly stripeRepo: IStripeRepository,
    private readonly paymentRepo: IPaymentRepository,
    private readonly bookingRepo: IBookingRepository,
    private readonly walletRepo: IWalletRepository,
    private readonly bookingWizardRepo: IBookingWizardRepository,
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
      event = await this.verifySignature(body, signature);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      throw new Error(`Webhook signature verification failed: ${errorMessage}`);
    }

    if (event.type === 'checkout.session.completed') {
       await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
    }

    return { received: true };
  }

  async verifySignature(payload: string, signature: string) {
    return this.stripeRepo.constructEvent(payload, signature, this.webhookSecret);
  }

  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const metadata = session.metadata;

    if (!metadata) {
      console.warn('Webhook: Missing metadata in session', session.id);
      return;
    }

    // Case 1: Wallet Top-up
    if (metadata.type === 'wallet_topup') {
      const { profileId, amount } = metadata;
      
      if (!profileId || !amount) {
          console.error('Webhook: Missing profileId or amount for wallet_topup');
          return;
      }

      console.log(`Webhook: Processing wallet top-up for profile ${profileId}, amount: ${amount}`);

      try {
        const txId = await this.walletRepo.fulfillTopUp(profileId, Number(amount));
        console.log('Webhook: Wallet Top-up successful, Transaction ID:', txId);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Webhook: Wallet Top-up Error:', errorMessage);
        throw new Error(errorMessage);
      }
      return;
    }

    // Case 2: Course Booking Fulfillment (New unified flow)
    if (metadata.slotId && metadata.scheduledDate && metadata.paymentId) {
      console.log('Webhook: Processing unified booking fulfillment for payment', metadata.paymentId);

      try {
        const fulfillment = await this.bookingWizardRepo.fulfillWalletPayment(
          metadata.paymentId,
          session.id, // The Stripe Session ID
          metadata.instructorId,
          metadata.slotId,
          metadata.scheduledDate
        );
        console.log('Webhook: Fulfillment successful:', fulfillment);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Webhook: Fulfillment Error:', errorMessage);
        throw new Error(errorMessage);
      }
      return;
    }

    // Case 3: Legacy Payment Fulfillment (Fallback)
    const paymentId = session.client_reference_id;
    const transactionId = session.id;

    if (paymentId) {
      console.log(`Legacy Payment succeeded for ID: ${paymentId}`);
      const payment = await this.paymentRepo.getById(paymentId);

      if (payment) {
          await this.paymentRepo.update(payment.id, {
              status: 'succeeded',
              transactionId: transactionId
          });
      } else {
          console.error(`Legacy Payment record not found for ID ${paymentId}`);
      }
    }
  }
}

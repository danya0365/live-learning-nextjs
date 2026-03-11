import { Payment } from '@/src/application/repositories/IPaymentRepository';

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'pay-001',
    amount: 1500,
    currency: 'thb',
    paymentMethod: 'stripe_checkout',
    transactionId: 'txn_12345',
    status: 'succeeded',
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-01-01T10:05:00.000Z',
  },
  {
    id: 'pay-002',
    amount: 2500,
    currency: 'thb',
    paymentMethod: 'stripe_checkout',
    transactionId: 'txn_67890',
    status: 'pending',
    createdAt: '2026-02-15T12:00:00.000Z',
    updatedAt: '2026-02-15T12:00:00.000Z',
  },
];

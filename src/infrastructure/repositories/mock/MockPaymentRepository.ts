/**
 * MockPaymentRepository
 * Mock implementation for development and testing
 * Following Clean Architecture - Infrastructure layer
 */

import {
    CheckoutResult,
    CreatePaymentData,
    IPaymentRepository,
    PaginatedResult,
    Payment,
    PaymentStats,
    UpdatePaymentData,
} from '@/src/application/repositories/IPaymentRepository';

const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'pay-001',
    bookingId: 'book-001',
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
    bookingId: 'book-002',
    amount: 2500,
    currency: 'thb',
    paymentMethod: 'stripe_checkout',
    transactionId: 'txn_67890',
    status: 'pending',
    createdAt: '2026-02-15T12:00:00.000Z',
    updatedAt: '2026-02-15T12:00:00.000Z',
  },
];

export class MockPaymentRepository implements IPaymentRepository {
  private items: Payment[] = [...MOCK_PAYMENTS];

  async getById(id: string): Promise<Payment | null> {
    await this.delay(100);
    return this.items.find((item) => item.id === id) || null;
  }

  async getByIds(ids: string[]): Promise<Payment[]> {
    await this.delay(100);
    return this.items.filter((item) => ids.includes(item.id));
  }

  async getAll(): Promise<Payment[]> {
    await this.delay(100);
    return [...this.items];
  }

  async getByBookingId(bookingId: string): Promise<Payment | null> {
    await this.delay(100);
    return this.items.find((item) => item.bookingId === bookingId) || null;
  }

  async getPaginated(page: number, perPage: number): Promise<PaginatedResult<Payment>> {
    await this.delay(100);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return {
      data: this.items.slice(start, end),
      total: this.items.length,
      page,
      perPage,
    };
  }

  async create(data: CreatePaymentData): Promise<Payment> {
    await this.delay(200);
    const newItem: Payment = {
      id: `pay-${Date.now()}`,
      bookingId: data.bookingId,
      amount: data.amount,
      currency: data.currency,
      paymentMethod: data.paymentMethod,
      transactionId: data.transactionId,
      status: data.status || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.unshift(newItem);
    return newItem;
  }

  async update(id: string, data: UpdatePaymentData): Promise<Payment> {
    await this.delay(200);
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Payment not found');

    const updatedItem: Payment = {
      ...this.items[index],
      ...data, 
      updatedAt: new Date().toISOString(),
    };
    
    if (data.status) updatedItem.status = data.status;
    if (data.transactionId) updatedItem.transactionId = data.transactionId;

    this.items[index] = updatedItem;
    return updatedItem;
  }

  async delete(id: string): Promise<boolean> {
    await this.delay(200);
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  async getStats(): Promise<PaymentStats> {
    await this.delay(100);
    const succeeded = this.items.filter(p => p.status === 'succeeded');
    const totalRevenue = succeeded.reduce((sum, p) => sum + p.amount, 0);
    
    return {
      totalPayments: this.items.length,
      succeededPayments: succeeded.length,
      failedPayments: this.items.filter(p => p.status === 'failed').length,
      pendingPayments: this.items.filter(p => p.status === 'pending').length,
      totalRevenue,
    };
  }

  async createCheckoutSession(bookingId: string): Promise<CheckoutResult> {
    await this.delay(500);
    return {
      url: `http://localhost:3000/payment/mock-success?bookingId=${bookingId}`,
      sessionId: `mock-session-${Date.now()}`
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockPaymentRepository = new MockPaymentRepository();

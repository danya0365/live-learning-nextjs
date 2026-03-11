/**
 * IPaymentRepository
 * Repository interface for Payment data access and operations
 * Following Clean Architecture - Application layer
 */

// ============================================================
// TYPES
// ============================================================

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  enrollmentId?: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId?: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentStats {
  totalPayments: number;
  succeededPayments: number;
  failedPayments: number;
  pendingPayments: number;
  totalRevenue: number;
}

export interface CreatePaymentData {
  enrollmentId?: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId?: string;
  status?: PaymentStatus;
}

export interface UpdatePaymentData {
  status?: PaymentStatus;
  transactionId?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}

// Checkout Types
export interface CheckoutResult {
  url: string;
  sessionId: string;
}

// ============================================================
// REPOSITORY INTERFACE
// ============================================================

export interface IPaymentRepository {
  // Read
  getById(id: string): Promise<Payment | null>;
  getByIds(ids: string[]): Promise<Payment[]>;
  getAll(): Promise<Payment[]>;
  getPaginated(page: number, perPage: number): Promise<PaginatedResult<Payment>>;
  
  // Write
  create(data: CreatePaymentData): Promise<Payment>;
  update(id: string, data: UpdatePaymentData): Promise<Payment>;
  delete(id: string): Promise<boolean>;
  
  // Stats
  getStats(): Promise<PaymentStats>;

  // Business Operations
  /**
   * Initiates a checkout session for an enrollment or booking
   * @param targetId The enrollment or booking ID to pay for
   */
  createCheckoutSession(targetId: string): Promise<CheckoutResult>;
}

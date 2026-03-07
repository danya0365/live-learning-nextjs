/**
 * ICouponRepository
 * Domain interface for coupon management and validation
 */

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_amount';
  discountValue: number;
  maxDiscountAmount?: number;
  minPurchaseAmount: number;
  usageLimit?: number;
  usageCount: number;
  perUserLimit: number;
  validUntil?: string;
  isActive: boolean;
}

export interface ValidateCouponRequest {
  code: string;
  userId: string;
  purchaseAmount: number;
}

export interface CouponValidationResult {
  isValid: boolean;
  coupon?: Coupon;
  discountAmount?: number;
  finalPrice?: number;
  errorMessage?: string;
}

export interface ICouponRepository {
  /**
   * Validate a coupon code for a specific user and purchase amount
   */
  validateCoupon(request: ValidateCouponRequest): Promise<CouponValidationResult>;

  /**
   * Get coupon by code
   */
  getByCode(code: string): Promise<Coupon | null>;
}

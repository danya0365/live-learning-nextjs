import {
  Coupon,
  CouponValidationResult,
  ICouponRepository,
  ValidateCouponRequest
} from '@/src/application/repositories/ICouponRepository';
import { Database } from '@/src/domain/types/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseCouponRepository implements ICouponRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async validateCoupon(request: ValidateCouponRequest): Promise<CouponValidationResult> {
    const { code, userId, purchaseAmount } = request;

    // 1. Fetch coupon
    const { data: couponData, error } = await this.supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (error || !couponData) {
      return { isValid: false, errorMessage: 'ไม่พบโค้ดส่วนลดนี้' };
    }

    // 2. Basic Validations
    if (!couponData.is_active) {
        return { isValid: false, errorMessage: 'โค้ดส่วนลดนี้ถูกปิดใช้งานแล้ว' };
    }

    if (couponData.valid_until && new Date(couponData.valid_until) < new Date()) {
        return { isValid: false, errorMessage: 'โค้ดส่วนลดนี้หมดอายุแล้ว' };
    }

    if (purchaseAmount < Number(couponData.min_purchase_amount)) {
        return { 
          isValid: false, 
          errorMessage: `ยอดซื้อขั้นต่ำสำหรับโค้ดนี้คือ ฿${Number(couponData.min_purchase_amount).toLocaleString()}` 
        };
    }

    // 3. Global Usage Limit
    if (couponData.usage_limit !== null && (couponData.usage_count ?? 0) >= couponData.usage_limit) {
        return { isValid: false, errorMessage: 'โค้ดส่วนลดนี้ถูกใช้งานครบโควต้าแล้ว' };
    }

    // 4. Per User Limit
    const { count, error: countError } = await this.supabase
      .from('coupon_usages')
      .select('*', { count: 'exact', head: true })
      .eq('coupon_id', couponData.id)
      .eq('user_profile_id', userId);

    if (countError) {
        console.error('Error checking coupon usage count:', countError);
    } else if (count !== null && couponData.per_user_limit !== null && count >= couponData.per_user_limit) {
        return { isValid: false, errorMessage: 'คุณได้ใช้โค้ดส่วนลดนี้ครบตามจำนวนที่กำหนดแล้ว' };
    }

    // 5. Calculate Discount
    let discountAmount = 0;
    const discountValue = Number(couponData.discount_value);
    
    if (couponData.type === 'percentage') {
      discountAmount = (purchaseAmount * discountValue) / 100;
      if (couponData.max_discount_amount && discountAmount > Number(couponData.max_discount_amount)) {
        discountAmount = Number(couponData.max_discount_amount);
      }
    } else {
      discountAmount = discountValue;
    }

    // Ensure discount doesn't exceed price
    if (discountAmount > purchaseAmount) {
      discountAmount = purchaseAmount;
    }

    const finalPrice = purchaseAmount - discountAmount;

    const coupon: Coupon = {
      id: couponData.id,
      code: couponData.code,
      type: couponData.type as 'percentage' | 'fixed_amount',
      discountValue: Number(couponData.discount_value),
      maxDiscountAmount: couponData.max_discount_amount ? Number(couponData.max_discount_amount) : undefined,
      minPurchaseAmount: Number(couponData.min_purchase_amount),
      usageLimit: couponData.usage_limit || undefined,
      usageCount: couponData.usage_count ?? 0,
      perUserLimit: couponData.per_user_limit ?? 999999,
      validUntil: couponData.valid_until || undefined,
      isActive: couponData.is_active || false,
    };

    return {
      isValid: true,
      coupon,
      discountAmount,
      finalPrice
    };
  }

  async getByCode(code: string): Promise<Coupon | null> {
    const { data, error } = await this.supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (error || !data) return null;

    return {
        id: data.id,
        code: data.code,
        type: data.type as 'percentage' | 'fixed_amount',
        discountValue: Number(data.discount_value),
        maxDiscountAmount: data.max_discount_amount ? Number(data.max_discount_amount) : undefined,
        minPurchaseAmount: Number(data.min_purchase_amount),
        usageLimit: data.usage_limit || undefined,
        usageCount: data.usage_count ?? 0,
        perUserLimit: data.per_user_limit ?? 999999,
        validUntil: data.valid_until || undefined,
        isActive: data.is_active || false,
    };
  }
}

import { ICouponRepository, ValidateCouponRequest, CouponValidationResult } from '@/src/application/repositories/ICouponRepository';

export class CouponPresenter {
  constructor(private readonly repo: ICouponRepository) {}

  // ============================================================
  // GRANULAR DATA METHODS (For API Routes & Individual Actions)
  // ============================================================
  // ⚠️ API Routes MUST call these methods individually rather than using getViewModel()

  async validateCoupon(params: ValidateCouponRequest): Promise<CouponValidationResult> {
    return await this.repo.validateCoupon(params);
  }
}

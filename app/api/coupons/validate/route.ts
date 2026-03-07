import { SupabaseCouponRepository } from '@/src/infrastructure/repositories/supabase/SupabaseCouponRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ isValid: false, errorMessage: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { code, purchaseAmount } = body;

    if (!code || typeof purchaseAmount !== 'number') {
      return NextResponse.json({ isValid: false, errorMessage: 'Missing required parameters' }, { status: 400 });
    }

    const couponRepo = new SupabaseCouponRepository(supabase);
    const result = await couponRepo.validateCoupon({
      code: code.trim().toUpperCase(),
      userId: user.id,
      purchaseAmount
    });

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Validate coupon error:', error);
    return NextResponse.json(
      { isValid: false, errorMessage: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

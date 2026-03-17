/**
 * ApiWalletRepository
 * Implements IWalletRepository using API calls instead of direct Supabase connection
 * 
 * ✅ For use in CLIENT-SIDE components only
 * ✅ No connection pool issues - calls go through Next.js API routes
 * ✅ Secure - no Supabase credentials exposed to client
 */

'use client';

import { IWalletRepository } from '@/src/application/repositories/IWalletRepository';
import { Wallet, WalletTransaction } from '@/src/domain/types/wallet';

export class ApiWalletRepository implements IWalletRepository {
  private baseUrl = '/api/wallet';

  async getWallet(): Promise<Wallet | null> {
    const res = await fetch(this.baseUrl);
    
    if (res.status === 404) return null;
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'ไม่สามารถโหลดข้อมูลกระเป๋าเงินได้');
    }
    
    const data = await res.json();
    return data.wallet || null;
  }

  async getTransactions(limit: number = 20): Promise<WalletTransaction[]> {
    const res = await fetch(this.baseUrl);
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'ไม่สามารถโหลดข้อมูลประวัติการทำรายการได้');
    }
    
    // The existing API route already limits transactions properly
    const data = await res.json();
    return data.transactions || [];
  }

  async topUp(amount: number, description?: string, isTestMode?: boolean): Promise<{ transactionId?: string, checkoutUrl?: string }> {
    const res = await fetch(`${this.baseUrl}/topup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, description, isTestMode }),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'ดำเนินการเติมเงินไม่สำเร็จ');
    }
    
    return res.json();
  }
}

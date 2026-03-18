import { Wallet, WalletTransaction } from '@/src/domain/types/wallet';

export interface IWalletRepository {
  /**
   * ลบ Wallet ของผู้ใช้ปัจจุบัน
   */
  getWallet(): Promise<Wallet | null>;

  /**
   * ดึงประวัติการทำธุรกรรมทั้งหมด
   */
  getTransactions(limit?: number): Promise<WalletTransaction[]>;

  /**
   * เติมเงินเข้า Wallet (เรียกใช้ RPC credit_wallet หรือ สร้าง Stripe Checkout Session)
   */
  topUp(amount: number, description?: string, isTestMode?: boolean): Promise<{ transactionId?: string, checkoutUrl?: string }>;
}

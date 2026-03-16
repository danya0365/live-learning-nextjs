import { Metadata } from 'next';
import { IWalletRepository } from '@/src/application/repositories/IWalletRepository';
import { Wallet, WalletTransaction } from '@/src/domain/types/wallet';

export interface WalletViewModel {
  wallet: Wallet | null;
  transactions: WalletTransaction[];
}

export class WalletPresenter {
  constructor(private readonly repository: IWalletRepository) {}

  async getViewModel(): Promise<WalletViewModel> {
    try {
      const [wallet, transactions] = await Promise.all([
        this.repository.getWallet(),
        this.repository.getTransactions()
      ]);

      return {
        wallet,
        transactions,
      };
    } catch (error) {
      console.error('Error getting view model:', error);
      throw error;
    }
  }

  generateMetadata(): Metadata {
    return {
      title: 'กระเป๋าเงิน | Live Learning',
      description: 'ระบบจัดการกระเป๋าเงิน ยอดเงินคงเหลือและประวัติการทำรายการ',
    };
  }

  async topUp(amount: number, description?: string): Promise<{ transactionId: string }> {
    try {
      return await this.repository.topUp(amount, description);
    } catch (error) {
      console.error('Error topping up:', error);
      throw error;
    }
  }
}

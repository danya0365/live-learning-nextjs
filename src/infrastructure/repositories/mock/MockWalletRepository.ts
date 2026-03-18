import { IWalletRepository } from '@/src/application/repositories/IWalletRepository';
import { Wallet, WalletTransaction } from '@/src/domain/types/wallet';

const MOCK_WALLET: Wallet = {
  id: 'wallet-123',
  profile_id: 'profile-123',
  balance: 5000,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const MOCK_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-1',
    wallet_id: 'wallet-123',
    amount: 1000,
    type: 'topup',
    status: 'completed',
    description: 'Test Top-up',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'tx-2',
    wallet_id: 'wallet-123',
    amount: 500,
    type: 'purchase',
    status: 'completed',
    description: 'Course Purchase',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  }
];

export class MockWalletRepository implements IWalletRepository {
  private wallet: Wallet = { ...MOCK_WALLET };
  private transactions: WalletTransaction[] = [...MOCK_TRANSACTIONS];

  async getWallet(): Promise<Wallet | null> {
    await this.delay(300);
    return this.wallet;
  }

  async getTransactions(limit: number = 20): Promise<WalletTransaction[]> {
    await this.delay(300);
    return this.transactions.slice(0, limit);
  }

  async topUp(amount: number, description: string = 'Top-up'): Promise<{ transactionId: string }> {
    await this.delay(500);
    
    this.wallet.balance += amount;
    this.wallet.updated_at = new Date().toISOString();

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      wallet_id: this.wallet.id,
      amount,
      type: 'topup',
      status: 'completed',
      description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.transactions.unshift(newTx);
    
    return { transactionId: newTx.id };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

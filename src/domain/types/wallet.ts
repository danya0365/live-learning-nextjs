export type Wallet = {
  id: string;
  profile_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
};

export type WalletTransactionType = 'topup' | 'purchase' | 'refund' | 'withdrawal';
export type WalletTransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export type WalletTransaction = {
  id: string;
  wallet_id: string;
  amount: number;
  type: WalletTransactionType;
  status: WalletTransactionStatus;
  reference_type?: string | null;
  reference_id?: string | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
};

export type TopUpRequest = {
  amount: number;
  reference_type?: string;
  reference_id?: string;
  description?: string;
};

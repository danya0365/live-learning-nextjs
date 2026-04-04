'use client';

import { ApiWalletRepository } from '@/src/infrastructure/repositories/api/ApiWalletRepository';
import { WalletPresenter } from './WalletPresenter';

export class WalletPresenterClientFactory {
  static create(): WalletPresenter {
      // ✅ Use API Repository for client-side to prevent Supabase connection pool exhaustion
      return new WalletPresenter(new ApiWalletRepository());
  }
}

export function createClientWalletPresenter(): WalletPresenter {
  return WalletPresenterClientFactory.create();
}


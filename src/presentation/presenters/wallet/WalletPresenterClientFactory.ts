'use client';

import { MockWalletRepository } from '@/src/infrastructure/repositories/mock/MockWalletRepository';
import { ApiWalletRepository } from '@/src/infrastructure/repositories/api/ApiWalletRepository';
import { WalletPresenter } from './WalletPresenter';

export class WalletPresenterClientFactory {
  static create(): WalletPresenter {
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (useMock) {
      return new WalletPresenter(new MockWalletRepository());
    } else {
      // ✅ Use API Repository for client-side to prevent Supabase connection pool exhaustion
      return new WalletPresenter(new ApiWalletRepository());
    }
  }
}

export function createClientWalletPresenter(): WalletPresenter {
  return WalletPresenterClientFactory.create();
}


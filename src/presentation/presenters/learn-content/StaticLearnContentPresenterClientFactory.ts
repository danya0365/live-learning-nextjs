/**
 * StaticLearnContentPresenterClientFactory
 * Factory for creating StaticLearnContentPresenter instances on the client side
 * ✅ Injects the StaticLearnContentRepository
 */

'use client';

import { StaticLearnContentRepository } from '@/src/infrastructure/repositories/static/StaticLearnContentRepository';
import { StaticLearnContentPresenter } from './StaticLearnContentPresenter';

export class StaticLearnContentPresenterClientFactory {
  static create(): StaticLearnContentPresenter {
    // Inject the static repository since this data is purely static and secure to load on the client
    const repository = new StaticLearnContentRepository();
    return new StaticLearnContentPresenter(repository);
  }
}

export function createClientStaticLearnContentPresenter(): StaticLearnContentPresenter {
  return StaticLearnContentPresenterClientFactory.create();
}

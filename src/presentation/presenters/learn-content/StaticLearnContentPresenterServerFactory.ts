/**
 * StaticLearnContentPresenterServerFactory
 * Factory for creating StaticLearnContentPresenter instances on the server side
 * ✅ Injects the StaticLearnContentRepository
 */

import { StaticLearnContentRepository } from '@/src/infrastructure/repositories/static/StaticLearnContentRepository';
import { StaticLearnContentPresenter } from './StaticLearnContentPresenter';

export class StaticLearnContentPresenterServerFactory {
  static create(): StaticLearnContentPresenter {
    // Inject the static repository since this data is purely static
    const repository = new StaticLearnContentRepository();
    return new StaticLearnContentPresenter(repository);
  }
}

export function createServerStaticLearnContentPresenter(): StaticLearnContentPresenter {
  return StaticLearnContentPresenterServerFactory.create();
}

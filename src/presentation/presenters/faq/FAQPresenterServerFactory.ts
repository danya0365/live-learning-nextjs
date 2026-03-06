/**
 * FAQPresenterServerFactory
 * Factory for creating FAQPresenter instances on the server side
 * ✅ Injects Static repository for production-ready static data
 */

import { StaticFAQRepository } from '@/src/infrastructure/repositories/static/StaticFAQRepository';
import { FAQPresenter } from './FAQPresenter';

export class FAQPresenterServerFactory {
  static create(): FAQPresenter {
    const repository = new StaticFAQRepository();
    return new FAQPresenter(repository);
  }
}

export function createServerFAQPresenter(): FAQPresenter {
  return FAQPresenterServerFactory.create();
}

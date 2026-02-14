import { MockSettingsRepository } from '@/src/infrastructure/repositories/mock/MockSettingsRepository';
import { SettingsPresenter } from './SettingsPresenter';

export class SettingsPresenterClientFactory {
  static create(): SettingsPresenter {
    return new SettingsPresenter(new MockSettingsRepository());
  }
}

export function createClientSettingsPresenter(): SettingsPresenter {
  return SettingsPresenterClientFactory.create();
}

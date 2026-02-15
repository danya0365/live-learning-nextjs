import { ApiSettingsRepository } from '@/src/infrastructure/repositories/api/ApiSettingsRepository';
import { SettingsPresenter } from './SettingsPresenter';

export class SettingsPresenterClientFactory {
  static create(): SettingsPresenter {
    return new SettingsPresenter(new ApiSettingsRepository());
  }
}

export function createClientSettingsPresenter(): SettingsPresenter {
  return SettingsPresenterClientFactory.create();
}

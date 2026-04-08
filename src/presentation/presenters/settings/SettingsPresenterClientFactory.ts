import { ApiSettingsRepository } from '@/src/infrastructure/repositories/api/ApiSettingsRepository';
import { ApiAuthRepository } from '@/src/infrastructure/repositories/api/ApiAuthRepository';
import { SettingsPresenter } from './SettingsPresenter';

export class SettingsPresenterClientFactory {
  static create(): SettingsPresenter {
    return new SettingsPresenter(
      new ApiSettingsRepository(),
      new ApiAuthRepository()
    );
  }
}

export function createClientSettingsPresenter(): SettingsPresenter {
  return SettingsPresenterClientFactory.create();
}

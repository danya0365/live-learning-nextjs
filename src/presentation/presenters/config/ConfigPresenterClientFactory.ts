import { ApiConfigRepository } from '@/src/infrastructure/repositories/api/ApiConfigRepository';
import { ConfigPresenter } from './ConfigPresenter';

export function createClientConfigPresenter(): ConfigPresenter {
  return new ConfigPresenter(new ApiConfigRepository());
}

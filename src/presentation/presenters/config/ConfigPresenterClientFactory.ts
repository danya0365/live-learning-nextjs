import { MockConfigRepository } from '@/src/infrastructure/repositories/mock/MockConfigRepository';
import { ConfigPresenter } from './ConfigPresenter';

export function createClientConfigPresenter(): ConfigPresenter {
  return new ConfigPresenter(new MockConfigRepository());
}

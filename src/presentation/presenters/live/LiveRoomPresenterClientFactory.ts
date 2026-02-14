import { MockLiveRoomRepository } from '@/src/infrastructure/repositories/mock/MockLiveRoomRepository';
import { LiveRoomPresenter } from './LiveRoomPresenter';

export function createClientLiveRoomPresenter(): LiveRoomPresenter {
    const repo = new MockLiveRoomRepository();
    return new LiveRoomPresenter(repo);
}

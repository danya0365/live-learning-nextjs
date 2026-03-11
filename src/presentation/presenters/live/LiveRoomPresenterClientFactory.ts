import { ApiLiveRoomRepository } from '@/src/infrastructure/repositories/api/ApiLiveRoomRepository';
import { LiveRoomPresenter } from './LiveRoomPresenter';

export function createClientLiveRoomPresenter(): LiveRoomPresenter {
    const repo = new ApiLiveRoomRepository();
    return new LiveRoomPresenter(repo);
}

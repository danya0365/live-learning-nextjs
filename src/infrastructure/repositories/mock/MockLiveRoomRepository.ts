import { ChatMessage, ILiveRoomRepository, LiveRoom, Participant } from '@/src/application/repositories/ILiveRoomRepository';

import { COURSE_DATA, INITIAL_MESSAGES, PARTICIPANTS } from '@/src/data/mock/live-rooms';

export class MockLiveRoomRepository implements ILiveRoomRepository {
  async getRoom(roomId: string): Promise<LiveRoom | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return COURSE_DATA[roomId] || null;
  }

  async getMessages(roomId: string): Promise<ChatMessage[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...INITIAL_MESSAGES];
  }

  async getParticipants(roomId: string): Promise<Participant[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...PARTICIPANTS];
  }

  async sendMessage(roomId: string, text: string): Promise<ChatMessage> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const now = new Date();
    return {
      id: `user-${Date.now()}`,
      user: 'คุณ',
      avatar: '🧑‍💻',
      text: text.trim(),
      time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
    };
  }
}

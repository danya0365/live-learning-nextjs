import { ChatMessage, ILiveRoomRepository, LiveRoom, Participant } from "@/src/application/repositories/ILiveRoomRepository";

export class LiveRoomPresenter {
  constructor(private readonly repo: ILiveRoomRepository) {}

  async getRoomViewModel(roomId: string): Promise<{ room: LiveRoom; messages: ChatMessage[]; participants: Participant[] } | null> {
    const room = await this.repo.getRoom(roomId);
    if (!room) return null;

    const [messages, participants] = await Promise.all([
      this.repo.getMessages(roomId),
      this.repo.getParticipants(roomId),
    ]);

    return { room, messages, participants };
  }

  async sendMessage(roomId: string, text: string): Promise<ChatMessage> {
    return this.repo.sendMessage(roomId, text);
  }
}

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

  async sendMessage(roomId: string, profileId: string, text: string, isInstructor: boolean): Promise<ChatMessage> {
    return this.repo.sendMessage(roomId, profileId, text, isInstructor);
  }

  // ============================================================
  // GRANULAR DATA METHODS (For API Routes & Individual Actions)
  // ============================================================
  // ⚠️ API Routes MUST call these methods individually rather than using getViewModel()

  async getRoom(roomId: string) {
    return await this.repo.getRoom(roomId);
  }

  async getMessages(roomId: string) {
    return await this.repo.getMessages(roomId);
  }

  async getParticipants(roomId: string) {
    return await this.repo.getParticipants(roomId);
  }
}

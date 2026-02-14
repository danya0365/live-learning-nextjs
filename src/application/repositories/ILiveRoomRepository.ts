export interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
  isInstructor?: boolean;
}

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  isInstructor?: boolean;
}

export interface LiveRoom {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  tags: string[];
  color: string;
  isLive: boolean;
  startTime: string;
}

export interface ILiveRoomRepository {
  getRoom(roomId: string): Promise<LiveRoom | null>;
  getMessages(roomId: string): Promise<ChatMessage[]>;
  getParticipants(roomId: string): Promise<Participant[]>;
  sendMessage(roomId: string, text: string): Promise<ChatMessage>;
}

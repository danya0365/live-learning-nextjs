/**
 * ApiLiveRoomRepository
 * Implements ILiveRoomRepository by calling API endpoints.
 * 
 * ✅ For use in CLIENT-SIDE components only
 */

'use client';

import {
    ChatMessage,
    ILiveRoomRepository,
    LiveRoom,
    Participant
} from '@/src/application/repositories/ILiveRoomRepository';

export class ApiLiveRoomRepository implements ILiveRoomRepository {
    private baseUrl = '/api/live/rooms';

    async getRoom(roomId: string): Promise<LiveRoom | null> {
        const res = await fetch(`${this.baseUrl}/${roomId}`);
        if (!res.ok) return null;
        return res.json();
    }

    async getMessages(roomId: string): Promise<ChatMessage[]> {
        const res = await fetch(`${this.baseUrl}/${roomId}/messages`);
        if (!res.ok) return [];
        return res.json();
    }

    async getParticipants(roomId: string): Promise<Participant[]> {
        const res = await fetch(`${this.baseUrl}/${roomId}/participants`);
        if (!res.ok) return [];
        return res.json();
    }

    async sendMessage(roomId: string, text: string): Promise<ChatMessage> {
        const res = await fetch(`${this.baseUrl}/${roomId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        if (!res.ok) throw new Error('Failed to send message');
        return res.json();
    }
}

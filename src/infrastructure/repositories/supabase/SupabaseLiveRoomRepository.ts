/**
 * SupabaseLiveRoomRepository
 * Implementation of ILiveRoomRepository using Supabase
 * Following Clean Architecture - Infrastructure layer
 * 
 * ✅ For SERVER-SIDE use only (API Routes, Server Components)
 */

import {
    ChatMessage,
    ILiveRoomRepository,
    LiveRoom,
    Participant
} from '@/src/application/repositories/ILiveRoomRepository';
import { Database } from '@/src/domain/types/supabase';
import { SupabaseClient } from '@supabase/supabase-js';

type LiveSessionRow = Database['public']['Tables']['live_sessions']['Row'] & {
    course: Database['public']['Tables']['courses']['Row'] & {
        category: Database['public']['Tables']['categories']['Row']
    },
    instructor: Database['public']['Tables']['instructor_profiles']['Row'] & {
        profile: Database['public']['Tables']['profiles']['Row']
    }
};

export class SupabaseLiveRoomRepository implements ILiveRoomRepository {
    constructor(private readonly supabase: SupabaseClient<Database>) {}

    // TODO: We need chat_messages table and room_participants table or similar.
    // For now, since schema is limited to live_sessions, we might have to mock 
    // real-time interactions or assume they use Supabase Realtime channels directly on client
    // but the Repository interface abstracts that.
    
    // Let's implement what we can from 'live_sessions' and mock the chat part if tables are missing,
    // OR just use 'live_sessions' as the Room.
    
    // Checking schema: live_sessions, courses, etc.
    // No chat_messages table in the provided schema.
    // Schema is: bookings, categories, consultation_offers, consultation_requests, courses, instructor_profiles, live_sessions, profile_roles, profiles, time_slots.
    
    // So Chat and Participants are not persisted in DB? Or maybe using Supabase Realtime Presence?
    // If using Presence, the Repository might just return initial state?
    // But getMessages(roomId) implies persistence.
    
    // Since I cannot modify DB schema arbitrarily here without SQL migration workflow (which I can define but usually better to stick to existing),
    // AND the user asked to move from Mock to Supabase...
    // I will implement getRoom properly.
    // Ideally chat would be transient or stored. 
    // Let's Stub chat/participants for now or use a temporary approach if no table exists.
    // Actually, LiveRoom usually implies simple metadata fetch + Realtime subscription on client.
    // But the Repo interface has getMessages...
    
    // Logic:
    // getRoom -> Fetch live_session joined with course/instructor
    // getMessages -> Return empty [] if no table, or fix schema later.
    // getParticipants -> Return empty [] or fix schema later.

    async getRoom(roomId: string): Promise<LiveRoom | null> {
        // Fetch session by course_id (Legacy) or session id
        const { data, error } = await this.supabase
            .from('live_sessions')
            .select(`
                *,
                course:courses!course_id(
                    *,
                    category:categories(*)
                ),
                instructor:instructor_profiles!instructor_profile_id(
                    *,
                    profile:profiles(*)
                )
            `)
            .or(`course_id.eq.${roomId},id.eq.${roomId}`)
            .eq('status', 'live')
            .single();
            
        if (error || !data) return null;
        
        const instructorProfile = data.instructor?.profile;
        const category = data.course?.category;
        const color = category?.color || 'from-blue-500 to-purple-600';

        return {
            id: data.id, // Return actual session ID
            title: data.title,
            instructor: instructorProfile?.full_name || 'Unknown Instructor',
            instructorAvatar: instructorProfile?.avatar_url || '',
            tags: data.course?.tags || [],
            color: color,
            isLive: data.status === 'live',
            startTime: data.actual_start || data.scheduled_start
        };
    }

    async getMessages(roomId: string): Promise<ChatMessage[]> {
        const { data, error } = await this.supabase
            .from('live_chat_messages')
            .select(`
                *,
                profile:profiles(*)
            `)
            .eq('live_session_id', roomId)
            .order('created_at', { ascending: true });

        if (error || !data) return [];

        return data.map(msg => ({
            id: msg.id,
            user: msg.profile?.full_name || 'Anonymous',
            avatar: msg.profile?.avatar_url || '',
            text: msg.text,
            time: new Date(msg.created_at!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isInstructor: msg.is_instructor!
        }));
    }

    async getParticipants(roomId: string): Promise<Participant[]> {
        const { data, error } = await this.supabase
            .from('live_session_participants')
            .select(`
                *,
                profile:profiles(*)
            `)
            .eq('live_session_id', roomId)
            .is('left_at', null);

        if (error || !data) return [];

        return data.map(p => ({
            id: p.profile_id,
            name: p.profile?.full_name || 'Anonymous',
            avatar: p.profile?.avatar_url || ''
        }));
    }

    async sendMessage(roomId: string, profileId: string, text: string, isInstructor: boolean): Promise<ChatMessage> {
        const { data: msg, error } = await this.supabase
            .from('live_chat_messages')
            .insert({
                live_session_id: roomId,
                profile_id: profileId,
                text,
                is_instructor: isInstructor
            })
            .select(`
                *,
                profile:profiles(*)
            `)
            .single();

        if (error || !msg) throw new Error('Failed to send message');

        return {
            id: msg.id,
            user: msg.profile?.full_name || 'Me',
            avatar: msg.profile?.avatar_url || '',
            text: msg.text,
            time: new Date(msg.created_at!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isInstructor: msg.is_instructor!
        };
    }
}

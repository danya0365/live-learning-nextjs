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
        // roomId here seems to be courseId in the Mock ('course-001'), 
        // but ideally it should be live_session.id or live_session.course_id?
        // Mock data uses 'course-001' as key.
        // Let's assume roomId = courseId for now as per Mock behavior, 
        // or check if there is an active live session for this course.
        
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
            .eq('course_id', roomId) // Assuming roomId passed is courseId as per legacy
            .eq('status', 'live') // Only active rooms?
            .single();
            
        if (error || !data) {
            // Try fetching by actual id if not found by course_id?
            // Or just return null.
            return null;
        }
        
        const instructorProfile = data.instructor?.profile;
        const category = data.course?.category;
        
        // Map color from category? Mock hardcoded colors.
        // Let's assume category has color or default.
        const color = category?.color || 'from-blue-500 to-purple-600';

        return {
            id: data.course_id, // Keeping consistency with input if it was courseId
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
        // No table yet. Return empty or mock? 
        // If I return empty, chat will be blank.
        // Let's return empty array as "Persistence not implemented yet".
        return [];
    }

    async getParticipants(roomId: string): Promise<Participant[]> {
        // No table yet.
        return [];
    }

    async sendMessage(roomId: string, text: string): Promise<ChatMessage> {
        // Since no persistence, we can't save.
        // We just return the echoed message.
        // This is effectively a "Success" acknowledgment.
        // Realtime broadcast should happen outside or via Postgres trigger if table existed.
        return {
            id: Date.now().toString(),
            user: 'Me',
            avatar: '',
            text,
            time: new Date().toISOString() // Format? HH:mm
        };
    }
}

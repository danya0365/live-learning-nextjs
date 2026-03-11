import { ILiveSessionRepository } from '@/src/application/repositories/ILiveSessionRepository';
import { Database } from '@/src/domain/types/supabase';
import { LiveSession as DomainLiveSession } from '@/src/presentation/presenters/live/LiveSessionsPresenter';
import { SupabaseClient } from '@supabase/supabase-js';

type LiveSessionRow = Database['public']['Tables']['live_sessions']['Row'] & {
  course: Database['public']['Tables']['courses']['Row'];
  instructor_profile: Database['public']['Tables']['instructor_profiles']['Row'] & {
    profiles: Database['public']['Tables']['profiles']['Row'];
  };
};

export class SupabaseLiveSessionRepository implements ILiveSessionRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getActiveSessions(): Promise<DomainLiveSession[]> {
    const { data, error } = await this.supabase
      .from('live_sessions')
      .select(`
        *,
        course:courses!course_id(*),
        instructor_profile:instructor_profiles!instructor_profile_id(
          *,
          profiles(*)
        )
      `)
      .eq('status', 'live')
      .eq('is_active', true);

    if (error || !data) {
      console.error('Error fetching live sessions:', error);
      return [];
    }

    return (data as unknown as LiveSessionRow[]).map((row) => {
      const courseRow = row.course;
      const instructorProfile = row.instructor_profile;
      const profile = instructorProfile?.profiles;

      return {
        course: {
          id: courseRow.id,
          title: courseRow.title,
          description: courseRow.description || '',
          thumbnail: courseRow.thumbnail_url || '/images/placeholder-course.jpg',
          categoryId: courseRow.category_id || '',
          categoryName: 'Unknown Category',
          level: (courseRow.level as any) || 'beginner',
          durationMinutes: (courseRow.total_hours || 0) * 60,
          price: courseRow.price,
          rating: Number(courseRow.rating) || 0,
          totalStudents: courseRow.total_students || 0,
          instructorCount: 1,
          isLive: true,
          isActive: courseRow.is_active,
          tags: courseRow.tags || [],
          createdAt: courseRow.created_at || '',
          updatedAt: courseRow.updated_at || '',
        } as any,
        instructor: {
          id: instructorProfile?.id || '',
          name: profile?.full_name || 'Unknown Instructor',
          avatar: profile?.avatar_url || '/images/placeholder-avatar.jpg',
          isOnline: instructorProfile?.is_online || false,
        } as any,
        booking: null,
        viewerCount: row.viewer_count || 0,
      };
    });
  }
}

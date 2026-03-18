/**
 * LiveSessionsPresenter
 * Shows currently active live courses that students can join
 */

import {
  Booking,
  IBookingRepository,
} from '@/src/application/repositories/IBookingRepository';
import {
  Course,
  ICourseRepository,
} from '@/src/application/repositories/ICourseRepository';
import {
  IInstructorRepository,
  Instructor,
} from '@/src/application/repositories/IInstructorRepository';
import { ILiveSessionRepository } from '@/src/application/repositories/ILiveSessionRepository';

export interface LiveSession {
  course: Course;
  instructor: Instructor;
  booking: Booking | null;
  viewerCount: number;
}

export interface LiveSessionsViewModel {
  sessions: LiveSession[];
  totalLive: number;
}

export class LiveSessionsPresenter {
  constructor(
    private readonly courseRepository: ICourseRepository,
    private readonly instructorRepository: IInstructorRepository,
    private readonly bookingRepository: IBookingRepository,
    private readonly liveSessionRepository: ILiveSessionRepository,
  ) {}

  async getViewModel(): Promise<LiveSessionsViewModel> {
    // Fetch active sessions from the dedicated live sessions repository
    const sessions = await this.liveSessionRepository.getActiveSessions();

    return {
      sessions,
      totalLive: sessions.length,
    };
  }

  // ============================================================
  // GRANULAR DATA METHODS (For API Routes & Individual Actions)
  // ============================================================
  // ⚠️ API Routes MUST call these methods individually rather than using getViewModel()

  async getActiveSessions() {
    return await this.liveSessionRepository.getActiveSessions();
  }
}

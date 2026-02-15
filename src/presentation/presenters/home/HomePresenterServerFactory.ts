/**
 * HomePresenterServerFactory
 * Factory for creating HomePresenter on the server side
 * ✅ Injects Mock repositories for development
 */


import { MockBookingRepository } from '@/src/infrastructure/repositories/mock/MockBookingRepository';
// import { MockCategoryRepository } from '@/src/infrastructure/repositories/mock/MockCategoryRepository';
import { SupabaseCategoryRepository } from '@/src/infrastructure/repositories/supabase/SupabaseCategoryRepository';
// import { MockCourseRepository } from '@/src/infrastructure/repositories/mock/MockCourseRepository';
import { MockInstructorRepository } from '@/src/infrastructure/repositories/mock/MockInstructorRepository';
import { SupabaseCourseRepository } from '@/src/infrastructure/repositories/supabase/SupabaseCourseRepository';
import { createServerSupabaseClient } from '@/src/infrastructure/supabase/server';
import { HomePresenter } from './HomePresenter';

export class HomePresenterServerFactory {
  static async create(): Promise<HomePresenter> {
    const supabase = await createServerSupabaseClient();
    
    // Use Supabase Repository for Courses & Categories
    const courseRepository = new SupabaseCourseRepository(supabase);
    const categoryRepository = new SupabaseCategoryRepository(supabase);
    
    // Keep others as Mock for now until implemented
    const instructorRepository = new MockInstructorRepository();
    const bookingRepository = new MockBookingRepository();

    return new HomePresenter(courseRepository, instructorRepository, categoryRepository, bookingRepository);
  }
}

export async function createServerHomePresenter(): Promise<HomePresenter> {
  return HomePresenterServerFactory.create();
}


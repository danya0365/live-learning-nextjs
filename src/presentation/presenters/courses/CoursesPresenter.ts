/**
 * CoursesPresenter
 * Handles business logic for the Courses listing page
 */

import {
    Category,
    ICategoryRepository,
} from '@/src/application/repositories/ICategoryRepository';
import {
    Course,
    CourseStats,
    ICourseRepository,
} from '@/src/application/repositories/ICourseRepository';
import { type Metadata } from 'next';

export type CourseSortOption = 'popular' | 'rating' | 'price-asc' | 'price-desc' | 'newest';

export interface CoursesFilters {
  categoryId: string | null;
  level: string | null;
  search: string;
  sort: CourseSortOption;
}

export interface CoursesViewModel {
  courses: Course[];
  categories: Category[];
  stats: CourseStats;
  filters: CoursesFilters;
}

export class CoursesPresenter {
  constructor(
    private readonly courseRepository: ICourseRepository,
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async getViewModel(filters?: Partial<CoursesFilters>): Promise<CoursesViewModel> {
    const [allCourses, categories, stats] = await Promise.all([
      this.courseRepository.getAll(),
      this.categoryRepository.getAll(),
      this.courseRepository.getStats(),
    ]);

    const activeFilters: CoursesFilters = {
      categoryId: filters?.categoryId ?? null,
      level: filters?.level ?? null,
      search: filters?.search ?? '',
      sort: filters?.sort ?? 'popular',
    };

    const filtered = this.applyFilters(allCourses, activeFilters);

    return { courses: filtered, categories, stats, filters: activeFilters };
  }

  private applyFilters(courses: Course[], filters: CoursesFilters): Course[] {
    let result = [...courses];

    if (filters.categoryId) {
      result = result.filter((c) => c.categoryId === filters.categoryId);
    }
    if (filters.level) {
      result = result.filter((c) => c.level === filters.level);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    switch (filters.sort) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.totalStudents - a.totalStudents);
        break;
    }

    return result;
  }

  generateMetadata(): Metadata {
    return {
      title: 'คอร์สเรียนทั้งหมด — Live Learning',
      description: 'สำรวจคอร์สเรียนสดออนไลน์ทั้งหมด เลือกหมวดหมู่ ระดับ และอาจารย์ที่ต้องการ',
    };
  }
}

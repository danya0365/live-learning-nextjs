/**
 * InstructorsPresenter
 * Handles business logic for the Instructors listing page
 */

import {
    IInstructorRepository,
    Instructor,
} from '@/src/application/repositories/IInstructorRepository';
import { type Metadata } from 'next';

export type InstructorSortOption = 'rating' | 'students' | 'courses';

export interface InstructorsFilters {
  search: string;
  specialization: string | null;
  onlineOnly: boolean;
  sort: InstructorSortOption;
}

export interface InstructorsViewModel {
  instructors: Instructor[];
  allSpecializations: string[];
  filters: InstructorsFilters;
  totalCount: number;
}

export class InstructorsPresenter {
  constructor(private readonly instructorRepository: IInstructorRepository) {}

  async getViewModel(filters?: Partial<InstructorsFilters>): Promise<InstructorsViewModel> {
    const allInstructors = await this.instructorRepository.getAll();

    const activeFilters: InstructorsFilters = {
      search: filters?.search ?? '',
      specialization: filters?.specialization ?? null,
      onlineOnly: filters?.onlineOnly ?? false,
      sort: filters?.sort ?? 'rating',
    };

    // Collect all unique specializations
    const specSet = new Set<string>();
    allInstructors.forEach((i) => i.specializations.forEach((s) => specSet.add(s)));

    const filtered = this.applyFilters(allInstructors, activeFilters);

    return {
      instructors: filtered,
      allSpecializations: Array.from(specSet).sort(),
      filters: activeFilters,
      totalCount: allInstructors.length,
    };
  }

  private applyFilters(instructors: Instructor[], filters: InstructorsFilters): Instructor[] {
    let result = [...instructors];

    if (filters.specialization) {
      result = result.filter((i) => i.specializations.includes(filters.specialization!));
    }
    if (filters.onlineOnly) {
      result = result.filter((i) => i.isOnline);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.bio.toLowerCase().includes(q) ||
          i.specializations.some((s) => s.toLowerCase().includes(q)),
      );
    }

    switch (filters.sort) {
      case 'students':
        result.sort((a, b) => b.totalStudents - a.totalStudents);
        break;
      case 'courses':
        result.sort((a, b) => b.totalCourses - a.totalCourses);
        break;
      case 'rating':
      default:
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }

  generateMetadata(): Metadata {
    return {
      title: 'อาจารย์ผู้สอน — Live Learning',
      description: 'รวมอาจารย์ผู้เชี่ยวชาญจากสาขาต่างๆ พร้อมสอนสดออนไลน์',
    };
  }
}

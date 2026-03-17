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
    const { data: allInstructors } = await this.instructorRepository.getPaginated(1, 100);

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

  // ============================================================
  // GRANULAR DATA METHODS (For API Routes & Individual Actions)
  // ============================================================
  // ⚠️ API Routes MUST call these methods individually rather than using getViewModel()

  async getPaginated(page: number, perPage: number) {
    return await this.instructorRepository.getPaginated(page, perPage);
  }

  async getAvailable(): Promise<Instructor[]> {
    return await this.instructorRepository.getAvailable();
  }

  async getTopRated(limit: number): Promise<Instructor[]> {
    return await this.instructorRepository.getTopRated(limit);
  }

  async getAll(): Promise<Instructor[]> {
    return await this.instructorRepository.getAll();
  }

  async getById(id: string): Promise<Instructor | null> {
    return await this.instructorRepository.getById(id);
  }

  async getByProfileId(profileId: string): Promise<Instructor | null> {
    return await this.instructorRepository.getByProfileId(profileId);
  }

  async create(data: any): Promise<Instructor> {
    return await this.instructorRepository.create(data);
  }

  async update(id: string, data: any): Promise<Instructor> {
    return await this.instructorRepository.update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return await this.instructorRepository.delete(id);
  }

  async getStats() {
    return await this.instructorRepository.getStats();
  }

  async addAvailability(instructorId: string, dayOfWeek: number, startTime: string, endTime: string) {
    return await this.instructorRepository.addAvailability(instructorId, dayOfWeek, startTime, endTime);
  }

  async getAvailabilities(instructorId: string) {
    return await this.instructorRepository.getAvailabilities(instructorId);
  }

  async deleteAvailability(availabilityId: string) {
    return await this.instructorRepository.deleteAvailability(availabilityId);
  }
}

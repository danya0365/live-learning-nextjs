/**
 * CategoriesPresenter
 * Handles business logic for the Categories browsing page
 */

import {
    Category,
    ICategoryRepository,
} from '@/src/application/repositories/ICategoryRepository';
import {
    Course,
    ICourseRepository,
} from '@/src/application/repositories/ICourseRepository';

export interface CategoryWithCourses {
  category: Category;
  topCourses: Course[];
}

export interface CategoriesViewModel {
  categories: CategoryWithCourses[];
  totalCategories: number;
  totalCourses: number;
}

export class CategoriesPresenter {
  constructor(
    private readonly categoryRepository: ICategoryRepository,
    private readonly courseRepository: ICourseRepository,
  ) {}

  async getViewModel(): Promise<CategoriesViewModel> {
    const [categories, allCourses] = await Promise.all([
      this.categoryRepository.getAll(),
      this.courseRepository.getAll(),
    ]);

    const activeCategories = categories.filter((c) => c.isActive);

    const categoriesWithCourses: CategoryWithCourses[] = activeCategories.map((category) => {
      const coursesInCategory = allCourses
        .filter((c) => c.tags.some((tag) => category.name.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(category.name.split(' ')[0].toLowerCase())))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);

      return {
        category,
        topCourses: coursesInCategory,
      };
    });

    return {
      categories: categoriesWithCourses,
      totalCategories: activeCategories.length,
      totalCourses: allCourses.filter((c) => c.isActive).length,
    };
  }
}

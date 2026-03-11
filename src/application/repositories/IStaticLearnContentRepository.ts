/**
 * IStaticLearnContentRepository
 * Repository interface for static Learn / Interactive Lab data
 * Following Clean Architecture - Application layer
 */

import { LearnCourse, LearnLesson, LearnTopic } from "@/src/domain/types/learn-content";

export interface IStaticLearnContentRepository {
  /**
   * Get all available courses
   */
  getAllCourses(): Promise<LearnCourse[]>;

  /**
   * Get course by its specific string ID/slug
   */
  getCourseBySlug(slug: string): Promise<LearnCourse | null>;

  /**
   * Get all course slugs
   */
  getValidCourseSlugs(): Promise<string[]>;

  /**
   * Get all topics available in the platform
   */
  getAllTopics(): Promise<LearnTopic[]>;

  /**
   * Get topics for a specific course
   */
  getTopicsForCourse(courseSlug: string): Promise<LearnTopic[]>;

  /**
   * Get topic by its slug
   */
  getTopicBySlug(slug: string): Promise<LearnTopic | null>;

  /**
   * Get all lessons available in the platform
   */
  getAllLessons(): Promise<LearnLesson[]>;

  /**
   * Get lessons by their parent topic ID
   */
  getLessonsByTopic(topicId: string): Promise<LearnLesson[]>;

  /**
   * Get specifically requested lesson by topic slug and lesson slug
   */
  getLessonBySlug(topicSlug: string, lessonSlug: string): Promise<LearnLesson | null>;
}

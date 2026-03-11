/**
 * StaticLearnContentRepository
 * Implementation of IStaticLearnContentRepository reading from static JS/TS master data
 * Following Clean Architecture - Infrastructure layer
 * 
 * ✅ For reading static lab/learn content specifically.
 */

import { IStaticLearnContentRepository } from "@/src/application/repositories/IStaticLearnContentRepository";
import {
  learnCourses,
  getCourseBySlug as masterGetCourseBySlug,
  getValidCourseSlugs as masterGetValidCourseSlugs
} from "@/src/data/static/learnCourses";
import { learnLessons, getLessonBySlug as masterGetLessonBySlug, getLessonsByTopic as masterGetLessonsByTopic } from "@/src/data/static/learnLessons";
import { learnTopics, getTopicBySlug as masterGetTopicBySlug, getTopicsForCourse as masterGetTopicsForCourse } from "@/src/data/static/learnTopics";
import { LearnCourse, LearnLesson, LearnTopic } from "@/src/domain/types/learn-content";

export class StaticLearnContentRepository implements IStaticLearnContentRepository {
  async getAllCourses(): Promise<LearnCourse[]> {
    await this.delay(50);
    return [...learnCourses];
  }

  async getCourseBySlug(slug: string): Promise<LearnCourse | null> {
    await this.delay(50);
    return masterGetCourseBySlug(slug) || null;
  }

  async getValidCourseSlugs(): Promise<string[]> {
    await this.delay(50);
    return masterGetValidCourseSlugs();
  }

  async getAllTopics(): Promise<LearnTopic[]> {
    await this.delay(50);
    return [...learnTopics];
  }

  async getTopicsForCourse(courseSlug: string): Promise<LearnTopic[]> {
    await this.delay(50);
    return masterGetTopicsForCourse(courseSlug);
  }

  async getTopicBySlug(slug: string): Promise<LearnTopic | null> {
    await this.delay(50);
    return masterGetTopicBySlug(slug) || null;
  }

  async getAllLessons(): Promise<LearnLesson[]> {
    await this.delay(50);
    return [...learnLessons];
  }

  async getLessonsByTopic(topicId: string): Promise<LearnLesson[]> {
    await this.delay(50);
    return masterGetLessonsByTopic(topicId);
  }

  async getLessonBySlug(topicSlug: string, lessonSlug: string): Promise<LearnLesson | null> {
    await this.delay(50);
    return masterGetLessonBySlug(topicSlug, lessonSlug) || null;
  }

  /**
   * Simulate a slight network delay to mimic db access
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance for convenience
export const staticLearnContentRepository = new StaticLearnContentRepository();

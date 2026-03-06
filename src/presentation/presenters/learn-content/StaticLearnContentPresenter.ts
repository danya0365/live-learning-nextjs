/**
 * StaticLearnContentPresenter
 * Presenter for retrieving Learn / Lab static content
 * Receives IStaticLearnContentRepository via dependency injection
 */

import { IStaticLearnContentRepository } from "@/src/application/repositories/IStaticLearnContentRepository";
import { LearnCourse, LearnLesson, LearnTopic } from "@/src/domain/types/learn-content";

export class StaticLearnContentPresenter {
  constructor(private readonly repository: IStaticLearnContentRepository) {}

  async getAllCourses(): Promise<LearnCourse[]> {
    try {
      return await this.repository.getAllCourses();
    } catch (error) {
      console.error('Error fetching all courses:', error);
      throw error;
    }
  }

  async getCourseBySlug(slug: string): Promise<LearnCourse | null> {
    try {
      return await this.repository.getCourseBySlug(slug);
    } catch (error) {
      console.error(`Error fetching course ${slug}:`, error);
      throw error;
    }
  }

  async getValidCourseSlugs(): Promise<string[]> {
    try {
      return await this.repository.getValidCourseSlugs();
    } catch (error) {
      console.error('Error fetching valid course slugs:', error);
      throw error;
    }
  }

  async getAllTopics(): Promise<LearnTopic[]> {
    try {
      return await this.repository.getAllTopics();
    } catch (error) {
      console.error('Error fetching all topics:', error);
      throw error;
    }
  }

  async getTopicsForCourse(courseSlug: string): Promise<LearnTopic[]> {
    try {
      return await this.repository.getTopicsForCourse(courseSlug);
    } catch (error) {
      console.error(`Error fetching topics for course ${courseSlug}:`, error);
      throw error;
    }
  }

  async getTopicBySlug(slug: string): Promise<LearnTopic | null> {
    try {
      return await this.repository.getTopicBySlug(slug);
    } catch (error) {
      console.error(`Error fetching topic ${slug}:`, error);
      throw error;
    }
  }

  async getAllLessons(): Promise<LearnLesson[]> {
    try {
      return await this.repository.getAllLessons();
    } catch (error) {
      console.error('Error fetching all lessons:', error);
      throw error;
    }
  }

  async getLessonsByTopic(topicId: string): Promise<LearnLesson[]> {
    try {
      return await this.repository.getLessonsByTopic(topicId);
    } catch (error) {
      console.error(`Error fetching lessons for topic ${topicId}:`, error);
      throw error;
    }
  }

  async getLessonBySlug(topicSlug: string, lessonSlug: string): Promise<LearnLesson | null> {
    try {
      return await this.repository.getLessonBySlug(topicSlug, lessonSlug);
    } catch (error) {
      console.error(`Error fetching lesson ${lessonSlug} for topic ${topicSlug}:`, error);
      throw error;
    }
  }
}

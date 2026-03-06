export interface LearnCourse {
  id: string;
  slug: string;
  title: string;
  titleTh: string;
  description: string;
  descriptionTh: string;
  icon: string;
  color: string;
  bgGradient: string;
  order: number;
}

export interface LearnTopic {
  id: string;
  slug: string;
  title: string;
  titleTh: string;
  description: string;
  descriptionTh: string;
  icon: string;
  color: string;
  order: number;
  lessonCount: number;
  courseSlug: string;
}

export interface LearnLesson {
  id: string;
  topicId: string;
  slug: string;
  title: string;
  titleTh: string;
  description: string;
  content: string;
  order: number;
  duration: number;
  codeExample?: string;
  challenge?: {
    description: string;
    starterCode: string;
    expectedOutput: string;
    hints: string[];
  };
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number; // index of correct option (0-based)
  }[];
}

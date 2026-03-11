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
  hasLab?: boolean;
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
  contentType?: 'markdown' | 'component'; // default: 'markdown'
  contentComponent?: string; // component key for custom rendering (used when contentType is 'component')
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

export interface LabSidebarItem {
  id: string;
  title: string;
  icon?: string;
  group?: string;
}

export interface LabViewProps {
  lesson?: LearnLesson;
  onSidebarUpdate?: (items: LabSidebarItem[], activeId: string) => void;
  activeSidebarItemId?: string;
  onExit?: () => void;
}

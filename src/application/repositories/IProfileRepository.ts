export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  level: string;
}

export interface Achievement {
  icon: string;
  label: string;
  description: string;
}

export interface IProfileRepository {
  getProfile(studentId: string): Promise<StudentProfile | null>;
  getAchievements(studentId: string): Promise<Achievement[]>;
}

import { IEnrollmentRepository } from '@/src/application/repositories/IEnrollmentRepository';

export class EnrollmentsPresenter {
  constructor(private readonly repo: IEnrollmentRepository) {}

  // ============================================================
  // GRANULAR DATA METHODS (For API Routes & Individual Actions)
  // ============================================================
  // ⚠️ API Routes MUST call these methods individually rather than using getViewModel()

  async getMyEnrollments() {
    return await this.repo.getMyEnrollments();
  }

  async checkEnrollment(courseId: string) {
    return await this.repo.checkEnrollment(courseId);
  }

  async createEnrollment(data: { courseId: string; paymentId?: string }) {
    return await this.repo.createEnrollment(data);
  }
}

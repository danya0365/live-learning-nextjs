/**
 * ConsultationsPresenter
 * Student view: my consultation requests + offers received
 */

import {
    ConsultationOffer,
    ConsultationRequest,
    ConsultationRequestStats,
    ConsultationRequestStatus,
    CreateConsultationRequestPayload,
    IConsultationRepository
} from '@/src/application/repositories/IConsultationRepository';

export type ConsultationFilter = 'all' | ConsultationRequestStatus;

export interface ConsultationsViewModel {
  requests: ConsultationRequest[];
  stats: ConsultationRequestStats;
  filter: ConsultationFilter;
  selectedRequest: ConsultationRequest | null;
  selectedRequestOffers: ConsultationOffer[];
}

export class ConsultationsPresenter {
  constructor(private readonly repo: IConsultationRepository) {}

  async getViewModel(
    studentId: string,
    filter: ConsultationFilter = 'all',
  ): Promise<ConsultationsViewModel> {
    const [allRequests, stats] = await Promise.all([
      this.repo.getRequestsByStudentId(studentId),
      this.repo.getRequestStats(studentId),
    ]);

    const filteredRequests =
      filter === 'all'
        ? allRequests
        : allRequests.filter((r) => r.status === filter);

    return {
      requests: filteredRequests,
      stats,
      filter,
      selectedRequest: null,
      selectedRequestOffers: [],
    };
  }

  async getRequestDetail(requestId: string): Promise<{
    request: ConsultationRequest | null;
    offers: ConsultationOffer[];
  }> {
    const [request, offers] = await Promise.all([
      this.repo.getRequestById(requestId),
      this.repo.getOffersByRequestId(requestId),
    ]);
    return { request, offers };
  }

  async acceptOffer(offerId: string): Promise<ConsultationOffer> {
    return this.repo.acceptOffer(offerId);
  }

  async rejectOffer(offerId: string): Promise<ConsultationOffer> {
    return this.repo.rejectOffer(offerId);
  }

  async cancelRequest(requestId: string): Promise<ConsultationRequest> {
    return this.repo.cancelRequest(requestId);
  }

  async createRequest(data: CreateConsultationRequestPayload, studentId: string): Promise<ConsultationRequest> {
    return this.repo.createRequest(data, studentId);
  }

  // ============================================================
  // GRANULAR DATA METHODS (For API Routes & Individual Actions)
  // ============================================================
  // ⚠️ API Routes MUST call these methods individually rather than using getViewModel()

  async getRequestsByCategory(categoryId: string) {
    return await this.repo.getRequestsByCategory(categoryId);
  }

  async getOpenRequests() {
    return await this.repo.getOpenRequests();
  }

  async getAllRequests() {
    return await this.repo.getAllRequests();
  }

  async getOffersByInstructorId(instructorId: string) {
    return await this.repo.getOffersByInstructorId(instructorId);
  }

  async getRequestById(requestId: string) {
    return await this.repo.getRequestById(requestId);
  }

  async getRequestsByStudentId(studentId: string) {
    return await this.repo.getRequestsByStudentId(studentId);
  }

  async getRequestStats(studentId: string) {
    return await this.repo.getRequestStats(studentId);
  }

  async getOfferById(offerId: string) {
    return await this.repo.getOfferById(offerId);
  }

  async getOffersByRequestId(requestId: string) {
    return await this.repo.getOffersByRequestId(requestId);
  }

  async createOffer(data: any, instructorId: string) {
    return await this.repo.createOffer(data, instructorId);
  }

  async withdrawOffer(offerId: string) {
    return await this.repo.withdrawOffer(offerId);
  }

  async updateRequestStatus(requestId: string, status: ConsultationRequestStatus) {
    return await this.repo.updateRequestStatus(requestId, status);
  }
}

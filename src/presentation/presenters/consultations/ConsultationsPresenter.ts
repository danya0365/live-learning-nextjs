/**
 * ConsultationsPresenter
 * Student view: my consultation requests + offers received
 */

import {
    ConsultationOffer,
    ConsultationRequest,
    ConsultationRequestStats,
    ConsultationRequestStatus,
    CreateConsultationRequestData,
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

  async createRequest(data: CreateConsultationRequestData): Promise<ConsultationRequest> {
    return this.repo.createRequest(data);
  }
}

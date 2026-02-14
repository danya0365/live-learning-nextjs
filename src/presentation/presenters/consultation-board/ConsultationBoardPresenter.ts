/**
 * ConsultationBoardPresenter
 * Instructor view: browse open requests and submit offers
 */

import {
    ConsultationOffer,
    ConsultationRequest,
    CreateConsultationOfferData,
    IConsultationRepository,
} from '@/src/application/repositories/IConsultationRepository';

export interface ConsultationBoardViewModel {
  openRequests: ConsultationRequest[];
  myOffers: ConsultationOffer[];
  selectedCategoryId: string | null;
}

export class ConsultationBoardPresenter {
  constructor(private readonly repo: IConsultationRepository) {}

  async getViewModel(
    instructorId: string,
    categoryId: string | null = null,
  ): Promise<ConsultationBoardViewModel> {
    const [allOpenRequests, myOffers] = await Promise.all([
      categoryId
        ? this.repo.getRequestsByCategory(categoryId)
        : this.repo.getOpenRequests(),
      this.repo.getOffersByInstructorId(instructorId),
    ]);

    return {
      openRequests: allOpenRequests,
      myOffers,
      selectedCategoryId: categoryId,
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

  async submitOffer(data: CreateConsultationOfferData): Promise<ConsultationOffer> {
    return this.repo.createOffer(data);
  }

  async withdrawOffer(offerId: string): Promise<ConsultationOffer> {
    return this.repo.withdrawOffer(offerId);
  }
}

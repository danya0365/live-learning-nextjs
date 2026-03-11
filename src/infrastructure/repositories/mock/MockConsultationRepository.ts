/**
 * MockConsultationRepository
 * Mock implementation for development and testing
 * Following Clean Architecture - Infrastructure layer
 */

import {
  ConsultationOffer,
  ConsultationRequest,
  ConsultationRequestStats,
  ConsultationRequestStatus,
  CreateConsultationOfferPayload,
  CreateConsultationRequestPayload,
  IConsultationRepository,
} from '@/src/application/repositories/IConsultationRepository';
import { MOCK_OFFERS, MOCK_REQUESTS } from '@/src/data/mock/consultations';

export class MockConsultationRepository implements IConsultationRepository {
  private requests: ConsultationRequest[] = [...MOCK_REQUESTS];
  private offers: ConsultationOffer[] = [...MOCK_OFFERS];

  // ==================== Requests ====================

  async getRequestById(id: string): Promise<ConsultationRequest | null> {
    await this.delay(100);
    return this.requests.find((r) => r.id === id) || null;
  }

  async getAllRequests(): Promise<ConsultationRequest[]> {
    await this.delay(100);
    return [...this.requests].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  async getOpenRequests(): Promise<ConsultationRequest[]> {
    await this.delay(100);
    return this.requests
      .filter((r) => r.status === 'open')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getRequestsByStudentId(studentId: string): Promise<ConsultationRequest[]> {
    await this.delay(100);
    return this.requests
      .filter((r) => r.studentId === studentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getRequestsByCategory(categoryId: string): Promise<ConsultationRequest[]> {
    await this.delay(100);
    return this.requests
      .filter((r) => r.categoryId === categoryId && r.status === 'open')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createRequest(data: CreateConsultationRequestPayload): Promise<ConsultationRequest> {
    await this.delay(200);
    const newReq: ConsultationRequest = {
      id: `req-${Date.now()}`,
      ...data,
      studentId: 'student-001', // 🔒 Mock: auto-assigned (server resolves in prod)
      studentName: 'Mock Student',
      studentAvatar: '',
      categoryName: '',
      categoryIcon: '',
      status: 'open',
      offersCount: 0,
      acceptedOfferId: null,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.requests.unshift(newReq);
    return newReq;
  }

  async updateRequestStatus(id: string, status: ConsultationRequestStatus): Promise<ConsultationRequest> {
    await this.delay(200);
    const idx = this.requests.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Request not found');
    this.requests[idx] = { ...this.requests[idx], status, updatedAt: new Date().toISOString() };
    return this.requests[idx];
  }

  async cancelRequest(id: string): Promise<ConsultationRequest> {
    return this.updateRequestStatus(id, 'cancelled');
  }

  async getRequestStats(studentId?: string): Promise<ConsultationRequestStats> {
    await this.delay(100);
    const reqs = studentId
      ? this.requests.filter((r) => r.studentId === studentId)
      : this.requests;
    return {
      totalRequests: reqs.length,
      openRequests: reqs.filter((r) => r.status === 'open').length,
      inProgressRequests: reqs.filter((r) => r.status === 'in_progress').length,
      closedRequests: reqs.filter((r) => r.status === 'closed').length,
      cancelledRequests: reqs.filter((r) => r.status === 'cancelled').length,
      totalOffers: reqs.reduce((sum, r) => sum + r.offersCount, 0),
    };
  }

  // ==================== Offers ====================

  async getOfferById(id: string): Promise<ConsultationOffer | null> {
    await this.delay(100);
    return this.offers.find((o) => o.id === id) || null;
  }

  async getOffersByRequestId(requestId: string): Promise<ConsultationOffer[]> {
    await this.delay(100);
    return this.offers
      .filter((o) => o.requestId === requestId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getOffersByInstructorId(instructorId: string): Promise<ConsultationOffer[]> {
    await this.delay(100);
    return this.offers
      .filter((o) => o.instructorId === instructorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createOffer(data: CreateConsultationOfferPayload): Promise<ConsultationOffer> {
    await this.delay(200);
    const newOffer: ConsultationOffer = {
      id: `offer-${Date.now()}`,
      ...data,
      instructorId: 'inst-001', // 🔒 Mock: auto-assigned (server resolves in prod)
      instructorName: 'Mock Instructor',
      instructorAvatar: '',
      instructorRating: 0,
      instructorSpecializations: [],
      status: 'pending',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.offers.unshift(newOffer);

    // Increment offers_count
    const reqIdx = this.requests.findIndex((r) => r.id === data.requestId);
    if (reqIdx !== -1) {
      this.requests[reqIdx] = {
        ...this.requests[reqIdx],
        offersCount: this.requests[reqIdx].offersCount + 1,
      };
    }
    return newOffer;
  }

  async acceptOffer(offerId: string): Promise<ConsultationOffer> {
    await this.delay(200);
    const idx = this.offers.findIndex((o) => o.id === offerId);
    if (idx === -1) throw new Error('Offer not found');
    this.offers[idx] = { ...this.offers[idx], status: 'accepted', updatedAt: new Date().toISOString() };

    // Update request status
    const reqIdx = this.requests.findIndex((r) => r.id === this.offers[idx].requestId);
    if (reqIdx !== -1) {
      this.requests[reqIdx] = {
        ...this.requests[reqIdx],
        status: 'in_progress',
        acceptedOfferId: offerId,
        updatedAt: new Date().toISOString(),
      };
    }

    // Reject other offers
    this.offers.forEach((o, i) => {
      if (o.requestId === this.offers[idx].requestId && o.id !== offerId && o.status === 'pending') {
        this.offers[i] = { ...o, status: 'rejected', updatedAt: new Date().toISOString() };
      }
    });

    return this.offers[idx];
  }

  async rejectOffer(offerId: string): Promise<ConsultationOffer> {
    await this.delay(200);
    const idx = this.offers.findIndex((o) => o.id === offerId);
    if (idx === -1) throw new Error('Offer not found');
    this.offers[idx] = { ...this.offers[idx], status: 'rejected', updatedAt: new Date().toISOString() };
    return this.offers[idx];
  }

  async withdrawOffer(offerId: string): Promise<ConsultationOffer> {
    await this.delay(200);
    const idx = this.offers.findIndex((o) => o.id === offerId);
    if (idx === -1) throw new Error('Offer not found');
    this.offers[idx] = { ...this.offers[idx], status: 'withdrawn', updatedAt: new Date().toISOString() };
    return this.offers[idx];
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockConsultationRepository = new MockConsultationRepository();

/**
 * ApiConsultationRepository
 * Implements IConsultationRepository using API calls
 * 
 * ✅ For use in CLIENT-SIDE components only
 */

'use client';

import {
  ConsultationOffer,
  ConsultationRequest,
  ConsultationRequestStats,
  ConsultationRequestStatus,
  CreateConsultationOfferData,
  CreateConsultationRequestData,
  IConsultationRepository
} from '@/src/application/repositories/IConsultationRepository';

export class ApiConsultationRepository implements IConsultationRepository {
  private baseUrl = '/api/consultations';

  // ============================================================
  // REQUESTS - READ
  // ============================================================

  async getRequestById(id: string): Promise<ConsultationRequest | null> {
    const res = await fetch(`${this.baseUrl}/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch request');
    return res.json();
  }

  async getAllRequests(): Promise<ConsultationRequest[]> {
    const res = await fetch(this.baseUrl);
    if (!res.ok) throw new Error('Failed to fetch requests');
    return res.json();
  }

  async getOpenRequests(): Promise<ConsultationRequest[]> {
    const res = await fetch(`${this.baseUrl}?status=open`);
    if (!res.ok) throw new Error('Failed to fetch open requests');
    return res.json();
  }

  async getRequestsByStudentId(studentId: string): Promise<ConsultationRequest[]> {
    // SECURE: Use specific sub-route for authenticated student's requests
    // Ignores studentId param as we trust the session
    const res = await fetch(`${this.baseUrl}/student`);
    if (!res.ok) throw new Error('Failed to fetch student requests');
    return res.json();
  }

  async getRequestsByCategory(categoryId: string): Promise<ConsultationRequest[]> {
    const res = await fetch(`${this.baseUrl}?categoryId=${categoryId}`);
    if (!res.ok) throw new Error('Failed to fetch category requests');
    return res.json();
  }

  async getRequestStats(studentId?: string): Promise<ConsultationRequestStats> {
    let url = `${this.baseUrl}/stats`;
    if (studentId) url += `?studentId=${studentId}`;
    
    const res = await fetch(url);
    if (!res.ok) {
        return {
            totalRequests: 0,
            openRequests: 0,
            inProgressRequests: 0,
            closedRequests: 0,
            cancelledRequests: 0,
            totalOffers: 0
        };
    }
    return res.json();
  }

  // ============================================================
  // REQUESTS - WRITE
  // ============================================================

  async createRequest(data: CreateConsultationRequestData): Promise<ConsultationRequest> {
    const { studentId, ...payload } = data;
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create request');
    return res.json();
  }

  async updateRequestStatus(id: string, status: ConsultationRequestStatus): Promise<ConsultationRequest> {
    const res = await fetch(`${this.baseUrl}/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update request status');
    return res.json();
  }

  async cancelRequest(id: string): Promise<ConsultationRequest> {
    return this.updateRequestStatus(id, 'cancelled');
  }

  // ============================================================
  // OFFERS - READ
  // ============================================================

  async getOfferById(id: string): Promise<ConsultationOffer | null> {
    const res = await fetch(`${this.baseUrl}/offers/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch offer');
    return res.json();
  }

  async getOffersByRequestId(requestId: string): Promise<ConsultationOffer[]> {
    const res = await fetch(`${this.baseUrl}/${requestId}/offers`);
    if (!res.ok) throw new Error('Failed to fetch offers');
    return res.json();
  }

  async getOffersByInstructorId(instructorId: string): Promise<ConsultationOffer[]> {
    const res = await fetch(`${this.baseUrl}/offers?instructorId=${instructorId}`);
    if (!res.ok) throw new Error('Failed to fetch instructor offers');
    return res.json();
  }

  // ============================================================
  // OFFERS - WRITE
  // ============================================================

  async createOffer(data: CreateConsultationOfferData): Promise<ConsultationOffer> {
    const { instructorId, ...payload } = data;
    const res = await fetch(`${this.baseUrl}/${data.requestId}/offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create offer');
    return res.json();
  }

  async acceptOffer(offerId: string): Promise<ConsultationOffer> {
    const res = await fetch(`${this.baseUrl}/offers/${offerId}/accept`, {
        method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to accept offer');
    return res.json();
  }

  async rejectOffer(offerId: string): Promise<ConsultationOffer> {
    const res = await fetch(`${this.baseUrl}/offers/${offerId}/reject`, {
        method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to reject offer');
    return res.json();
  }

  async withdrawOffer(offerId: string): Promise<ConsultationOffer> {
    const res = await fetch(`${this.baseUrl}/offers/${offerId}/withdraw`, {
        method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to withdraw offer');
    return res.json();
  }
}

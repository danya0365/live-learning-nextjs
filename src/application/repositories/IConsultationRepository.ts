/**
 * IConsultationRepository
 * Repository interface for Consultation Requests & Offers
 * Following Clean Architecture - Application layer
 */

export type ConsultationRequestStatus = 'open' | 'in_progress' | 'closed' | 'cancelled';
export type ConsultationOfferStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';
export type ConsultationLevel = 'beginner' | 'intermediate' | 'advanced';

export interface PreferredTime {
  start: string; // "HH:mm"
  end: string;   // "HH:mm"
}

export interface ConsultationRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  title: string;
  description: string;
  level: ConsultationLevel;
  budgetMin: number;
  budgetMax: number;
  preferredDates: string[];
  preferredTimes: PreferredTime[];
  status: ConsultationRequestStatus;
  offersCount: number;
  acceptedOfferId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationOffer {
  id: string;
  requestId: string;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  instructorRating: number;
  instructorSpecializations: string[];
  message: string;
  offeredPrice: number;
  offeredDate: string;
  offeredStartTime: string;
  offeredEndTime: string;
  status: ConsultationOfferStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationRequestStats {
  totalRequests: number;
  openRequests: number;
  inProgressRequests: number;
  closedRequests: number;
  cancelledRequests: number;
  totalOffers: number;
}

export interface CreateConsultationRequestData {
  studentId: string;
  categoryId: string;
  title: string;
  description: string;
  level: ConsultationLevel;
  budgetMin: number;
  budgetMax: number;
  preferredDates: string[];
  preferredTimes: PreferredTime[];
}

export interface CreateConsultationOfferData {
  requestId: string;
  instructorId: string;
  message: string;
  offeredPrice: number;
  offeredDate: string;
  offeredStartTime: string;
  offeredEndTime: string;
}

export interface IConsultationRepository {
  // Requests
  getRequestById(id: string): Promise<ConsultationRequest | null>;
  getAllRequests(): Promise<ConsultationRequest[]>;
  getOpenRequests(): Promise<ConsultationRequest[]>;
  getRequestsByStudentId(studentId: string): Promise<ConsultationRequest[]>;
  getRequestsByCategory(categoryId: string): Promise<ConsultationRequest[]>;
  createRequest(data: CreateConsultationRequestData): Promise<ConsultationRequest>;
  updateRequestStatus(id: string, status: ConsultationRequestStatus): Promise<ConsultationRequest>;
  cancelRequest(id: string): Promise<ConsultationRequest>;
  getRequestStats(studentId?: string): Promise<ConsultationRequestStats>;

  // Offers
  getOfferById(id: string): Promise<ConsultationOffer | null>;
  getOffersByRequestId(requestId: string): Promise<ConsultationOffer[]>;
  getOffersByInstructorId(instructorId: string): Promise<ConsultationOffer[]>;
  createOffer(data: CreateConsultationOfferData): Promise<ConsultationOffer>;
  acceptOffer(offerId: string): Promise<ConsultationOffer>;
  rejectOffer(offerId: string): Promise<ConsultationOffer>;
  withdrawOffer(offerId: string): Promise<ConsultationOffer>;
}

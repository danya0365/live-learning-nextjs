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

const MOCK_REQUESTS: ConsultationRequest[] = [
  {
    id: 'req-001',
    studentId: 'student-001',
    studentName: 'น้องมิน',
    studentAvatar: '🧑‍💻',
    categoryId: 'cat-001',
    categoryName: 'Web Development',
    categoryIcon: '🌐',
    title: 'ช่วยสอน Next.js App Router + Server Components',
    description: 'ผมกำลังทำโปรเจกต์ส่งมหาลัย ต้องใช้ Next.js 14 แต่ยังไม่เข้าใจ App Router กับ Server Components ดีพอ อยากได้คนสอนแบบ 1-on-1 ประมาณ 2-3 ชม. ครับ',
    level: 'intermediate',
    budgetMin: 500,
    budgetMax: 1500,
    preferredDates: ['2026-03-20', '2026-03-21', '2026-03-22'],
    preferredTimes: [{ start: '13:00', end: '16:00' }, { start: '18:00', end: '21:00' }],
    status: 'open',
    offersCount: 2,
    acceptedOfferId: null,
    isActive: true,
    createdAt: '2026-02-10T08:00:00.000Z',
    updatedAt: '2026-02-10T08:00:00.000Z',
  },
  {
    id: 'req-002',
    studentId: 'student-002',
    studentName: 'น้องเบล',
    studentAvatar: '👩‍🎓',
    categoryId: 'cat-002',
    categoryName: 'Data Science & AI',
    categoryIcon: '🤖',
    title: 'ต้องการปรึกษาเรื่อง Fine-tuning LLM',
    description: 'กำลังทำ thesis เกี่ยวกับ Fine-tuning LLM สำหรับภาษาไทย ต้องการคนเชี่ยวชาญ NLP มาช่วยให้คำปรึกษาว่าควรเลือก model อะไร และวิธี fine-tune ที่เหมาะสม',
    level: 'advanced',
    budgetMin: 1500,
    budgetMax: 3000,
    preferredDates: ['2026-03-18', '2026-03-19'],
    preferredTimes: [{ start: '09:00', end: '12:00' }],
    status: 'open',
    offersCount: 1,
    acceptedOfferId: null,
    isActive: true,
    createdAt: '2026-02-11T10:30:00.000Z',
    updatedAt: '2026-02-11T10:30:00.000Z',
  },
  {
    id: 'req-003',
    studentId: 'student-003',
    studentName: 'น้องบอส',
    studentAvatar: '🧑‍🎓',
    categoryId: 'cat-003',
    categoryName: 'Design',
    categoryIcon: '🎨',
    title: 'อยากเรียน Figma สร้าง Design System ตั้งแต่ 0',
    description: 'ผมเป็น developer แต่ต้องทำ design เองด้วย อยากเรียนวิธีสร้าง Design System ใน Figma ที่ใช้งานได้จริง ตั้งแต่ Typography, Colors, Components',
    level: 'beginner',
    budgetMin: 400,
    budgetMax: 800,
    preferredDates: ['2026-03-22', '2026-03-23'],
    preferredTimes: [{ start: '10:00', end: '12:00' }, { start: '14:00', end: '17:00' }],
    status: 'in_progress',
    offersCount: 3,
    acceptedOfferId: 'offer-005',
    isActive: true,
    createdAt: '2026-02-08T06:00:00.000Z',
    updatedAt: '2026-02-12T09:00:00.000Z',
  },
  {
    id: 'req-004',
    studentId: 'student-004',
    studentName: 'น้องฟ้า',
    studentAvatar: '👧',
    categoryId: 'cat-004',
    categoryName: 'Mobile Development',
    categoryIcon: '📱',
    title: 'สอนทำ Flutter App เชื่อมต่อ Firebase',
    description: 'อยากทำแอปมือถือส่งงาน ใช้ Flutter + Firebase Authentication + Cloud Firestore ต้องการคนสอนทำ step by step',
    level: 'beginner',
    budgetMin: 600,
    budgetMax: 1200,
    preferredDates: ['2026-03-25', '2026-03-26', '2026-03-27'],
    preferredTimes: [{ start: '16:00', end: '19:00' }],
    status: 'open',
    offersCount: 0,
    acceptedOfferId: null,
    isActive: true,
    createdAt: '2026-02-13T07:00:00.000Z',
    updatedAt: '2026-02-13T07:00:00.000Z',
  },
  {
    id: 'req-005',
    studentId: 'student-001',
    studentName: 'น้องมิน',
    studentAvatar: '🧑‍💻',
    categoryId: 'cat-005',
    categoryName: 'Cybersecurity',
    categoryIcon: '🛡️',
    title: 'สอน Penetration Testing เบื้องต้น',
    description: 'สนใจเรื่อง Ethical Hacking อยากเรียนพื้นฐาน Pen Testing ใช้ Kali Linux + Burp Suite',
    level: 'beginner',
    budgetMin: 800,
    budgetMax: 2000,
    preferredDates: ['2026-03-28'],
    preferredTimes: [{ start: '09:00', end: '12:00' }, { start: '13:00', end: '16:00' }],
    status: 'closed',
    offersCount: 1,
    acceptedOfferId: 'offer-006',
    isActive: true,
    createdAt: '2026-01-25T09:00:00.000Z',
    updatedAt: '2026-02-05T14:00:00.000Z',
  },
];

const MOCK_OFFERS: ConsultationOffer[] = [
  {
    id: 'offer-001',
    requestId: 'req-001',
    instructorId: 'inst-001',
    instructorName: 'อ.สมชาย พัฒนาเว็บ',
    instructorAvatar: '👨‍🏫',
    instructorRating: 4.9,
    instructorSpecializations: ['React', 'Node.js', 'TypeScript', 'Next.js'],
    message: 'ผมเชี่ยวชาญ Next.js App Router โดยตรงครับ สอนทั้ง Server Components, Streaming, Parallel Routes ได้หมด มาเรียนกันเลย!',
    offeredPrice: 1200,
    offeredDate: '2026-03-20',
    offeredStartTime: '13:00',
    offeredEndTime: '15:00',
    status: 'pending',
    isActive: true,
    createdAt: '2026-02-10T14:00:00.000Z',
    updatedAt: '2026-02-10T14:00:00.000Z',
  },
  {
    id: 'offer-002',
    requestId: 'req-001',
    instructorId: 'inst-004',
    instructorName: 'อ.ธนกร โมบาย',
    instructorAvatar: '👨‍💻',
    instructorRating: 4.5,
    instructorSpecializations: ['Flutter', 'Dart', 'Swift', 'Kotlin'],
    message: 'ถึงผมเชี่ยวชาญ Mobile เป็นหลัก แต่ผมก็ใช้ Next.js ในโปรเจกต์ Web ด้วยครับ ช่วยสอนพื้นฐาน App Router ได้',
    offeredPrice: 800,
    offeredDate: '2026-03-21',
    offeredStartTime: '18:00',
    offeredEndTime: '20:00',
    status: 'pending',
    isActive: true,
    createdAt: '2026-02-11T09:00:00.000Z',
    updatedAt: '2026-02-11T09:00:00.000Z',
  },
  {
    id: 'offer-003',
    requestId: 'req-002',
    instructorId: 'inst-002',
    instructorName: 'ดร.นภา AI วิจัย',
    instructorAvatar: '👩‍🔬',
    instructorRating: 4.8,
    instructorSpecializations: ['Python', 'TensorFlow', 'PyTorch', 'NLP'],
    message: 'ผมทำวิจัย NLP ภาษาไทยมาหลายปีครับ เคย fine-tune ทั้ง WangchanBERTa และ typhoon LLM ให้คำปรึกษาได้ตั้งแต่การเลือก model, dataset preparation, ไปจนถึง training strategy',
    offeredPrice: 2500,
    offeredDate: '2026-03-18',
    offeredStartTime: '09:00',
    offeredEndTime: '12:00',
    status: 'pending',
    isActive: true,
    createdAt: '2026-02-12T08:00:00.000Z',
    updatedAt: '2026-02-12T08:00:00.000Z',
  },
  {
    id: 'offer-004',
    requestId: 'req-003',
    instructorId: 'inst-001',
    instructorName: 'อ.สมชาย พัฒนาเว็บ',
    instructorAvatar: '👨‍🏫',
    instructorRating: 4.9,
    instructorSpecializations: ['React', 'Node.js', 'TypeScript', 'Next.js'],
    message: 'ผมเคยสร้าง Design System ให้หลายโปรเจกต์ ช่วยสอนมุมมอง developer ที่ใช้ design system ได้ครับ',
    offeredPrice: 700,
    offeredDate: '2026-03-22',
    offeredStartTime: '10:00',
    offeredEndTime: '12:00',
    status: 'rejected',
    isActive: true,
    createdAt: '2026-02-09T11:00:00.000Z',
    updatedAt: '2026-02-12T09:00:00.000Z',
  },
  {
    id: 'offer-005',
    requestId: 'req-003',
    instructorId: 'inst-003',
    instructorName: 'อ.พิมพ์ลดา ดีไซน์',
    instructorAvatar: '👩‍🎨',
    instructorRating: 4.7,
    instructorSpecializations: ['Figma', 'Adobe XD', 'Design System', 'User Research'],
    message: 'ผมเชี่ยวชาญ Figma โดยตรงค่ะ เคยเป็น Lead Designer ที่ LINE สร้าง Design System มาหลายระบบ สอนได้ตั้งแต่ 0 ถึง production-ready เลยนะคะ 💪',
    offeredPrice: 650,
    offeredDate: '2026-03-22',
    offeredStartTime: '14:00',
    offeredEndTime: '17:00',
    status: 'accepted',
    isActive: true,
    createdAt: '2026-02-09T15:00:00.000Z',
    updatedAt: '2026-02-12T09:00:00.000Z',
  },
  {
    id: 'offer-006',
    requestId: 'req-005',
    instructorId: 'inst-005',
    instructorName: 'อ.วีรภัทร ไซเบอร์',
    instructorAvatar: '🕵️',
    instructorRating: 4.6,
    instructorSpecializations: ['Ethical Hacking', 'Network Security', 'Penetration Testing'],
    message: 'Pen Testing เป็นความถนัดผมเลยครับ สอนใช้ Kali Linux, Burp Suite, Nmap ได้หมด มา lab กันสดๆ!',
    offeredPrice: 1500,
    offeredDate: '2026-03-28',
    offeredStartTime: '09:00',
    offeredEndTime: '12:00',
    status: 'accepted',
    isActive: true,
    createdAt: '2026-01-28T10:00:00.000Z',
    updatedAt: '2026-02-05T14:00:00.000Z',
  },
];

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

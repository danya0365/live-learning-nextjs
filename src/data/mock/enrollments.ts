import { Enrollment } from '@/src/application/repositories/IEnrollmentRepository';

export const MOCK_ENROLLMENTS: Enrollment[] = [
  {
    id: '55000000-0000-0000-0000-000000000001',
    studentProfileId: '10000000-0000-0000-0000-000000000003',
    courseId: '40000000-0000-0000-0000-000000000001',
    totalHours: 40,
    usedHours: 4,
    remainingHours: 36,
    status: 'active',
    enrolledAt: '2026-02-10T08:00:00.000Z',
    isActive: true,
    createdAt: '2026-02-10T08:00:00.000Z',
    updatedAt: '2026-02-10T08:00:00.000Z',
  },
  {
    id: '55000000-0000-0000-0000-000000000002',
    studentProfileId: '10000000-0000-0000-0000-000000000003',
    courseId: '40000000-0000-0000-0000-000000000002',
    totalHours: 20,
    usedHours: 0,
    remainingHours: 20,
    status: 'active',
    enrolledAt: '2026-02-12T10:00:00.000Z',
    isActive: true,
    createdAt: '2026-02-12T10:00:00.000Z',
    updatedAt: '2026-02-12T10:00:00.000Z',
  },
];

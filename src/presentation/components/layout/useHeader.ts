'use client';

import { useClickOutside } from '@/src/presentation/hooks/useClickOutside';
import { useAuthStore, UserRole } from '@/src/stores/authStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Home, Plus, BookOpen, MessageCircle, Brain, Calendar, ClipboardList, User, Presentation, Users, LucideIcon } from 'lucide-react';

/* ── Constants & Types ─────────────────────── */

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface MoreLink extends NavLink {
  desc: string;
}

const NAV_BY_ROLE: Record<UserRole | 'guest', NavLink[]> = {
  student: [
    { href: '/', label: 'หน้าหลัก', icon: Home },
    { href: '/book', label: 'จองคลาส', icon: Plus },
    { href: '/courses', label: 'คอร์สเรียน', icon: BookOpen },
    { href: '/consultations', label: 'ปรึกษา', icon: MessageCircle },
    { href: '/quizzes', label: 'ประลอง', icon: Brain },
  ],
  instructor: [
    { href: '/', label: 'หน้าหลัก', icon: Home },
    { href: '/schedule', label: 'ตารางสอน', icon: Calendar },
    { href: '/consultations/board', label: 'บอร์ดปรึกษา', icon: ClipboardList },
    { href: '/courses', label: 'คอร์สเรียน', icon: BookOpen },
    { href: '/profile', label: 'โปรไฟล์', icon: User },
  ],
  admin: [
    { href: '/', label: 'หน้าหลัก', icon: Home },
    { href: '/admin/chat', label: 'แชท', icon: MessageCircle },
    { href: '/schedule', label: 'ตาราง', icon: Calendar },
    { href: '/courses', label: 'คอร์สเรียน', icon: BookOpen },
    { href: '/profile', label: 'โปรไฟล์', icon: User },
  ],
  guest: [
    { href: '/', label: 'หน้าหลัก', icon: Home },
    { href: '/schedule', label: 'ตารางเรียน', icon: Calendar },
    { href: '/courses', label: 'คอร์สเรียน', icon: BookOpen },
    { href: '/quizzes', label: 'ประลอง', icon: Brain },
  ],
};

const MORE_BY_ROLE: Record<UserRole | 'guest', MoreLink[]> = {
  student: [
    { href: '/profile', label: 'โปรไฟล์', icon: User, desc: 'ข้อมูลส่วนตัวบัญชีของฉัน' },
    { href: '/my-bookings', label: 'การจองของฉัน', icon: ClipboardList, desc: 'ดูสถานะการจองทั้งหมด' },
    { href: '/live', label: 'LIVE', icon: Presentation, desc: 'คลาสที่กำลังสอนอยู่' },
  ],
  instructor: [
    { href: '/live', label: 'LIVE', icon: Presentation, desc: 'คลาสที่กำลังสอนอยู่' },
    { href: '/instructors', label: 'อาจารย์', icon: Users, desc: 'ดูอาจารย์ทั้งหมด' },
  ],
  admin: [
    { href: '/instructors', label: 'อาจารย์', icon: Users, desc: 'ดูอาจารย์ทั้งหมด' },
    { href: '/schedule', label: 'ตาราง', icon: Calendar, desc: 'ดูตารางทั้งหมด' },
    { href: '/live', label: 'LIVE', icon: Presentation, desc: 'คลาสที่กำลังสอน' },
  ],
  guest: [
    { href: '/instructors', label: 'อาจารย์', icon: Users, desc: 'ดูอาจารย์ทั้งหมด' },
    { href: '/live', label: 'LIVE', icon: Presentation, desc: 'คลาสที่กำลังสอน' },
  ],
};

export const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  student: { label: 'นักเรียน', color: 'text-blue-400' },
  instructor: { label: 'อาจารย์', color: 'text-purple-400' },
  admin: { label: 'แอดมิน', color: 'text-amber-400' },
};

/* ── Hook Implementation ───────────────────── */

export function useHeader() {
  const pathname = usePathname();
  const router = useRouter();
  
  // State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const [isSwitchingProfile, setIsSwitchingProfile] = useState(false);

  // Refs
  const moreRef = useRef<HTMLDivElement>(null);
  const authRef = useRef<HTMLDivElement>(null);

  // Click Outside logic
  useClickOutside(moreRef, () => setMoreOpen(false));
  useClickOutside(authRef, () => setAuthMenuOpen(false));

  // Auth Store
  const { user, profiles, switchProfile, isAuthenticated, logout } = useAuthStore();

  // Effects
  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreOpen(false);
    setAuthMenuOpen(false);
  }, [pathname]);

  // Derived State
  const role: UserRole | 'guest' = isAuthenticated && user ? user.role : 'guest';
  const primaryLinks = NAV_BY_ROLE[role];
  const moreLinks = MORE_BY_ROLE[role];
  const roleInfo = user ? ROLE_LABELS[user.role] || ROLE_LABELS.student : ROLE_LABELS.student;
  
  // Helpers
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  // Actions
  function handleLogout() {
    logout();
    router.push('/auth/login');
  }

  async function handleSwitchProfile(profileId: string) {
    setAuthMenuOpen(false);
    setIsSwitchingProfile(true);
    
    try {
      // 1. Await store update (Supabase RPC)
      await switchProfile(profileId);
      
      // 2. Router Refresh
      router.refresh();
    } catch (err) {
      console.error(err);
      alert('ไม่สามารถสลับโปรไฟล์ได้ ลองใหม่อีกครั้ง');
    } finally {
      // 3. Ensure we turn off our manual loading state
      setIsSwitchingProfile(false);
    }
  }

  return {
    // State
    mobileMenuOpen,
    moreOpen,
    authMenuOpen,
    isSwitchingProfile,
    isAuthenticated,
    user,
    // profiles, // Real profiles
    profiles,
    role,
    
    // Derived
    primaryLinks,
    moreLinks,
    roleInfo,
    
    // Refs
    moreRef,
    authRef,
    
    // Setters
    setMobileMenuOpen,
    setMoreOpen,
    setAuthMenuOpen,
    
    // Methods
    isActive,
    handleLogout,
    handleSwitchProfile,
  };
}

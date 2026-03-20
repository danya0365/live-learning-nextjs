'use client';

import { useClickOutside } from '@/src/presentation/hooks/useClickOutside';
import { useAuthStore, UserRole } from '@/src/stores/authStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/* ── Constants & Types ─────────────────────── */

export interface NavLink {
  href: string;
  label: string;
  icon: string;
}

export interface MoreLink extends NavLink {
  desc: string;
}

const NAV_BY_ROLE: Record<UserRole | 'guest', NavLink[]> = {
  student: [
    { href: '/', label: 'หน้าหลัก', icon: '🏠' },
    { href: '/book', label: 'จองคลาส', icon: '➕' },
    { href: '/courses', label: 'คอร์สเรียน', icon: '📚' },
    { href: '/quizzes', label: 'ประลอง', icon: '🧠' },
  ],
  instructor: [
    { href: '/', label: 'หน้าหลัก', icon: '🏠' },
    { href: '/schedule', label: 'ตารางสอน', icon: '📅' },
    { href: '/consultations/board', label: 'บอร์ดปรึกษา', icon: '📋' },
    { href: '/courses', label: 'คอร์สเรียน', icon: '📚' },
    { href: '/profile', label: 'โปรไฟล์', icon: '👤' },
  ],
  admin: [
    { href: '/', label: 'หน้าหลัก', icon: '🏠' },
    { href: '/schedule', label: 'ตาราง', icon: '📅' },
    { href: '/courses', label: 'คอร์สเรียน', icon: '📚' },
    { href: '/profile', label: 'โปรไฟล์', icon: '👤' },
  ],
  guest: [
    { href: '/', label: 'หน้าหลัก', icon: '🏠' },
    { href: '/schedule', label: 'ตารางเรียน', icon: '📅' },
    { href: '/courses', label: 'คอร์สเรียน', icon: '📚' },
    { href: '/quizzes', label: 'ประลอง', icon: '🧠' },
  ],
};

const MORE_BY_ROLE: Record<UserRole | 'guest', MoreLink[]> = {
  student: [
    { href: '/profile', label: 'โปรไฟล์', icon: '👤', desc: 'ข้อมูลส่วนตัวบัญชีของฉัน' },
    { href: '/consultations', label: 'ปรึกษา', icon: '💬', desc: 'ขอคำแนะนำจากอาจารย์' },
    { href: '/my-bookings', label: 'การจองของฉัน', icon: '📋', desc: 'ดูสถานะการจองทั้งหมด' },
    { href: '/live', label: 'LIVE', icon: '🔴', desc: 'คลาสที่กำลังสอนอยู่' },
    // { href: '/study-room', label: 'ห้องอ่านหนังสือ', icon: '☕', desc: 'ห้องสำหรับนั่งโฟกัสร่วมกัน' },
    // { href: '/shorts', label: 'คลิปสั้น', icon: '📱', desc: 'เรียนรู้เทคนิคผ่านวิดีโอสั้น' },
    
  ],
  instructor: [
    { href: '/live', label: 'LIVE', icon: '🔴', desc: 'คลาสที่กำลังสอนอยู่' },
    { href: '/consultations', label: 'คำขอของนักเรียน', icon: '💬', desc: 'ดูคำขอปรึกษาทั้งหมด' },
    { href: '/instructors', label: 'อาจารย์', icon: '📚', desc: 'ดูอาจารย์ทั้งหมด' },
  ],
  admin: [
    { href: '/instructors', label: 'อาจารย์', icon: '📚', desc: 'ดูอาจารย์ทั้งหมด' },
    { href: '/schedule', label: 'ตาราง', icon: '📅', desc: 'ดูตารางทั้งหมด' },
    { href: '/live', label: 'LIVE', icon: '🔴', desc: 'คลาสที่กำลังสอน' },
  ],
  guest: [
    { href: '/instructors', label: 'อาจารย์', icon: '👨‍🏫', desc: 'ดูอาจารย์ทั้งหมด' },
    { href: '/live', label: 'LIVE', icon: '🔴', desc: 'คลาสที่กำลังสอน' },
    // { href: '/study-room', label: 'ห้องอ่านหนังสือ', icon: '☕', desc: 'รับสมาธิกับเพื่อนร่วมห้อง' },
    // { href: '/shorts', label: 'คลิปสั้น', icon: '📱', desc: 'เทคนิคไวๆ สายรีบเรียน' },
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

      // 3. Dispatch global event so other pages can react immediately
      window.dispatchEvent(new CustomEvent('onProfileSwitched', { detail: { profileId } }));
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

import Link from 'next/link';
import { ProfileViewModel } from '@/src/presentation/presenters/profile/ProfilePresenter';

interface ProfileHeaderProps {
  profile: ProfileViewModel['profile'];
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const isAdmin = profile.role === 'admin';
  const isInstructor = profile.role === 'instructor';

  return (
    <>
      {/* Standard Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-2">
          👤 โปรไฟล์ส่วนตัว
        </h1>
        <p className="text-text-secondary">
          จัดการข้อมูลส่วนตัว ประวัติการเรียน และการตั้งค่าบัญชีของคุณ
        </p>
      </div>

      {/* Profile Card Summary */}
      <div className="glass rounded-2xl p-6 sm:p-8 mb-8 border border-border/50">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-5xl shadow-lg shadow-primary/25 border-4 border-surface">
            {profile.avatar}
          </div>

          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary mb-1">{profile.name}</h2>
            <p className="text-text-secondary mb-3">{profile.email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1 ${
                isAdmin 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' 
                  : 'bg-primary/10 border-primary/30 text-primary'
              }`}>
                {isAdmin ? '🛡️ Role: Administrator' : `📊 Level: ${profile.level}`}
              </span>
              <span className="text-xs text-text-muted flex items-center gap-1">
                🗓️ เข้าร่วมเมื่อ {new Date(profile.joinDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long' })}
              </span>
            </div>
          </div>

          <div className="flex gap-3 mt-4 sm:mt-0 w-full sm:w-auto">
            {isAdmin ? (
              <>
                <Link href="/courses" className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-surface border border-border text-sm font-bold text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-all text-center">
                  📚 คอร์สทั้งหมด
                </Link>
                <Link href="/instructors" className="flex-1 sm:flex-none btn-game px-4 py-2.5 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 text-center">
                  👨‍🏫 จัดการผู้สอน
                </Link>
              </>
            ) : isInstructor ? (
              <>
                <Link href="/schedule" className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-surface border border-border text-sm font-bold text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-all text-center">
                  📅 ตารางสอน
                </Link>
                <Link href="/live" className="flex-1 sm:flex-none btn-game px-4 py-2.5 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 text-center">
                  🔴 เข้าสอน
                </Link>
              </>
            ) : (
              <>
                <Link href="/my-bookings" className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-surface border border-border text-sm font-bold text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-all text-center">
                  📋 การจอง
                </Link>
                <Link href="/courses" className="flex-1 sm:flex-none btn-game px-4 py-2.5 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 text-center">
                  📚 เรียนต่อ
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

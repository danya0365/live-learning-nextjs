import { AuthUser } from '@/src/stores/authStore';
import { FormEvent, useEffect, useState } from 'react';

interface ProfileFormProps {
  user: AuthUser;
  onSave: (name: string, bio: string) => void;
}

export function ProfileForm({ user, onSave }: ProfileFormProps) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');

  // Reset form when user changes (e.g. initial load)
  useEffect(() => {
    setName(user.name);
    setBio(user.bio || '');
  }, [user]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(name, bio);
  };

  return (
    <div className="glass rounded-2xl p-6 sm:p-8 border border-border/50 shadow-lg animate-fadeIn">
      <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
        👤 ข้อมูลโปรไฟล์
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl shadow-md">
            {user.avatar || '👤'}
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">{user.name}</p>
            <p className="text-xs text-text-muted">{user.email}</p>
            <button type="button" className="text-xs text-primary hover:underline mt-1">เปลี่ยนรูปโปรไฟล์</button>
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="settings-name" className="block text-sm font-medium text-text-secondary mb-1.5">ชื่อที่แสดง</label>
          <input
            id="settings-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>

        {/* Email (readonly) */}
        <div>
          <label htmlFor="settings-email" className="block text-sm font-medium text-text-secondary mb-1.5">อีเมล</label>
          <input
            id="settings-email"
            type="email"
            value={user.email}
            disabled
            className="w-full px-4 py-3 rounded-xl bg-surface/50 border border-border text-text-muted text-sm cursor-not-allowed"
          />
          <p className="text-[10px] text-text-muted mt-1">ไม่สามารถเปลี่ยนอีเมลได้</p>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="settings-bio" className="block text-sm font-medium text-text-secondary mb-1.5">เกี่ยวกับตัวฉัน</label>
          <textarea
            id="settings-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="บอกเล่าเรื่องราวของคุณ..."
            className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          className="btn-game px-6 py-2.5 rounded-xl text-white font-bold text-sm hover:scale-[1.02] active:scale-95 transition-transform"
        >
          บันทึกโปรไฟล์ 💾
        </button>
      </form>
    </div>
  );
}

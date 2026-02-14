import { AuthUser } from '@/src/stores/authStore';
import { FormEvent, useState } from 'react';

interface SecurityFormProps {
  user: AuthUser;
  onUpdatePassword: (current: string, next: string, confirm: string) => Promise<boolean>;
}

export function SecurityForm({ user, onUpdatePassword }: SecurityFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await onUpdatePassword(currentPassword, newPassword, confirmNewPassword);
    setLoading(false);
    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  };

  return (
    <div className="glass rounded-2xl p-6 sm:p-8 border border-border/50 shadow-lg animate-fadeIn">
      <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
        🔐 ความปลอดภัย
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="current-pw" className="block text-sm font-medium text-text-secondary mb-1.5">รหัสผ่านปัจจุบัน</label>
          <input
            id="current-pw"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        <div>
          <label htmlFor="new-pw" className="block text-sm font-medium text-text-secondary mb-1.5">รหัสผ่านใหม่</label>
          <input
            id="new-pw"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="อย่างน้อย 6 ตัวอักษร"
            className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        <div>
          <label htmlFor="confirm-new-pw" className="block text-sm font-medium text-text-secondary mb-1.5">ยืนยันรหัสผ่านใหม่</label>
          <input
            id="confirm-new-pw"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
            className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text-primary placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-game px-6 py-2.5 rounded-xl text-white font-bold text-sm hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50"
        >
          {loading ? 'กำลังดำเนินการ...' : 'เปลี่ยนรหัสผ่าน 🔑'}
        </button>
      </form>

      {/* Sessions section */}
      <div className="mt-8 pt-6 border-t border-border/30">
        <h3 className="text-sm font-bold text-text-primary mb-4">🖥️ เซสชันที่เข้าสู่ระบบ</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface/50 border border-border/30">
            <div className="flex items-center gap-3">
              <span className="text-xl">💻</span>
              <div>
                <p className="text-sm font-medium text-text-primary">อุปกรณ์ปัจจุบัน</p>
                <p className="text-[10px] text-text-muted">Chrome • macOS • เข้าใช้ล่าสุด: เมื่อสักครู่</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-medium">ใช้งานอยู่</span>
          </div>
        </div>
      </div>
    </div>
  );
}

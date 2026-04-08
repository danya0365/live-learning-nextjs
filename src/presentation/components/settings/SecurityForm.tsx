import { AuthUser } from '@/src/stores/authStore';
import { LogOut, Monitor, Smartphone, Tablet } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { UAParser } from 'ua-parser-js';
import { ActiveSession } from '@/src/application/repositories/IAuthRepository';

interface SecurityFormProps {
  user: AuthUser;
  activeSessions: ActiveSession[];
  loadingSessions: boolean;
  onUpdatePassword: (current: string, next: string, confirm: string) => Promise<boolean>;
  onRevokeOtherSessions: () => Promise<boolean>;
}

export function SecurityForm({ 
  user, 
  activeSessions, 
  loadingSessions, 
  onUpdatePassword, 
  onRevokeOtherSessions 
}: SecurityFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [revoking, setRevoking] = useState(false);

  const handleRevokeOtherSessions = async () => {
    if (!window.confirm('คุณต้องการออกจากระบบจากอุปกรณ์อื่นทั้งหมดใช่หรือไม่?')) return;
    
    setRevoking(true);
    await onRevokeOtherSessions();
    setRevoking(false);
  };

  const getDeviceDetails = (uaString: string) => {
    const parser = new UAParser(uaString);
    const result = parser.getResult();
    
    const browser = result.browser.name ? `${result.browser.name}` : 'Unknown Browser';
    const os = result.os.name ? `${result.os.name}` : 'Unknown OS';
    const deviceType = result.device.type || 'desktop';
    
    let Icon = Monitor;
    if (deviceType === 'mobile') Icon = Smartphone;
    else if (deviceType === 'tablet') Icon = Tablet;
    
    return { name: `${browser} • ${os}`, Icon };
  };

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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-text-primary">🖥️ เซสชันที่เข้าสู่ระบบ</h3>
          {activeSessions.length > 1 && (
            <button 
              onClick={handleRevokeOtherSessions}
              disabled={revoking}
              className="text-xs text-error hover:text-error/80 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <LogOut className="w-3.5 h-3.5" /> 
              {revoking ? 'กำลังออกจากระบบ...' : 'ออกจากระบบอุปกรณ์อื่น'}
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          {loadingSessions ? (
            <div className="text-center py-4 text-xs text-text-muted">กำลังโหลดข้อมูลเซสชัน...</div>
          ) : activeSessions.length > 0 ? (
            activeSessions.map((session, index) => {
              const { name, Icon } = getDeviceDetails(session.userAgent);
              const isCurrent = index === 0; 
              
              return (
                <div key={session.id} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${isCurrent ? 'bg-surface/50 border-primary/30' : 'bg-surface border-border/30'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isCurrent ? 'bg-primary/10 text-primary' : 'bg-surface-elevated text-text-muted'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {isCurrent ? 'อุปกรณ์ปัจจุบัน' : 'อุปกรณ์อื่น'} 
                        {!isCurrent && session.ip && <span className="text-xs text-text-muted ml-1">({session.ip})</span>}
                      </p>
                      <p className="text-[10px] text-text-muted">
                        {name} • เข้าใช้ล่าสุด: {new Date(session.updatedAt || session.createdAt).toLocaleString('th-TH')}
                      </p>
                    </div>
                  </div>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-medium">ใช้งานอยู่</span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-4 text-xs text-text-muted">ไม่มีข้อมูลเซสชัน</div>
          )}
        </div>
      </div>
    </div>
  );
}

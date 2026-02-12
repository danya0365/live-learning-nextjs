/**
 * Settings Page — Auth-protected
 * User account settings: profile editing, password change, preferences
 */

'use client';

import { AuthGuard } from '@/src/presentation/components/auth/AuthGuard';
import { useAuthStore } from '@/src/stores/authStore';
import { useState } from 'react';

/* ── Types ─────────────────────────────────── */
type Tab = 'profile' | 'security' | 'preferences' | 'notifications';

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'profile', label: 'โปรไฟล์', icon: '👤' },
  { key: 'security', label: 'ความปลอดภัย', icon: '🔐' },
  { key: 'preferences', label: 'การตั้งค่า', icon: '⚙️' },
  { key: 'notifications', label: 'การแจ้งเตือน', icon: '🔔' },
];

/* ── Component ─────────────────────────────── */
export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  );
}

function SettingsContent() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  // Form state
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [bio, setBio] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Preferences
  const [language, setLanguage] = useState('th');
  const [autoPlay, setAutoPlay] = useState(true);
  const [showOnline, setShowOnline] = useState(true);

  // Notifications
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [courseReminder, setCourseReminder] = useState(true);
  const [promotions, setPromotions] = useState(false);

  // Toast
  const [toast, setToast] = useState('');

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    showToast('บันทึกโปรไฟล์เรียบร้อยแล้ว ✅');
  }

  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      showToast('กรุณากรอกข้อมูลให้ครบ ❌');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast('รหัสผ่านใหม่ไม่ตรงกัน ❌');
      return;
    }
    if (newPassword.length < 6) {
      showToast('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร ❌');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    showToast('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว ✅');
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ background: 'var(--gradient-primary)' }} />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-15 blur-3xl" style={{ background: 'linear-gradient(135deg, hsl(280,70%,60%), hsl(330,70%,60%))' }} />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-3xl shadow-lg">
              {user?.avatar || '⚙️'}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">ตั้งค่าบัญชี</h1>
              <p className="text-text-secondary text-sm mt-0.5">จัดการข้อมูลส่วนตัวและการตั้งค่าต่างๆ</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar tabs */}
          <div className="lg:w-56 flex-shrink-0">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.key
                      ? 'bg-primary/10 text-primary shadow-sm'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface/80'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="glass rounded-2xl p-6 sm:p-8 border border-border/50 shadow-lg animate-fadeIn">
                <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                  👤 ข้อมูลโปรไฟล์
                </h2>
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl shadow-md">
                      {user?.avatar || '👤'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                      <p className="text-xs text-text-muted">{user?.email}</p>
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
                      value={email}
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
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="glass rounded-2xl p-6 sm:p-8 border border-border/50 shadow-lg animate-fadeIn">
                <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                  🔐 ความปลอดภัย
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-5">
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
                    className="btn-game px-6 py-2.5 rounded-xl text-white font-bold text-sm hover:scale-[1.02] active:scale-95 transition-transform"
                  >
                    เปลี่ยนรหัสผ่าน 🔑
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
            )}

            {/* Preferences */}
            {activeTab === 'preferences' && (
              <div className="glass rounded-2xl p-6 sm:p-8 border border-border/50 shadow-lg animate-fadeIn">
                <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                  ⚙️ การตั้งค่าทั่วไป
                </h2>
                <div className="space-y-6">
                  {/* Language */}
                  <div>
                    <label htmlFor="settings-lang" className="block text-sm font-medium text-text-secondary mb-1.5">ภาษา</label>
                    <select
                      id="settings-lang"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    >
                      <option value="th">🇹🇭 ภาษาไทย</option>
                      <option value="en">🇺🇸 English</option>
                    </select>
                  </div>

                  {/* Toggle switches */}
                  <ToggleSwitch
                    label="เล่นวิดีโออัตโนมัติ"
                    desc="เริ่มเล่นวิดีโอตัวอย่างอัตโนมัติเมื่อเปิดหน้าคอร์ส"
                    checked={autoPlay}
                    onChange={setAutoPlay}
                  />
                  <ToggleSwitch
                    label="แสดงสถานะออนไลน์"
                    desc="ให้ผู้อื่นเห็นว่าคุณออนไลน์อยู่"
                    checked={showOnline}
                    onChange={setShowOnline}
                  />

                  <button
                    onClick={() => showToast('บันทึกการตั้งค่าเรียบร้อยแล้ว ✅')}
                    className="btn-game px-6 py-2.5 rounded-xl text-white font-bold text-sm hover:scale-[1.02] active:scale-95 transition-transform"
                  >
                    บันทึกการตั้งค่า 💾
                  </button>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="glass rounded-2xl p-6 sm:p-8 border border-border/50 shadow-lg animate-fadeIn">
                <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                  🔔 การแจ้งเตือน
                </h2>
                <div className="space-y-6">
                  <ToggleSwitch
                    label="อีเมลแจ้งเตือน"
                    desc="รับการแจ้งเตือนสำคัญทางอีเมล"
                    checked={emailNotif}
                    onChange={setEmailNotif}
                  />
                  <ToggleSwitch
                    label="Push Notification"
                    desc="รับการแจ้งเตือนบนเบราว์เซอร์"
                    checked={pushNotif}
                    onChange={setPushNotif}
                  />
                  <ToggleSwitch
                    label="เตือนก่อนคลาสเริ่ม"
                    desc="แจ้งเตือน 15 นาทีก่อนที่คลาส LIVE จะเริ่ม"
                    checked={courseReminder}
                    onChange={setCourseReminder}
                  />
                  <ToggleSwitch
                    label="โปรโมชันและข่าวสาร"
                    desc="รับข้อเสนอพิเศษและอัพเดทคอร์สใหม่"
                    checked={promotions}
                    onChange={setPromotions}
                  />

                  <button
                    onClick={() => showToast('บันทึกการแจ้งเตือนเรียบร้อยแล้ว ✅')}
                    className="btn-game px-6 py-2.5 rounded-xl text-white font-bold text-sm hover:scale-[1.02] active:scale-95 transition-transform"
                  >
                    บันทึกการแจ้งเตือน 💾
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div className="glass rounded-xl px-5 py-3 border border-border/50 shadow-xl text-sm font-medium text-text-primary">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Toggle Switch ────────────────────────── */
function ToggleSwitch({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-[11px] text-text-muted">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? 'bg-primary' : 'bg-border'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

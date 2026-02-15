import { SettingsTab } from '@/src/presentation/presenters/settings/useSettingsPresenter';

export interface SettingsTabItem {
  key: SettingsTab;
  label: string;
  icon: string;
  desc: string;
}

export const TABS: SettingsTabItem[] = [
  { key: 'profile', label: 'โปรไฟล์', icon: '👤', desc: 'ข้อมูลส่วนตัวและรูปโปรไฟล์' },
  { key: 'security', label: 'ความปลอดภัย', icon: '🔐', desc: 'รหัสผ่านและเซสชัน' },
  { key: 'preferences', label: 'การตั้งค่า', icon: '⚙️', desc: 'ภาษาและตัวเลือกต่างๆ' },
  { key: 'notifications', label: 'การแจ้งเตือน', icon: '🔔', desc: 'อีเมลและ Push Notification' },
];

interface SettingsTabsProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 text-left ${
            activeTab === tab.key
              ? 'bg-primary/10 text-primary shadow-sm'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface/80'
          }`}
        >
          <span className="text-base">{tab.icon}</span>
          <div className="flex flex-col">
            <span>{tab.label}</span>
            <span className="hidden lg:block text-[10px] text-text-muted font-normal">{tab.desc}</span>
          </div>
          {/* Active indicator */}
          {activeTab === tab.key && (
            <span className="ml-auto hidden lg:block w-1.5 h-1.5 rounded-full bg-primary" />
          )}
        </button>
      ))}
    </nav>
  );
}

import { SettingsTab } from '@/src/presentation/presenters/settings/useSettingsPresenter';

export interface SettingsTabItem {
  key: SettingsTab;
  label: string;
  icon: string;
}

export const TABS: SettingsTabItem[] = [
  { key: 'profile', label: 'โปรไฟล์', icon: '👤' },
  { key: 'security', label: 'ความปลอดภัย', icon: '🔐' },
  { key: 'preferences', label: 'การตั้งค่า', icon: '⚙️' },
  { key: 'notifications', label: 'การแจ้งเตือน', icon: '🔔' },
];

interface SettingsTabsProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  return (
    <div className="lg:w-56 flex-shrink-0">
      <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
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
  );
}

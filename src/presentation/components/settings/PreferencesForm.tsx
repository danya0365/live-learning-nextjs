import { SettingsViewModel } from "@/src/presentation/presenters/settings/SettingsPresenter";
import { useEffect, useState } from "react";
import { ToggleSwitch } from "./ToggleSwitch";

interface PreferencesFormProps {
  viewModel: SettingsViewModel;
  onSave: (data: SettingsViewModel) => void;
}

export function PreferencesForm({ viewModel, onSave }: PreferencesFormProps) {
  const [language, setLanguage] = useState(viewModel.language);
  const [autoPlay, setAutoPlay] = useState(viewModel.autoPlay);
  const [showOnline, setShowOnline] = useState(viewModel.showOnline);

  useEffect(() => {
    setLanguage(viewModel.language);
    setAutoPlay(viewModel.autoPlay);
    setShowOnline(viewModel.showOnline);
  }, [viewModel]);

  const handleSave = () => {
    onSave({
      ...viewModel,
      language,
      autoPlay,
      showOnline,
    });
  };

  return (
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
          onClick={handleSave}
          className="btn-game px-6 py-2.5 rounded-xl text-white font-bold text-sm hover:scale-[1.02] active:scale-95 transition-transform"
        >
          บันทึกการตั้งค่า 💾
        </button>
      </div>
    </div>
  );
}

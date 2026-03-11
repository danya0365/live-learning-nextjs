import { SettingsViewModel } from "@/src/presentation/presenters/settings/SettingsPresenter";
import { useEffect, useState } from "react";
import { ToggleSwitch } from "./ToggleSwitch";

interface NotificationsFormProps {
  viewModel: SettingsViewModel;
  onSave: (data: SettingsViewModel) => void;
}

export function NotificationsForm({ viewModel, onSave }: NotificationsFormProps) {
  const [emailNotif, setEmailNotif] = useState(viewModel.notifications.email);
  const [pushNotif, setPushNotif] = useState(viewModel.notifications.push);
  const [courseReminder, setCourseReminder] = useState(viewModel.notifications.courseReminder);
  const [promotions, setPromotions] = useState(viewModel.notifications.promotions);

  useEffect(() => {
    setEmailNotif(viewModel.notifications.email);
    setPushNotif(viewModel.notifications.push);
    setCourseReminder(viewModel.notifications.courseReminder);
    setPromotions(viewModel.notifications.promotions);
  }, [viewModel]);

  const handleSave = () => {
    onSave({
      ...viewModel,
      notifications: {
        email: emailNotif,
        push: pushNotif,
        courseReminder: courseReminder,
        promotions: promotions,
      },
    });
  };

  return (
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
          onClick={handleSave}
          className="btn-game px-6 py-2.5 rounded-xl text-white font-bold text-sm hover:scale-[1.02] active:scale-95 transition-transform"
        >
          บันทึกการแจ้งเตือน 💾
        </button>
      </div>
    </div>
  );
}

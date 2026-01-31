import React from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, HelpCircle, LogOut } from 'lucide-react';

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center w-full py-4 border-b border-slate-800 hover:bg-surface/50 transition-colors"
  >
    <div className="text-slate-400 mr-4">{icon}</div>
    <span className="text-white">{label}</span>
  </button>
);

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <SettingsIcon className="text-slate-400" size={28} />
        <h1 className="text-3xl font-bold text-white">Setting</h1>
      </div>

      {/* Settings List */}
      <div className="bg-surface rounded-xl overflow-hidden">
        <SettingItem
          icon={<User size={20} />}
          label="プロフィール"
        />
        <SettingItem
          icon={<Bell size={20} />}
          label="通知設定"
        />
        <SettingItem
          icon={<Shield size={20} />}
          label="プライバシー"
        />
        <SettingItem
          icon={<HelpCircle size={20} />}
          label="ヘルプ・お問い合わせ"
        />
      </div>

      {/* App Info */}
      <div className="text-center text-slate-500 text-sm">
        <p>AI Muscle Memo</p>
        <p>Version 1.0.0 (Beta)</p>
      </div>
    </div>
  );
};

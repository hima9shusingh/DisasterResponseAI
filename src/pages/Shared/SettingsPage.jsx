import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import SettingsToggle from '../../components/global/SettingsToggle';
import ChangePasswordModal from '../../components/global/ChangePasswordModal';
import ActiveSessions from '../../components/global/ActiveSessions';
import { Settings, Shield, Bell, Palette, UserX } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { clsx } from 'clsx';

export default function SettingsPage() {
  const { theme, toggleTheme, compactMode, toggleCompactMode, preferences, updatePreference } = useSettings();
  const [activeTab, setActiveTab] = useState('appearance');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { addToast } = useToast();

  const handleDeactivate = () => {
    addToast('Account Actions Disabled', 'Account deactivation is disabled in this demo environment.', 'warning');
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'account', label: 'Account Data', icon: UserX },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12">
      
      <div className="flex items-center gap-3 mb-6 bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
        <div className="w-12 h-12 bg-neutral-100 text-neutral-700 rounded-xl flex items-center justify-center">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">System Settings</h1>
          <p className="text-sm font-semibold text-neutral-500">Manage your preferences, security, and interface options.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-3xl border border-neutral-200 p-2 shadow-sm flex flex-row md:flex-col gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left whitespace-nowrap",
                    activeTab === tab.id ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-600 hover:bg-neutral-100"
                  )}
                >
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 min-h-[500px]">
          
          {activeTab === 'appearance' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-lg font-black text-neutral-900 mb-1">Appearance Settings</h2>
                <p className="text-xs font-semibold text-neutral-500 mb-6">Customize how the platform looks and feels.</p>
              </div>
              
              <div className="divide-y divide-neutral-100">
                <SettingsToggle 
                  title="Dark Mode" 
                  description="Switch between light and dark themes (updates instantly)." 
                  checked={theme === 'dark'} 
                  onChange={toggleTheme} 
                />
                <SettingsToggle 
                  title="Compact UI Mode" 
                  description="Reduce padding and spacing to fit more data on screen." 
                  checked={compactMode} 
                  onChange={toggleCompactMode} 
                />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-lg font-black text-neutral-900 mb-1">Alert Preferences</h2>
                <p className="text-xs font-semibold text-neutral-500 mb-6">Select which events trigger global notifications.</p>
              </div>
              
              <div className="divide-y divide-neutral-100">
                <SettingsToggle 
                  title="Emergency Alerts" 
                  description="Critical infrastructure, SOS signals, and immediate threats." 
                  checked={preferences.notifications.emergency} 
                  onChange={(v) => updatePreference('notifications', 'emergency', v)} 
                />
                <SettingsToggle 
                  title="Weather Warnings" 
                  description="Severe weather forecasts and risk model changes." 
                  checked={preferences.notifications.weather} 
                  onChange={(v) => updatePreference('notifications', 'weather', v)} 
                />
                <SettingsToggle 
                  title="Incident Updates" 
                  description="Status changes to incidents in your region." 
                  checked={preferences.notifications.incident} 
                  onChange={(v) => updatePreference('notifications', 'incident', v)} 
                />
                <SettingsToggle 
                  title="Mission Updates" 
                  description="Relevant for Volunteers and NGOs (deployments, supply drops)." 
                  checked={preferences.notifications.mission} 
                  onChange={(v) => updatePreference('notifications', 'mission', v)} 
                />
                <SettingsToggle 
                  title="System Notifications" 
                  description="Platform maintenance and generic updates." 
                  checked={preferences.notifications.system} 
                  onChange={(v) => updatePreference('notifications', 'system', v)} 
                />
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-lg font-black text-neutral-900 mb-1">Security & Access</h2>
                <p className="text-xs font-semibold text-neutral-500 mb-6">Manage passwords and active login sessions.</p>
              </div>

              <div className="pb-6 border-b border-neutral-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">Account Password</h3>
                    <p className="text-xs font-medium text-neutral-500 mt-1">Last changed 3 months ago</p>
                  </div>
                  <button 
                    onClick={() => setShowPasswordModal(true)}
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold rounded-xl transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <h3 className="text-sm font-bold text-neutral-900 mb-4">Active Sessions</h3>
                <ActiveSessions />
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-lg font-black text-neutral-900 mb-1">Account Data</h2>
                <p className="text-xs font-semibold text-neutral-500 mb-6">Manage your account lifecycle and data retention.</p>
              </div>
              
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                <h3 className="text-sm font-black text-red-700 mb-2">Danger Zone</h3>
                <p className="text-xs font-medium text-red-600 mb-4">Deactivating your account will suspend your access to the platform. Only system administrators can fully delete platform data.</p>
                
                <div className="flex gap-3">
                  <button onClick={handleDeactivate} className="px-4 py-2.5 bg-white text-red-600 border border-red-200 hover:bg-red-100 text-xs font-bold rounded-xl transition-colors">
                    Request Data Export
                  </button>
                  <button onClick={handleDeactivate} className="px-4 py-2.5 bg-red-600 text-white hover:bg-red-700 text-xs font-bold rounded-xl transition-colors shadow-sm">
                    Deactivate Account
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
    </div>
  );
}

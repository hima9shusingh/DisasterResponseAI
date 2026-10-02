import React from 'react';
import { Settings, Shield, Bell, Globe } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">System Settings</h1>
        <p className="text-sm text-neutral-500 mt-1 font-semibold">Global platform configurations and security policies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div className="md:col-span-1 space-y-2">
          <button className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold transition-colors">General</button>
          <button className="w-full text-left px-4 py-3 text-neutral-600 hover:bg-neutral-50 rounded-xl text-sm font-bold transition-colors">Security</button>
          <button className="w-full text-left px-4 py-3 text-neutral-600 hover:bg-neutral-50 rounded-xl text-sm font-bold transition-colors">Notifications</button>
        </div>

        <div className="md:col-span-3 space-y-6">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 space-y-6">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-100 pb-2 flex items-center gap-2"><Globe className="w-4 h-4" /> Platform Preferences</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Platform Name</label>
                <input type="text" defaultValue="ADRRAS Core" className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Default Timezone</label>
                <select className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none">
                  <option>Asia/Kolkata (IST)</option>
                  <option>UTC</option>
                </select>
              </div>
            </div>

            <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors">Save General Settings</button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 space-y-6">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-100 pb-2 flex items-center gap-2"><Shield className="w-4 h-4" /> Security & Access</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-neutral-800">Maintenance Mode</h4>
                  <p className="text-xs text-neutral-500 font-medium">Disable access for non-admin users across the entire platform.</p>
                </div>
                <div className="w-11 h-6 bg-neutral-200 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                <div>
                  <h4 className="text-sm font-bold text-neutral-800">Enforce 2FA</h4>
                  <p className="text-xs text-neutral-500 font-medium">Require two-factor authentication for all Government and Admin accounts.</p>
                </div>
                <div className="w-11 h-6 bg-blue-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

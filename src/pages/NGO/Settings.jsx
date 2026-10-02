import React from 'react';
import { Bell, Users, Building, Lock } from 'lucide-react';

export default function NGOSettings() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Settings</h1>
        <p className="text-sm text-neutral-500 mt-1 font-semibold">Manage organizational settings and system preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <button className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold transition-colors">Organization</button>
          <button className="w-full text-left px-4 py-3 text-neutral-600 hover:bg-neutral-50 rounded-xl text-sm font-bold transition-colors">Notifications</button>
          <button className="w-full text-left px-4 py-3 text-neutral-600 hover:bg-neutral-50 rounded-xl text-sm font-bold transition-colors">Team Access</button>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-6">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 space-y-6">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-100 pb-2 flex items-center gap-2"><Building className="w-4 h-4" /> Organization Details</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">NGO Name</label>
                <input type="text" defaultValue="Global Relief Initiative" className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Primary Contact Email</label>
                <input type="email" defaultValue="coordinator@globalrelief.org" className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors">Save Changes</button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 space-y-6">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-100 pb-2 flex items-center gap-2"><Bell className="w-4 h-4" /> Notification Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-neutral-800">Critical Stock Alerts</h4>
                  <p className="text-xs text-neutral-500 font-medium">Get notified immediately when inventory drops below threshold.</p>
                </div>
                <div className="w-11 h-6 bg-blue-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                <div>
                  <h4 className="text-sm font-bold text-neutral-800">New Supply Requests</h4>
                  <p className="text-xs text-neutral-500 font-medium">Receive alerts when camps submit new supply requests.</p>
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

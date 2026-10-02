import React from 'react';
import { Laptop, Smartphone, Monitor, ShieldAlert } from 'lucide-react';
import { mockSessions } from '../../data/mock/globalMockData';
import { clsx } from 'clsx';
import { useToast } from '../../context/ToastContext';

export default function ActiveSessions() {
  const { addToast } = useToast();

  const handleSignOut = (id) => {
    addToast('Session Terminated', 'The selected session has been signed out. (Demo)', 'success');
  };

  const getIcon = (device) => {
    if (device.toLowerCase().includes('iphone') || device.toLowerCase().includes('mobile')) return <Smartphone className="w-5 h-5 text-neutral-500" />;
    if (device.toLowerCase().includes('desktop')) return <Monitor className="w-5 h-5 text-neutral-500" />;
    return <Laptop className="w-5 h-5 text-neutral-500" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4 bg-yellow-50 p-3 rounded-xl border border-yellow-200">
        <ShieldAlert className="w-4 h-4 text-yellow-600 shrink-0" />
        <p className="text-xs font-bold text-yellow-800 uppercase tracking-wider">Demo Security Interface - Frontend Only</p>
      </div>

      <div className="divide-y divide-neutral-100">
        {mockSessions.map(session => (
          <div key={session.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center border border-neutral-200">
                {getIcon(session.device)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  {session.device} 
                  {session.isCurrent && <span className="bg-green-100 text-green-700 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded">This Device</span>}
                </h4>
                <p className="text-xs font-semibold text-neutral-500 mt-0.5">{session.browser} • {session.location}</p>
                <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-wider">Last Active: {session.lastActive}</p>
              </div>
            </div>
            {!session.isCurrent && (
              <button 
                onClick={() => handleSignOut(session.id)}
                className="px-4 py-2 bg-white border border-neutral-200 text-red-600 hover:bg-red-50 hover:border-red-200 text-xs font-bold rounded-lg transition-colors w-full md:w-auto"
              >
                Sign Out
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

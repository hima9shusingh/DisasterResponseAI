import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

export default function SafetyStatusCard({ safetyStatus }) {
  const isDanger = safetyStatus.status === 'High Risk' || safetyStatus.status === 'Emergency';
  const isCaution = safetyStatus.status === 'Caution';
  const isSafe = safetyStatus.status === 'Safe';

  return (
    <div className={clsx(
      "rounded-2xl p-6 shadow-sm border transition-colors",
      isDanger ? "bg-red-50 border-red-100" :
      isCaution ? "bg-orange-50 border-orange-100" :
      "bg-green-50 border-green-100"
    )}>
      <div className="flex items-start gap-4">
        <div className={clsx(
          "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
          isDanger ? "bg-red-100 text-red-600" :
          isCaution ? "bg-orange-100 text-orange-600" :
          "bg-green-100 text-green-600"
        )}>
          {isDanger ? <ShieldAlert className="w-6 h-6" /> : 
           isCaution ? <AlertTriangle className="w-6 h-6" /> :
           <ShieldCheck className="w-6 h-6" />}
        </div>
        <div>
          <h2 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-1">Current Safety Status</h2>
          <p className={clsx(
            "text-2xl font-extrabold leading-tight mb-2",
            isDanger ? "text-red-700" :
            isCaution ? "text-orange-700" :
            "text-green-700"
          )}>{safetyStatus.status}</p>
          <p className={clsx(
            "text-sm font-semibold",
            isDanger ? "text-red-900/80" :
            isCaution ? "text-orange-900/80" :
            "text-green-900/80"
          )}>{safetyStatus.reason}</p>
          
          <div className="mt-4 pt-4 border-t border-black/5 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
            <span className="opacity-60">Last updated: {new Date(safetyStatus.lastUpdated).toLocaleTimeString()}</span>
            <button className="text-neutral-700 hover:underline">View Map</button>
          </div>
        </div>
      </div>
    </div>
  );
}

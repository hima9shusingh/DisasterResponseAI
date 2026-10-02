import React from 'react';

export default function MissionProgress({ rescued, total }) {
  const safeRescued = rescued || 0;
  const safeTotal = total || 1;
  const percentage = Math.round((safeRescued / safeTotal) * 100);
  const remaining = safeTotal - safeRescued;

  return (
    <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Rescue Progress</h3>
          <p className="text-xl font-extrabold text-neutral-800">
            {safeRescued} <span className="text-sm font-semibold text-neutral-500">/ {safeTotal} Rescued</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-blue-600">{percentage}%</p>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{remaining} Remaining</p>
        </div>
      </div>
      
      <div className="w-full bg-neutral-100 rounded-full h-3 overflow-hidden">
        <div 
          className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

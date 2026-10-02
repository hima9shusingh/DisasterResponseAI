import React from 'react';
import { clsx } from 'clsx';

export default function DistributionProgress({ target, current, label }) {
  const safeCurrent = current || 0;
  const safeTarget = target || 1;
  const percentage = Math.min(100, Math.round((safeCurrent / safeTarget) * 100));
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-bold text-neutral-800">{label}</span>
        <span className="text-xs font-bold text-blue-600">{percentage}%</span>
      </div>
      <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
        <div 
          className={clsx(
            "h-full rounded-full transition-all duration-1000",
            percentage === 100 ? "bg-green-500" : "bg-blue-500"
          )}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between items-center mt-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
        <span>{safeCurrent.toLocaleString()} Served</span>
        <span>Target: {safeTarget.toLocaleString()}</span>
      </div>
    </div>
  );
}

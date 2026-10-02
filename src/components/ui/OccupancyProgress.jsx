import React from 'react';
import { clsx } from 'clsx';

export default function OccupancyProgress({ occupancyPct, occupied, capacity }) {
  let colorClass = 'bg-green-500';
  if (occupancyPct >= 100) colorClass = 'bg-red-500';
  else if (occupancyPct >= 85) colorClass = 'bg-orange-500';
  else if (occupancyPct >= 60) colorClass = 'bg-yellow-500';

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-bold mb-1.5">
        <span className="text-neutral-600 uppercase tracking-wider text-[10px]">Capacity Utilization</span>
        <span className={clsx("text-neutral-800", occupancyPct >= 100 && 'text-red-600')}>
          {occupancyPct}%
        </span>
      </div>
      <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden flex">
        <div 
          className={clsx("h-full transition-all duration-1000 ease-out rounded-full", colorClass)}
          style={{ width: `${Math.min(occupancyPct, 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-neutral-500 font-semibold mt-1.5">
        <span>{occupied} Occupied</span>
        <span>{capacity} Total Beds</span>
      </div>
    </div>
  );
}

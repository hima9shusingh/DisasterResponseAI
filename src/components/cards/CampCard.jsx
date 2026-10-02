import React from 'react';
import { clsx } from 'clsx';
import { MapPin } from 'lucide-react';

export default function CampCard({ camp }) {
  const occupancyPercent = (camp.occupied / camp.capacity) * 100;
  const isCritical = occupancyPercent >= 80;

  const getStatusColor = (status) => {
    if (status === 'Good') return 'text-green-600';
    if (status === 'Low') return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="p-4 bg-white border border-neutral-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-bold text-neutral-800 text-sm">{camp.name}</h4>
          <div className="flex items-center text-xs text-neutral-500 mt-1">
            <MapPin className="w-3 h-3 mr-1" />
            {camp.location}
          </div>
        </div>
        <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full">
          {camp.id}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs font-medium mb-1">
          <span className="text-neutral-500">Occupancy</span>
          <span className={clsx(isCritical ? 'text-red-600' : 'text-neutral-700')}>
            {camp.occupied} / {camp.capacity}
          </span>
        </div>
        <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
          <div 
            className={clsx('h-full rounded-full', isCritical ? 'bg-red-500' : 'bg-blue-500')} 
            style={{ width: `${occupancyPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-neutral-50 pt-3">
        <div className="text-center">
          <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Food</p>
          <p className={clsx("text-xs font-bold mt-0.5", getStatusColor(camp.foodStatus))}>{camp.foodStatus}</p>
        </div>
        <div className="text-center border-l border-neutral-50">
          <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Water</p>
          <p className={clsx("text-xs font-bold mt-0.5", getStatusColor(camp.waterStatus))}>{camp.waterStatus}</p>
        </div>
        <div className="text-center border-l border-neutral-50">
          <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Medical</p>
          <p className={clsx("text-xs font-bold mt-0.5", getStatusColor(camp.medicalStatus))}>{camp.medicalStatus}</p>
        </div>
      </div>
    </div>
  );
}

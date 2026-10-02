import React from 'react';
import { MapPin, Phone, Activity } from 'lucide-react';
import { clsx } from 'clsx';

export default function NearbyServiceCard({ service }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm hover:border-blue-200 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-sm text-neutral-800 truncate">{service.name}</h4>
        <span className={clsx(
          "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase whitespace-nowrap",
          service.status === 'Operational' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
        )}>
          {service.status}
        </span>
      </div>
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-3">{service.type}</p>
      
      <div className="flex items-center gap-4 text-xs text-neutral-600 font-semibold">
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-blue-500" />
          {service.distance}
        </div>
        <div className="flex items-center gap-1">
          <Phone className="w-3.5 h-3.5 text-blue-500" />
          {service.contact}
        </div>
      </div>
    </div>
  );
}

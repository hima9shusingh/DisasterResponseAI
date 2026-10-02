import React from 'react';

export default function MapLegend() {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-neutral-200 p-3 pointer-events-auto text-xs hidden sm:block">
      <div className="flex gap-6">
        <div>
          <p className="font-bold text-neutral-800 uppercase tracking-wider mb-2 text-[9px]">Severity</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> <span className="text-neutral-600 font-semibold">Critical</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div> <span className="text-neutral-600 font-semibold">High</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div> <span className="text-neutral-600 font-semibold">Medium</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> <span className="text-neutral-600 font-semibold">Low</span></div>
          </div>
        </div>
        <div>
          <p className="font-bold text-neutral-800 uppercase tracking-wider mb-2 text-[9px]">Entities</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 transform rotate-45"></div> <span className="text-neutral-600 font-semibold">Incident</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-600"></div> <span className="text-neutral-600 font-semibold">Relief Camp</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border-2 border-blue-600 bg-white"></div> <span className="text-neutral-600 font-semibold">Service</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

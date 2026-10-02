import React from 'react';
import { Download } from 'lucide-react';

export default function ChartCard({ title, subtitle, icon: Icon, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-blue-500" />} {title}
          </h2>
          {subtitle && <p className="text-xs text-neutral-500 font-semibold mt-1">{subtitle}</p>}
        </div>
        <button className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Export Chart Data">
          <Download className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 w-full min-h-[250px]">
        {children}
      </div>
    </div>
  );
}

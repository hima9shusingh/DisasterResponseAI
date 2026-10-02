import React from 'react';

export default function AdminKpiCard({ title, value, icon: Icon, colorClass }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colorClass}`}><Icon className="w-6 h-6" /></div>
      <div>
        <p className="text-2xl font-extrabold text-neutral-800">{value}</p>
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{title}</p>
      </div>
    </div>
  );
}

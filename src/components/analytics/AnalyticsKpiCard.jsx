import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { clsx } from 'clsx';

export default function AnalyticsKpiCard({ label, value, trend, comparison }) {
  const isPositive = trend === 'up';
  const isNeutral = trend === 'neutral';

  return (
    <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm flex flex-col justify-between">
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-extrabold text-neutral-900">{value}</p>
        <div className={clsx(
          "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg",
          isNeutral ? "bg-neutral-100 text-neutral-600" : isPositive ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
        )}>
          {isNeutral ? <Minus className="w-3 h-3" /> : isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {comparison}
        </div>
      </div>
    </div>
  );
}

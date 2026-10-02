import React from 'react';
import { clsx } from 'clsx';

export default function SeverityScore({ score, label = "Risk Score" }) {
  const getSeverity = (s) => {
    if (s >= 80) return { color: 'text-red-600', bg: 'bg-red-50', stroke: 'stroke-red-500', name: 'Critical' };
    if (s >= 60) return { color: 'text-orange-600', bg: 'bg-orange-50', stroke: 'stroke-orange-500', name: 'High' };
    if (s >= 40) return { color: 'text-yellow-600', bg: 'bg-yellow-50', stroke: 'stroke-yellow-500', name: 'Moderate' };
    return { color: 'text-green-600', bg: 'bg-green-50', stroke: 'stroke-green-500', name: 'Low' };
  };

  const severity = getSeverity(score);
  const strokeDasharray = 283; 
  const strokeDashoffset = strokeDasharray - (strokeDasharray * score) / 100;

  return (
    <div className={clsx("p-6 rounded-3xl flex flex-col items-center justify-center text-center transition-colors", severity.bg)}>
      <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-wider mb-4">{label}</h3>
      
      <div className="relative w-32 h-32 mb-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-black/5" />
          <circle 
            cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" 
            className={clsx("transition-all duration-1000 ease-out", severity.stroke)}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={clsx("text-3xl font-black", severity.color)}>{score}</span>
          <span className="text-[10px] font-bold text-neutral-500 uppercase">/ 100</span>
        </div>
      </div>
      <p className={clsx("text-sm font-bold px-3 py-1 rounded-lg mt-2", severity.color, severity.bg.replace('bg-', 'bg-white border border-').replace('50', '200'))}>
        {severity.name} Severity
      </p>
    </div>
  );
}

import React from 'react';
import { clsx } from 'clsx';
import { AlertTriangle } from 'lucide-react';

export default function RiskScore({ score }) {
  const getSeverity = (s) => {
    if (s >= 80) return { label: 'Critical Risk', color: 'text-red-600', bg: 'bg-red-50', stroke: 'stroke-red-500' };
    if (s >= 60) return { label: 'High Risk', color: 'text-orange-600', bg: 'bg-orange-50', stroke: 'stroke-orange-500' };
    if (s >= 40) return { label: 'Moderate Risk', color: 'text-yellow-600', bg: 'bg-yellow-50', stroke: 'stroke-yellow-500' };
    return { label: 'Low Risk', color: 'text-green-600', bg: 'bg-green-50', stroke: 'stroke-green-500' };
  };

  const severity = getSeverity(score);
  const strokeDasharray = 283; // Circumference of r=45
  const strokeDashoffset = strokeDasharray - (strokeDasharray * score) / 100;

  return (
    <div className={clsx("p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col items-center justify-center text-center", severity.bg)}>
      <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-6">Overall Risk Score</h3>
      
      <div className="relative w-32 h-32 mb-4">
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
          <span className={clsx("text-3xl font-extrabold", severity.color)}>{score}</span>
          <span className="text-[10px] font-bold text-neutral-400 uppercase">/ 100</span>
        </div>
      </div>

      <div className={clsx("flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-white shadow-sm mb-4", severity.color, severity.stroke.replace('stroke-', 'border-'))}>
        <AlertTriangle className="w-4 h-4" />
        <span className="text-sm font-bold uppercase tracking-wider">{severity.label}</span>
      </div>

      <p className="text-[10px] font-semibold text-neutral-500 leading-relaxed px-4">
        Factors: Rainfall intensity, wind conditions, historical incident density, and active alerts.
      </p>
    </div>
  );
}

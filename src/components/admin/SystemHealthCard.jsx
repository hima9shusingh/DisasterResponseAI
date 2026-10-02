import React from 'react';
import { clsx } from 'clsx';
import { Server, Activity, AlertTriangle } from 'lucide-react';

export default function SystemHealthCard({ health }) {
  const isOperational = health.status.includes('Operational');
  const isWarning = health.status.includes('Warning');
  
  return (
    <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className={clsx("p-2.5 rounded-xl", 
            isOperational ? "bg-green-50 text-green-600" : 
            isWarning ? "bg-yellow-50 text-yellow-600" : "bg-red-50 text-red-600"
          )}>
            {isOperational ? <Server className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <h3 className="font-bold text-neutral-900 leading-tight">{health.service}</h3>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className={clsx(
            "w-2 h-2 rounded-full",
            isOperational ? "bg-green-500 animate-pulse" : 
            isWarning ? "bg-yellow-500" : "bg-red-500"
          )}></span>
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{health.status}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Latency</p>
            <p className="text-sm font-bold text-neutral-800">{health.latency}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Uptime</p>
            <p className="text-sm font-bold text-neutral-800">{health.uptime}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

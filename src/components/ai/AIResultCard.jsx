import React from 'react';
import { Sparkles, BrainCircuit, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

export default function AIResultCard({ classification, severity, confidence, riskScore, finalSeverity }) {
  return (
    <div className="bg-white p-6 rounded-3xl border-2 border-indigo-100 shadow-sm relative overflow-hidden">
      
      {/* Badge */}
      <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
        <Sparkles className="w-3 h-3" /> Simulated Demo Result
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-0.5">Damage Classification</p>
          <h2 className="text-xl font-black text-neutral-900 leading-tight">{classification} Damage</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
          <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">AI Severity</p>
          <p className={clsx(
            "text-lg font-black",
            severity === 'Critical' ? 'text-red-600' : severity === 'High' ? 'text-orange-600' : 'text-yellow-600'
          )}>{severity}</p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">AI Confidence</p>
          <div className="flex items-end gap-1">
            <p className="text-2xl font-black text-indigo-700 leading-none">{confidence}%</p>
          </div>
        </div>
      </div>

      {finalSeverity && (
        <div className="mt-4 bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center justify-between">
           <div>
             <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Human Review</p>
             <p className="text-lg font-black text-red-700">{finalSeverity}</p>
           </div>
        </div>
      )}

    </div>
  );
}

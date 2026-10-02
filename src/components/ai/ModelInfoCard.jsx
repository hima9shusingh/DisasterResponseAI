import React, { useState } from 'react';
import { BrainCircuit, Info, ChevronDown, ChevronUp } from 'lucide-react';

export default function ModelInfoCard() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
      <button 
        onClick={() => setExpanded(!expanded)} 
        className="w-full p-4 flex items-center justify-between bg-neutral-50 hover:bg-neutral-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-neutral-900">AI Model Status</h3>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Demo Simulation Mode</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
      </button>
      
      {expanded && (
        <div className="p-5 border-t border-neutral-100 bg-white">
          <div className="flex items-start gap-2 mb-4 bg-blue-50 p-3 rounded-lg text-blue-800 text-xs font-semibold border border-blue-100">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>This module uses simulated frontend inference. A trained ML model or external Computer Vision API can be connected to the service layer without UI rewrites.</p>
          </div>
          
          <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">Future Target Capabilities</h4>
          <ul className="text-xs font-medium text-neutral-600 space-y-1.5 list-disc pl-4">
            <li>Flood extent mapping & depth estimation</li>
            <li>Fire damage & burn scar classification</li>
            <li>Structural building damage assessment</li>
            <li>Road network blockage detection</li>
          </ul>
        </div>
      )}
    </div>
  );
}

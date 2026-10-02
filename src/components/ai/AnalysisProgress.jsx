import React, { useEffect, useState } from 'react';
import { Loader2, BrainCircuit, ScanSearch, LineChart, CheckCircle2 } from 'lucide-react';

const STAGES = [
  { id: 1, text: 'Preparing image tensor...', icon: ScanSearch },
  { id: 2, text: 'Extracting visual features...', icon: BrainCircuit },
  { id: 3, text: 'Estimating damage severity...', icon: LineChart },
  { id: 4, text: 'Generating assessment report...', icon: CheckCircle2 }
];

export default function AnalysisProgress({ onComplete }) {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStage(prev => {
        if (prev >= STAGES.length - 1) {
          clearInterval(timer);
          setTimeout(onComplete, 800); // Small delay before complete
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="w-full max-w-md mx-auto py-12">
      <div className="text-center mb-10">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-50"></div>
          <div className="relative w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
            <BrainCircuit className="w-10 h-10 animate-pulse" />
          </div>
        </div>
        <h2 className="text-xl font-black text-neutral-900">Running AI Analysis</h2>
        <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mt-2">Demo Inference Engine</p>
      </div>

      <div className="space-y-4 relative">
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-neutral-100"></div>
        {STAGES.map((stage, idx) => {
          const isActive = currentStage === idx;
          const isPast = currentStage > idx;
          const Icon = stage.icon;

          return (
            <div key={stage.id} className={`flex items-center gap-4 transition-all duration-500 relative z-10 ${isActive ? 'opacity-100 scale-105' : isPast ? 'opacity-50' : 'opacity-20'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-colors duration-500 ${isActive ? 'bg-blue-600 text-white' : isPast ? 'bg-green-500 text-white' : 'bg-white border-2 border-neutral-200 text-neutral-400'}`}>
                {isPast ? <CheckCircle2 className="w-5 h-5" /> : isActive ? <Loader2 className="w-5 h-5 animate-spin" /> : <Icon className="w-5 h-5" />}
              </div>
              <div>
                <p className={`text-sm font-bold ${isActive ? 'text-blue-900' : 'text-neutral-700'}`}>{stage.text}</p>
                {isActive && <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-0.5 animate-pulse">Processing...</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

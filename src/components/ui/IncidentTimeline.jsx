import React from 'react';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';

const STAGES = [
  'Pending Verification',
  'Verified',
  'Resources Assigned',
  'Rescue In Progress',
  'Resolved'
];

export default function IncidentTimeline({ currentStatus }) {
  const currentIndex = STAGES.indexOf(currentStatus);

  return (
    <div className="w-full py-4">
      <div className="flex justify-between relative">
        {/* Background Line */}
        <div className="absolute left-0 right-0 top-3.5 h-1 bg-neutral-200 rounded-full z-0" />
        
        {/* Progress Line */}
        <div 
          className="absolute left-0 top-3.5 h-1 bg-blue-600 rounded-full z-0 transition-all duration-500 ease-in-out" 
          style={{ width: `${(currentIndex / (STAGES.length - 1)) * 100}%` }}
        />

        {STAGES.map((stage, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          
          return (
            <div key={stage} className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className={clsx(
                  'w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors shadow-sm',
                  isCompleted ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-neutral-300 text-neutral-400',
                  isCurrent && 'ring-4 ring-blue-100'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
              </div>
              <span className={clsx(
                'text-[10px] sm:text-xs font-bold text-center w-20 leading-tight',
                isCurrent ? 'text-blue-700' : (isCompleted ? 'text-neutral-700' : 'text-neutral-400')
              )}>
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

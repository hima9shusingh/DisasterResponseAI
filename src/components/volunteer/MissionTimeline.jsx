import React from 'react';
import { clsx } from 'clsx';
import { CheckCircle2, Circle } from 'lucide-react';

export default function MissionTimeline({ timeline }) {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="relative pl-4 space-y-6">
      <div className="absolute left-[23px] top-4 bottom-4 w-px bg-neutral-200"></div>
      
      {timeline.map((event, idx) => {
        const isLast = idx === timeline.length - 1;
        
        return (
          <div key={idx} className="relative z-10 flex items-start gap-4">
            <div className={clsx(
              "w-6 h-6 rounded-full flex items-center justify-center mt-0.5",
              event.active ? "bg-blue-100 text-blue-600 ring-4 ring-white" : "bg-white text-green-500 border-2 border-green-500"
            )}>
              {event.active ? <Circle className="w-3 h-3 fill-current" /> : <CheckCircle2 className="w-6 h-6" />}
            </div>
            <div>
              <p className={clsx("text-sm font-bold", event.active ? "text-blue-700" : "text-neutral-800")}>{event.stage}</p>
              <p className="text-[10px] font-semibold text-neutral-400 mt-0.5">{new Date(event.time).toLocaleString()}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

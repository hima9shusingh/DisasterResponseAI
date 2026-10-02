import React from 'react';
import { CheckCircle2, Clock, Check } from 'lucide-react';
import { clsx } from 'clsx';

export default function ReportStatusTimeline({ timeline }) {
  // Find the index of the first uncompleted stage to mark the "current" active stage
  const currentIndex = timeline.findIndex(t => !t.completed);
  const activeIndex = currentIndex === -1 ? timeline.length : currentIndex;

  return (
    <div className="relative pl-4 space-y-6 before:absolute before:inset-0 before:ml-[1.4375rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-200 before:via-neutral-200 before:to-transparent">
      {timeline.map((stage, idx) => {
        const isCompleted = stage.completed;
        const isNextPending = idx === activeIndex;

        return (
          <div key={stage.id} className="relative flex items-center md:justify-center">
            <div className={clsx(
              "absolute left-[-1.5rem] md:relative md:left-0 z-10 w-7 h-7 flex items-center justify-center rounded-full border-2 bg-white",
              isCompleted ? "border-green-500 text-green-500" : 
              isNextPending ? "border-blue-500 text-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]" : 
              "border-neutral-200 text-neutral-300"
            )}>
              {isCompleted ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            </div>
            <div className={clsx(
              "pl-4 md:pl-0 md:absolute md:left-[calc(50%+2rem)] md:w-48 text-sm",
              idx % 2 === 0 ? "md:left-auto md:right-[calc(50%+2rem)] md:text-right" : ""
            )}>
              <p className={clsx(
                "font-bold",
                isCompleted ? "text-neutral-800" : isNextPending ? "text-blue-600" : "text-neutral-400"
              )}>
                {stage.stage}
              </p>
              {stage.time && (
                <p className="text-[10px] font-semibold text-neutral-400 mt-0.5 uppercase tracking-wider">
                  {new Date(stage.time).toLocaleString(undefined, { hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

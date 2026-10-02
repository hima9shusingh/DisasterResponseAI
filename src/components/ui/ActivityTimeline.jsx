import React from 'react';
import { clsx } from 'clsx';

export default function ActivityTimeline({ activities }) {
  return (
    <div className="relative pl-4 space-y-6">
      {/* Vertical line */}
      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-neutral-100" />
      
      {activities.map((activity) => {
        let dotColor = 'bg-neutral-400';
        if (activity.status === 'success') dotColor = 'bg-green-500';
        if (activity.status === 'critical') dotColor = 'bg-red-500';
        if (activity.status === 'warning') dotColor = 'bg-orange-500';
        if (activity.status === 'info') dotColor = 'bg-blue-500';

        return (
          <div key={activity.id} className="relative flex gap-4">
            <div className={clsx('absolute -left-4 w-2.5 h-2.5 rounded-full border-2 border-white top-1', dotColor)} />
            <div className="flex-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">
                {activity.time}
              </span>
              <p className="text-sm text-neutral-700 font-medium leading-snug">
                {activity.text}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

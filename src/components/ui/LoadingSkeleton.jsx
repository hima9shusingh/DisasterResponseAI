import React from 'react';
import { clsx } from 'clsx';

export default function LoadingSkeleton({ type = "card", className }) {
  if (type === "card") {
    return (
      <div className={clsx("bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm animate-pulse space-y-4", className)}>
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-xl bg-neutral-200"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
            <div className="h-3 bg-neutral-200 rounded w-1/4"></div>
          </div>
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-neutral-200 rounded w-full"></div>
          <div className="h-3 bg-neutral-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className={clsx("w-full animate-pulse", className)}>
        <div className="h-10 bg-neutral-100 rounded-t-xl w-full mb-2"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-neutral-50 rounded-lg w-full mb-2 border border-neutral-100"></div>
        ))}
      </div>
    );
  }

  // default block
  return <div className={clsx("animate-pulse bg-neutral-200 rounded-xl", className)}></div>;
}

import React from 'react';
import { clsx } from 'clsx';
import { SearchX } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = SearchX, 
  title = "No results found", 
  message = "There's no data matching your current filters.",
  action,
  className 
}) {
  return (
    <div className={clsx("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-bold text-neutral-900 mb-1">{title}</h3>
      <p className="text-xs font-semibold text-neutral-500 max-w-sm mx-auto mb-6">
        {message}
      </p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
}

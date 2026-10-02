import React from 'react';
import { clsx } from 'clsx';

export default function SettingsToggle({ title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-4 group cursor-pointer" onClick={() => onChange(!checked)}>
      <div className="pr-4">
        <h4 className="text-sm font-bold text-neutral-900 mb-0.5 group-hover:text-blue-600 transition-colors">{title}</h4>
        {description && <p className="text-xs font-semibold text-neutral-500">{description}</p>}
      </div>
      <div className={clsx(
        "w-12 h-6 rounded-full relative transition-colors duration-200 shrink-0",
        checked ? "bg-blue-600" : "bg-neutral-200"
      )}>
        <div className={clsx(
          "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 shadow-sm",
          checked ? "left-7" : "left-1"
        )}></div>
      </div>
    </div>
  );
}

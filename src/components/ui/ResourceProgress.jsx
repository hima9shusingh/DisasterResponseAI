import React from 'react';

export default function ResourceProgress({ available, deployed, total }) {
  const deployedPercent = (deployed / total) * 100;
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-medium mb-1">
        <span className="text-neutral-500">Avail: {available}</span>
        <span className="text-blue-600">Dep: {deployed}</span>
      </div>
      <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-500" 
          style={{ width: `${deployedPercent}%` }}
        />
      </div>
    </div>
  );
}

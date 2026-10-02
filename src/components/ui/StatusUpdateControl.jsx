import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

const statuses = [
  'Pending Verification',
  'Verified',
  'Resources Assigned',
  'Rescue In Progress',
  'Resolved'
];

export default function StatusUpdateControl({ currentStatus, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const currentIndex = statuses.indexOf(currentStatus);

  const handleSelect = (status, index) => {
    // Prevent backward transitions
    if (index < currentIndex) return;
    
    // If selecting Resolved, we might want a confirmation, but for now just pass it up
    onUpdate(status);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full md:w-56 px-4 py-2 bg-white border border-neutral-200 rounded-lg shadow-sm text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors focus:ring-2 focus:ring-blue-100 focus:outline-none"
      >
        <span>Update Status</span>
        <ChevronDown className="w-4 h-4 text-neutral-400" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full md:w-56 bg-white rounded-xl shadow-lg border border-neutral-100 overflow-hidden py-1">
          {statuses.map((status, idx) => {
            const isCurrent = status === currentStatus;
            const isDisabled = idx < currentIndex;
            
            return (
              <button
                key={status}
                disabled={isDisabled}
                onClick={() => handleSelect(status, idx)}
                className={clsx(
                  'w-full text-left px-4 py-2.5 text-sm font-medium flex items-center justify-between',
                  isDisabled ? 'text-neutral-300 cursor-not-allowed bg-neutral-50/50' : 'text-neutral-700 hover:bg-blue-50 hover:text-blue-700',
                  isCurrent && 'bg-blue-50/50 text-blue-700'
                )}
              >
                <span>{status}</span>
                {isCurrent && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

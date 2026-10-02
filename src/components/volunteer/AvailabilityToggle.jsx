import React from 'react';
import { useVolunteer } from '../../context/VolunteerContext';
import { clsx } from 'clsx';
import { Power, PowerOff } from 'lucide-react';

export default function AvailabilityToggle() {
  const { isAvailable, toggleAvailability } = useVolunteer();

  return (
    <button 
      onClick={toggleAvailability}
      className={clsx(
        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm border",
        isAvailable 
          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" 
          : "bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200"
      )}
    >
      {isAvailable ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
      {isAvailable ? 'Available for Missions' : 'Unavailable'}
    </button>
  );
}

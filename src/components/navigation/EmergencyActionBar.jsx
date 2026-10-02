import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, PlusCircle } from 'lucide-react';

export default function EmergencyActionBar() {
  const navigate = useNavigate();

  const handleSOS = () => {
    // SOS Mock Action
    const confirmed = window.confirm("Are you sure you want to trigger an SOS? This will broadcast your location to emergency services.");
    if (confirmed) {
      alert("SOS Triggered! Emergency services have been notified of your location.");
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-3 flex gap-3 z-50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
      <button 
        onClick={() => navigate('/report')}
        className="flex-1 py-3 px-4 bg-red-50 text-red-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
      >
        <PlusCircle className="w-5 h-5" /> Report
      </button>
      <button 
        onClick={handleSOS}
        className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform"
      >
        <ShieldAlert className="w-5 h-5" /> SOS
      </button>
    </div>
  );
}

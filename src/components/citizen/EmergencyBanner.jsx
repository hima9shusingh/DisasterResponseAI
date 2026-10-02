import React from 'react';
import { AlertTriangle, ChevronRight, PhoneCall } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EmergencyBanner() {
  const navigate = useNavigate();

  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm mb-8">
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-red-900">Emergency situation?</h3>
          <p className="text-xs font-semibold text-red-700">Use SOS or contact official emergency services immediately.</p>
        </div>
      </div>
      <div className="flex w-full md:w-auto gap-2">
        <button 
          onClick={() => navigate('/citizen/emergency-guide')}
          className="flex-1 md:flex-none px-4 py-2 bg-white border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1"
        >
          View Guide
        </button>
        <button 
          onClick={() => navigate('/citizen/sos')}
          className="flex-1 md:flex-none px-4 py-2 bg-red-600 text-white hover:bg-red-700 text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1"
        >
          <PhoneCall className="w-3.5 h-3.5" /> SOS
        </button>
      </div>
    </div>
  );
}

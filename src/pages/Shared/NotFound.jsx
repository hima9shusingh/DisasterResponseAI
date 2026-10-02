import React from 'react';
import { AlertOctagon, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
        <AlertOctagon className="w-12 h-12" strokeWidth={1.5} />
      </div>
      <h1 className="text-4xl font-black text-white tracking-tight mb-2">404 - Not Found</h1>
      <p className="text-sm font-semibold text-neutral-400 max-w-md mx-auto mb-8">
        The route you are looking for does not exist or has been moved. Verify the URL or return to safety.
      </p>
      
      <button 
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-white text-neutral-900 font-bold rounded-xl hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-lg shadow-white/10"
      >
        <Home className="w-5 h-5" /> Return to Safety
      </button>
    </div>
  );
}

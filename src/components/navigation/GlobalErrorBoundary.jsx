import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function GlobalErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error('Caught by GlobalErrorBoundary:', error);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-extrabold text-neutral-900 mb-2">Something went wrong</h1>
        <p className="text-neutral-500 mb-8">
          An unexpected error occurred. We've logged the issue and are working on it.
        </p>

        <div className="space-y-3">
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" /> Try Again
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" /> Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { AlertCircle, ArrowRight, Crosshair, Navigation, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RecommendationCard({ recommendations, priority }) {
  const navigate = useNavigate();
  
  return (
    <div className="bg-indigo-900 p-6 rounded-3xl shadow-lg h-full flex flex-col relative overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none"></div>

      <div className="relative z-10 flex-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-indigo-100 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" /> Suggested Response Actions
          </h3>
          <span className="px-2.5 py-1 bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold rounded uppercase tracking-wider">
            {priority} Priority
          </span>
        </div>
        <p className="text-xs text-indigo-300 mb-4 italic">Note: These are AI recommendations. Official operational decisions remain with authorized personnel.</p>

        <ul className="space-y-4 mb-8">
          {recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm font-medium text-indigo-50">
              <AlertCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              {rec}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-3 mt-auto">
        <button onClick={() => navigate('/government/incidents')} className="py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-sm rounded-xl transition-colors shadow-sm">
          Create Incident
        </button>
        <button onClick={() => navigate('/government/resources')} className="py-2.5 bg-indigo-800 text-white hover:bg-indigo-700 font-bold text-sm rounded-xl transition-colors border border-indigo-700">
          Assign Resources
        </button>
        <button onClick={() => navigate('/map')} className="col-span-2 py-2.5 bg-indigo-950 text-indigo-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors border border-indigo-800 flex items-center justify-center gap-2">
          <Navigation className="w-3.5 h-3.5" /> View on Live Map
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import { Droplets, Flame, Activity, Wind, AlertTriangle, BookOpen } from 'lucide-react';

const iconMap = {
  Droplets,
  Flame,
  Activity,
  Wind,
  AlertTriangle
};

export default function EmergencyGuideCard({ guide, onClick }) {
  const Icon = iconMap[guide.icon] || BookOpen;

  return (
    <button 
      onClick={() => onClick(guide)}
      className="w-full text-left bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group"
    >
      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-neutral-900 mb-1">{guide.title}</h3>
      <p className="text-xs font-semibold text-neutral-500">View preparedness and emergency checklist</p>
    </button>
  );
}

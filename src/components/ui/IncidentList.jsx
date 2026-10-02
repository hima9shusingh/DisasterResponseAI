import React from 'react';
import SeverityBadge from './SeverityBadge';
import StatusBadge from './StatusBadge';
import { MapPin, Users, Clock } from 'lucide-react';

export default function IncidentList({ incidents }) {
  return (
    <div className="flex flex-col gap-3">
      {incidents.map((incident) => (
        <div key={incident._id || incident.id} className="bg-white border border-neutral-100 rounded-xl p-4 shadow-sm hover:border-neutral-200 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-2 py-1 rounded-md">{incident.incidentId || incident.id}</span>
              <h4 className="font-bold text-sm text-neutral-800 capitalize">{incident.disasterType?.replace('_', ' ') || incident.type}</h4>
            </div>
            <SeverityBadge severity={incident.severity} />
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600 mb-4">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span className="truncate">{incident.location?.city || incident.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-neutral-400" />
              <span>{incident.peopleAffected} Affected</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>Reported {incident.reportedAt ? new Date(incident.reportedAt).toLocaleTimeString() : incident.reportedTime}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-neutral-50 pt-3">
            <StatusBadge status={incident.status} />
            <div className="flex gap-2">
              <button className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors">
                View Details
              </button>
              <button className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg shadow-sm transition-colors">
                Assign
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

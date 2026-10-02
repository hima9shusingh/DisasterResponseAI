import React from 'react';
import { X, MapPin, Users, Phone, Navigation, Clock } from 'lucide-react';
import { useMapData } from '../../context/MapContext';
import { clsx } from 'clsx';

export default function MapDetailsPanel() {
  const { selectedEntity, clearSelection } = useMapData();

  if (!selectedEntity) return null;

  const { type, data } = selectedEntity;

  return (
    <div className="w-full md:w-80 lg:w-96 bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.1)] border-l border-neutral-200 h-full flex flex-col pointer-events-auto">
      <div className="px-5 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/80 backdrop-blur-sm">
        <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">
          {type === 'incident' ? 'Incident Details' : 
           type === 'camp' ? 'Relief Camp Details' : 'Service Details'}
        </h2>
        <button onClick={clearSelection} className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-6">
        
        {type === 'incident' && (
          <>
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className={clsx(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                  data.severity === 'Critical' ? "bg-red-50 border-red-200 text-red-700" :
                  data.severity === 'High' ? "bg-orange-50 border-orange-200 text-orange-700" :
                  data.severity === 'Medium' ? "bg-yellow-50 border-yellow-200 text-yellow-700" :
                  "bg-green-50 border-green-200 text-green-700"
                )}>{data.severity} Severity</span>
                <span className="text-[10px] font-bold text-neutral-400">{new Date(data.reportedAt).toLocaleTimeString()}</span>
              </div>
              <h3 className="text-2xl font-extrabold text-neutral-900 leading-tight mb-1">{data.type}</h3>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{data.id}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Location</p>
                  <p className="text-sm font-semibold text-neutral-800">{data.location}</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <Users className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">People Affected</p>
                  <p className="text-sm font-bold text-neutral-800">{data.peopleAffected}</p>
                </div>
              </div>
              <div className="flex gap-3 items-start border-t border-neutral-100 pt-4">
                <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Current Status</p>
                  <p className="text-sm font-bold text-blue-600">{data.status}</p>
                  {data.assignedTeam && <p className="text-xs font-semibold text-neutral-600 mt-1">Assigned: {data.assignedTeam} (ETA: {data.eta})</p>}
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-2">
              <button className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-blue-700 transition-colors">Track Response</button>
              <button className="w-full py-2.5 bg-neutral-100 text-neutral-700 rounded-xl font-bold text-sm hover:bg-neutral-200 transition-colors">View Full Report</button>
            </div>
          </>
        )}

        {type === 'camp' && (
          <>
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className={clsx(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                  data.status === 'Full' ? "bg-red-50 border-red-200 text-red-700" :
                  data.status === 'Near Capacity' ? "bg-orange-50 border-orange-200 text-orange-700" :
                  "bg-green-50 border-green-200 text-green-700"
                )}>{data.status}</span>
              </div>
              <h3 className="text-xl font-extrabold text-neutral-900 leading-tight mb-1">{data.name}</h3>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{data.id}</p>
            </div>

            <div className="space-y-4 border-t border-neutral-100 pt-4">
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex justify-between mb-1">
                  <span>Occupancy</span>
                  <span className="text-neutral-800">{Math.round((data.occupied/data.capacity)*100)}%</span>
                </p>
                <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div className={clsx("h-full", data.status === 'Full' ? 'bg-red-500' : 'bg-blue-500')} style={{ width: `${(data.occupied/data.capacity)*100}%` }}></div>
                </div>
                <p className="text-xs font-semibold text-neutral-500 mt-1">{data.availableBeds} beds available</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-neutral-700">
                <div className="bg-neutral-50 p-2 rounded-lg border border-neutral-100">Food: {data.food}</div>
                <div className="bg-neutral-50 p-2 rounded-lg border border-neutral-100">Water: {data.water}</div>
                <div className="col-span-2 bg-neutral-50 p-2 rounded-lg border border-neutral-100">Medical: {data.medical}</div>
              </div>
            </div>

            <div className="pt-4">
              <button className="w-full py-2.5 bg-neutral-800 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-neutral-900 transition-colors">View Camp Dashboard</button>
            </div>
          </>
        )}

        {type === 'service' && (
          <>
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-blue-50 border-blue-200 text-blue-700">{data.type}</span>
              </div>
              <h3 className="text-xl font-extrabold text-neutral-900 leading-tight mb-1">{data.name}</h3>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{data.id}</p>
            </div>

            <div className="space-y-4 border-t border-neutral-100 pt-4">
              <div className="flex items-center gap-3">
                <Navigation className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-neutral-800">{data.distance} away</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-semibold text-neutral-800">{data.contact}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={clsx("w-3 h-3 rounded-full", data.status === 'Operational' ? 'bg-green-500' : 'bg-red-500')}></div>
                <span className="text-sm font-semibold text-neutral-800">{data.status}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

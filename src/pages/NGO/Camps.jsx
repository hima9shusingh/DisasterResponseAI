import React from 'react';
import { Tent, Users, MapPin, Activity, Phone, Loader2 } from 'lucide-react';
import { useNGO } from '../../context/NGOContext';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';

export default function NGOCamps() {
  const navigate = useNavigate();
  const { camps, isInitializing } = useNGO();

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-neutral-500 font-semibold">Loading relief camps...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Relief Camps</h1>
        <p className="text-sm text-neutral-500 mt-1 font-semibold">Monitor and support partnered relief camp operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {camps.map(camp => {
          const isNearCapacity = (camp.occupied / camp.capacity) > 0.85;

          return (
            <div key={camp._id} className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={clsx("p-2.5 rounded-xl text-white", isNearCapacity ? "bg-orange-500" : "bg-blue-600")}>
                    <Tent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900">{camp.name}</h3>
                    <p className="text-xs font-semibold text-neutral-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {camp.location?.address || camp.location?.city || camp.location}</p>
                  </div>
                </div>
                <span className={clsx("px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider", camp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700')}>
                  {camp.status?.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl mb-4">
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Occupancy</p>
                  <p className="font-bold text-neutral-800 flex items-center gap-1.5"><Users className="w-4 h-4 text-blue-500" /> {camp.occupied} <span className="text-xs text-neutral-500 font-semibold">/ {camp.capacity}</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Medical Support</p>
                  <p className="font-bold text-neutral-800 flex items-center gap-1.5"><Activity className="w-4 h-4 text-red-500" /> {camp.medicalSupport?.type || (camp.medicalSupport ? 'Available' : 'None')}</p>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-bold text-neutral-500 uppercase tracking-wider mb-6">
                <span>Food: <span className={clsx("ml-1", camp.inventory?.food < 20 ? 'text-red-500' : 'text-neutral-700')}>{camp.inventory?.food || 0}kg</span></span>
                <span>Water: <span className={clsx("ml-1", camp.inventory?.water < 50 ? 'text-red-500' : 'text-neutral-700')}>{camp.inventory?.water || 0}L</span></span>
                <span>Meds: <span className={clsx("ml-1", camp.inventory?.medicine < 10 ? 'text-red-500' : 'text-neutral-700')}>{camp.inventory?.medicine || 0}</span></span>
              </div>

              <div className="flex gap-2">
                <button onClick={() => navigate(`/ngo/requests?campId=${camp._id}`)} className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-xs transition-colors border border-blue-200">Send Supplies</button>
                <button onClick={() => window.location.href = `tel:${camp.contactNumber || ''}`} className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Contact Camp</button>
              </div>
            </div>
          );
        })}
        {camps.length === 0 && (
          <div className="md:col-span-2 text-center p-12 bg-white rounded-2xl border border-neutral-100">
            <Tent className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 font-semibold">No relief camps found.</p>
          </div>
        )}
      </div>

    </div>
  );
}

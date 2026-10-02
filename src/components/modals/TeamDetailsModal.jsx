import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Users, Phone, Crosshair, AlertTriangle } from 'lucide-react';
import LocationCard from '../map/LocationCard';

export default function TeamDetailsModal({ isOpen, onClose, team, onAssign, onUpdateStatus }) {
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [incidentId, setIncidentId] = useState('');
  const [mission, setMission] = useState('');

  if (!isOpen || !team) return null;

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!incidentId || !mission) return;
    onAssign(team.id, incidentId, { mission });
    setShowAssignForm(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
            <div>
              <h3 className="font-bold text-lg text-neutral-800">{team.name}</h3>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{team.type} • {team.department}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-neutral-200 rounded-full transition-colors text-neutral-400">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto flex flex-col md:flex-row gap-6">
            
            {/* Left Col - Details */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Leader</p>
                  <p className="font-semibold text-neutral-800 flex items-center gap-1.5"><Users className="w-4 h-4 text-neutral-400" /> {team.leader}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Contact</p>
                  <p className="font-semibold text-blue-600 flex items-center gap-1.5"><Phone className="w-4 h-4 text-neutral-400" /> {team.contact}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Members</p>
                  <p className="font-semibold text-neutral-800">{team.members} Personnel</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Current Status</p>
                  <select 
                    value={team.status}
                    onChange={(e) => onUpdateStatus(team.id, e.target.value)}
                    className="w-full text-xs font-bold text-neutral-800 bg-neutral-50 border border-neutral-200 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-blue-200"
                  >
                    <option value="Available">Available</option>
                    <option value="En Route">En Route</option>
                    <option value="On Mission">On Mission</option>
                    <option value="Returning">Returning</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5 mb-2"><Crosshair className="w-4 h-4" /> Active Mission</h4>
                {team.mission ? (
                  <>
                    <p className="text-sm font-semibold text-blue-900 mb-1">{team.mission}</p>
                    <p className="text-xs text-blue-700">Assigned Incident: <span className="font-bold underline cursor-pointer">{team.assignedIncident}</span></p>
                  </>
                ) : (
                  <p className="text-sm font-medium text-blue-700">Currently on standby. Ready for deployment.</p>
                )}
                
                {team.status === 'Available' && !showAssignForm && (
                  <button onClick={() => setShowAssignForm(true)} className="mt-3 w-full py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
                    Assign to Incident
                  </button>
                )}
              </div>

              {showAssignForm && (
                <form onSubmit={handleAssignSubmit} className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
                  <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2">New Assignment</h4>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Incident ID</label>
                    <input required type="text" value={incidentId} onChange={e => setIncidentId(e.target.value)} placeholder="e.g. INC-1024" className="w-full px-3 py-1.5 text-sm rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-100 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Mission / Instructions</label>
                    <textarea required value={mission} onChange={e => setMission(e.target.value)} placeholder="Enter brief instructions..." className="w-full px-3 py-1.5 text-sm rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-100 outline-none min-h-[60px]" />
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <button type="button" onClick={() => setShowAssignForm(false)} className="px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-200 rounded-lg">Cancel</button>
                    <button type="submit" className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm">Confirm Assignment</button>
                  </div>
                </form>
              )}

            </div>

            {/* Right Col - Map */}
            <div className="w-full md:w-64 flex flex-col gap-3">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Last Known Location</p>
              <p className="text-sm font-semibold text-neutral-800">{team.location}</p>
              {team.coords ? (
                <div className="flex-1 rounded-xl overflow-hidden border border-neutral-200 min-h-[160px] relative z-0">
                  <LocationCard coords={team.coords} locationName={team.location} />
                </div>
              ) : (
                <div className="flex-1 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center min-h-[160px]">
                  <p className="text-xs font-medium text-neutral-400">GPS Offline</p>
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

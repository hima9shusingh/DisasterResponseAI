import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Truck, Clock, ShieldAlert } from 'lucide-react';

export default function AssignResourceModal({ isOpen, onClose, incidentId, availableResources, availableTeams, onSubmit }) {
  const [type, setType] = useState('Ambulance');
  const [team, setTeam] = useState('');
  const [units, setUnits] = useState(1);
  const [eta, setEta] = useState('15 mins');
  const [priority, setPriority] = useState('High');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ type, team, units: parseInt(units, 10), eta, priority });
    onClose();
  };

  // Filter teams based on selected resource type if applicable, otherwise just list all available
  const filteredTeams = availableTeams.filter(t => t.status === 'Available');

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
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
            <h3 className="font-bold text-lg text-neutral-800">Assign Resource</h3>
            <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-400 hover:text-neutral-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto">
            <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-3">
              <Truck className="w-5 h-5 text-blue-600 shrink-0" />
              <p className="text-sm text-blue-800 font-medium leading-snug">Deploying resources to <span className="font-bold">{incidentId}</span>. Ensure ETA is accurately estimated based on current traffic conditions.</p>
            </div>

            <form id="assign-resource-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1.5">Resource Type</label>
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-neutral-800"
                >
                  {availableResources.map(res => (
                    <option key={res.id} value={res.type}>{res.type} (Avail: {res.available})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1.5">Resource / Team</label>
                <select 
                  value={team} 
                  onChange={(e) => setTeam(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-neutral-800"
                >
                  <option value="">-- Select Team or Resource --</option>
                  <optgroup label="Rescue Teams">
                    {filteredTeams.map(t => (
                      <option key={t._id} value={`team_${t._id}`}>{t.name} ({t.type})</option>
                    ))}
                  </optgroup>
                  <optgroup label="Resources">
                    {availableResources.map(r => (
                      <option key={r._id} value={`resource_${r._id}`}>{r.name} ({r.type})</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1.5">Units</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-neutral-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1.5 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> ETA</label>
                  <input 
                    type="text" 
                    value={eta}
                    onChange={(e) => setEta(e.target.value)}
                    placeholder="e.g. 15 mins"
                    required
                    className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-neutral-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1.5 flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> Priority</label>
                <select 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-neutral-800"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </form>
          </div>

          <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-neutral-600 hover:bg-neutral-200 transition-colors">
              Cancel
            </button>
            <button type="submit" form="assign-resource-form" className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors">
              Assign Resource
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

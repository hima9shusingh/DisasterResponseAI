import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, MapPin, Users, Phone, Shield } from 'lucide-react';

export default function ResourceDetailsModal({ isOpen, onClose, resource, onUpdateStatus }) {
  if (!isOpen || !resource) return null;

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
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col"
        >
          <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
            <div>
              <h3 className="font-bold text-lg text-neutral-800 flex items-center gap-2">
                {resource.id} <span className="text-sm px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-bold uppercase tracking-wide">{resource.type}</span>
              </h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-neutral-200 rounded-full transition-colors text-neutral-400">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Department</p>
                <p className="font-semibold text-neutral-800 flex items-center gap-1.5"><Building2 className="w-4 h-4 text-neutral-400" /> {resource.department}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Location</p>
                <p className="font-semibold text-neutral-800 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-neutral-400" /> {resource.location}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Contact Person</p>
                <p className="font-semibold text-neutral-800 flex items-center gap-1.5"><Users className="w-4 h-4 text-neutral-400" /> {resource.contactPerson}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Phone</p>
                <p className="font-semibold text-blue-600 flex items-center gap-1.5"><Phone className="w-4 h-4 text-neutral-400" /> {resource.contactNumber}</p>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-xl border border-neutral-100 p-4 mb-6">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-4 border-b border-neutral-200 pb-2">Unit Inventory</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-neutral-800">{resource.total}</p>
                  <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mt-1">Total</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{resource.available}</p>
                  <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mt-1">Available</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{resource.deployed}</p>
                  <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mt-1">Deployed</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Update Status</p>
              <select 
                value={resource.status}
                onChange={(e) => {
                  onUpdateStatus(resource.id, e.target.value);
                  onClose();
                }}
                className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-neutral-800 font-semibold shadow-sm"
              >
                <option value="Available">Available</option>
                <option value="Partially Available">Partially Available</option>
                <option value="Deployed">Deployed</option>
                <option value="Busy">Busy</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

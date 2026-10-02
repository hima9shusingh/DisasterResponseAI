import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function EditCampModal({ isOpen, onClose, onSubmit, camp }) {
  const [formData, setFormData] = useState({
    capacity: 0,
    occupied: 0,
    status: 'Active',
  });

  useEffect(() => {
    if (camp) {
      setFormData({
        capacity: camp.capacity,
        occupied: camp.occupied,
        status: camp.status,
      });
    }
  }, [camp]);

  if (!isOpen || !camp) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(camp.id, formData);
    onClose();
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
            <div>
              <h3 className="font-bold text-lg text-neutral-800">Update Camp Status</h3>
              <p className="text-xs font-semibold text-neutral-500 uppercase">{camp.name} ({camp.id})</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-neutral-200 rounded-full transition-colors text-neutral-400">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto">
            <form id="edit-camp-form" onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Total Capacity (Beds)</label>
                  <input required name="capacity" type="number" min="1" value={formData.capacity} onChange={handleChange} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-sm font-bold text-neutral-800" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Currently Occupied</label>
                  <input required name="occupied" type="number" min="0" value={formData.occupied} onChange={handleChange} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-sm font-bold text-neutral-800" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Override Operational Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold">
                  <option value="Active">Active</option>
                  <option value="Near Capacity">Near Capacity</option>
                  <option value="Full">Full</option>
                  <option value="Temporarily Closed">Temporarily Closed</option>
                </select>
                <p className="text-[10px] text-neutral-500 font-semibold mt-2">(Note: The system will auto-calculate Near Capacity/Full based on occupancy if set to Active)</p>
              </div>

            </form>
          </div>

          <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-neutral-600 hover:bg-neutral-200 transition-colors">Cancel</button>
            <button type="submit" form="edit-camp-form" className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors">Save Updates</button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

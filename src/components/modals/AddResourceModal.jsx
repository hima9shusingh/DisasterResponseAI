import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function AddResourceModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    type: 'Ambulance',
    department: '',
    location: '',
    total: 10,
    contactPerson: '',
    contactNumber: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      total: parseInt(formData.total, 10),
      available: parseInt(formData.total, 10),
    });
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
            <h3 className="font-bold text-lg text-neutral-800">Add New Resource</h3>
            <button onClick={onClose} className="p-2 hover:bg-neutral-200 rounded-full transition-colors text-neutral-400">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto">
            <form id="add-resource-form" onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1.5">Resource Type</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-neutral-800">
                  <option value="Ambulance">Ambulance</option>
                  <option value="Fire Brigade">Fire Brigade</option>
                  <option value="Police Units">Police Units</option>
                  <option value="Medical Team">Medical Team</option>
                  <option value="Rescue Boat">Rescue Boat</option>
                  <option value="Volunteers">Volunteers</option>
                  <option value="Food Supply">Food Supply</option>
                  <option value="Water Supply">Water Supply</option>
                  <option value="Medicines">Medicines</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1.5">Department</label>
                  <input required name="department" type="text" value={formData.department} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-neutral-800" placeholder="e.g. Health Dept" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1.5">Total Units</label>
                  <input required name="total" type="number" min="1" value={formData.total} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-neutral-800" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1.5">Location</label>
                <input required name="location" type="text" value={formData.location} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-neutral-800" placeholder="e.g. Base Camp Alpha" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1.5">Contact Person</label>
                  <input required name="contactPerson" type="text" value={formData.contactPerson} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-neutral-800" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1.5">Phone Number</label>
                  <input required name="contactNumber" type="text" value={formData.contactNumber} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm text-neutral-800" />
                </div>
              </div>
            </form>
          </div>

          <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-neutral-600 hover:bg-neutral-200 transition-colors">Cancel</button>
            <button type="submit" form="add-resource-form" className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors">Add Resource</button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

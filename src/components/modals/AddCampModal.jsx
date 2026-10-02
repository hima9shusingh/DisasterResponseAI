import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function AddCampModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    district: '',
    state: '',
    capacity: 1000,
    contactPerson: '',
    contactNumber: '',
    initialFoodStock: 1000,
    initialWaterStock: 2000,
    initialMedicineStock: 'Good'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      capacity: parseInt(formData.capacity, 10),
      initialFoodStock: parseInt(formData.initialFoodStock, 10),
      initialWaterStock: parseInt(formData.initialWaterStock, 10),
      coords: [28.6139 + (Math.random() * 0.05 - 0.025), 77.2090 + (Math.random() * 0.05 - 0.025)], // mock coords near center
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
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
            <h3 className="font-bold text-lg text-neutral-800">Establish Relief Camp</h3>
            <button onClick={onClose} className="p-2 hover:bg-neutral-200 rounded-full transition-colors text-neutral-400">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto">
            <form id="add-camp-form" onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider border-b border-blue-100 pb-2">Basic Info</h4>
                <div>
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Camp Name</label>
                  <input required name="name" type="text" value={formData.name} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold" placeholder="e.g. Central Relief Hub" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Address</label>
                    <input required name="address" type="text" value={formData.address} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">District</label>
                    <input required name="district" type="text" value={formData.district} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">State</label>
                    <input required name="state" type="text" value={formData.state} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Contact Person</label>
                    <input required name="contactPerson" type="text" value={formData.contactPerson} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                    <input required name="contactNumber" type="text" value={formData.contactNumber} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider border-b border-blue-100 pb-2">Logistics & Capacity</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Total Capacity</label>
                    <input required name="capacity" type="number" min="10" value={formData.capacity} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-sm font-bold text-neutral-800" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Food (Meals)</label>
                    <input required name="initialFoodStock" type="number" min="0" value={formData.initialFoodStock} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Water (L)</label>
                    <input required name="initialWaterStock" type="number" min="0" value={formData.initialWaterStock} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Medical Stock</label>
                    <select name="initialMedicineStock" value={formData.initialMedicineStock} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none text-sm font-semibold">
                      <option value="Good">Good</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex justify-end gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-200 transition-colors">Cancel</button>
            <button type="submit" form="add-camp-form" className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors">Create Relief Camp</button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

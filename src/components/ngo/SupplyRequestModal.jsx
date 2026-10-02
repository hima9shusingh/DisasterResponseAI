import React, { useState, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';

export default function SupplyRequestModal({ isOpen, onClose, onSubmit, camps, defaultCampId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    campId: defaultCampId || '',
    item: '',
    category: 'food',
    quantity: '',
    priority: 'medium',
    reason: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, campId: defaultCampId || '' }));
    }
  }, [isOpen, defaultCampId]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({ ...formData, quantity: parseInt(formData.quantity, 10) });
      setFormData({ campId: '', item: '', category: 'food', quantity: '', priority: 'medium', reason: '' });
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        
        <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
          <h2 className="text-lg font-bold text-neutral-900">Create Supply Request</h2>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-800 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Relief Camp</label>
                <select required value={formData.campId} onChange={e => setFormData({...formData, campId: e.target.value})} className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Select Camp...</option>
                  {camps.map(camp => (
                    <option key={camp._id} value={camp._id}>{camp.name} ({camp.campId})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Requested Item (Name)</label>
                <input type="text" required value={formData.item} onChange={e => setFormData({...formData, item: e.target.value})} placeholder="e.g. Blankets, Rice" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Category</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="food">Food</option>
                  <option value="water">Water</option>
                  <option value="medicine">Medicine</option>
                  <option value="blankets">Blankets</option>
                  <option value="clothing">Clothing</option>
                  <option value="emergency_kits">Emergency Kits</option>
                  <option value="sanitary_supplies">Sanitary Supplies</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Quantity</label>
                <input type="number" required min="1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} placeholder="e.g. 100" className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Priority</label>
                <div className="flex gap-4">
                  {['low', 'medium', 'high', 'critical'].map(p => (
                    <label key={p} className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-neutral-700 capitalize">
                      <input type="radio" name="priority" value={p} checked={formData.priority === p} onChange={e => setFormData({...formData, priority: e.target.value})} className="accent-blue-600" />
                      {p}
                    </label>
                  ))}
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Reason</label>
                <textarea required value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} placeholder="Why is this requested?" rows={3} className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              </div>

            </div>

          </div>

          <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 bg-neutral-200 text-neutral-800 text-sm font-bold rounded-xl hover:bg-neutral-300 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

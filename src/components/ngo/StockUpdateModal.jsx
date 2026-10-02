import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export default function StockUpdateModal({ isOpen, onClose, onSave, item }) {
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (isOpen) setQuantity('');
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quantity || isNaN(quantity)) return;
    onSave(item.campId, item.itemKey, parseInt(quantity, 10));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        
        <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
          <h2 className="text-lg font-bold text-neutral-900">Add Stock</h2>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-800 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Item</p>
              <p className="font-bold text-neutral-800">{item.item}</p>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Current Stock</p>
                <p className="font-bold text-neutral-800">{item.quantity} {item.unit}</p>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Location</p>
                <p className="font-bold text-neutral-800 text-sm truncate">{item.camp}</p>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Quantity to Add</label>
              <div className="relative">
                <input 
                  type="number"
                  required
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full p-3 bg-white border border-neutral-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none pr-16"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">{item.unit}</span>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-neutral-200 text-neutral-800 text-sm font-bold rounded-xl hover:bg-neutral-300 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2">
              <Save className="w-4 h-4" /> Save
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

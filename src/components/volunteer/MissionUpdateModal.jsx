import React, { useState } from 'react';
import { X, Camera, Save } from 'lucide-react';

export default function MissionUpdateModal({ isOpen, onClose, onSave, remaining }) {
  const [rescued, setRescued] = useState(0);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave(rescued, notes);
    setRescued(0);
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        
        <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
          <h2 className="text-lg font-bold text-neutral-900">Update Rescue Progress</h2>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-800 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-5">
          
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">People Rescued in this trip</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="0" 
                max={remaining} 
                value={rescued} 
                onChange={e => setRescued(parseInt(e.target.value))}
                className="flex-1"
              />
              <div className="w-16 p-2 bg-neutral-100 text-center font-bold text-neutral-800 rounded-lg">{rescued}</div>
            </div>
            <p className="text-xs text-neutral-500 mt-2 font-semibold">Remaining to rescue: {remaining - rescued}</p>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Operational Notes</label>
            <textarea 
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Any hazards or medical requirements?"
              className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Photo Evidence (Optional)</label>
            <button className="w-full py-4 border-2 border-dashed border-neutral-300 rounded-xl flex flex-col items-center justify-center text-neutral-500 hover:bg-neutral-50 hover:text-blue-600 hover:border-blue-300 transition-colors gap-2">
              <Camera className="w-6 h-6" />
              <span className="text-xs font-bold">Tap to take photo</span>
            </button>
          </div>

        </div>

        <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 bg-neutral-200 text-neutral-800 text-sm font-bold rounded-xl hover:bg-neutral-300 transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Update
          </button>
        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function EditProfileModal({ profile, onClose, onSave }) {
  const [formData, setFormData] = useState({ ...profile });
  const { addToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    addToast('Profile Updated', 'Your profile information has been saved successfully.', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50 shrink-0">
          <h2 className="text-xl font-black text-neutral-900">Edit Profile</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-200 text-neutral-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Full Name</label>
            <input 
              type="text" name="name" value={formData.name || ''} onChange={handleChange} required
              className="w-full p-3 bg-white border border-neutral-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" name="email" value={formData.email || ''} onChange={handleChange} required
              className="w-full p-3 bg-white border border-neutral-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Phone Number</label>
            <input 
              type="tel" name="phone" value={formData.phone || ''} onChange={handleChange}
              className="w-full p-3 bg-white border border-neutral-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Location</label>
            <input 
              type="text" name="location" value={formData.location || ''} onChange={handleChange}
              className="w-full p-3 bg-white border border-neutral-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Render extra fields based on existing keys in the profile object */}
          {formData.department && (
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Department</label>
              <input 
                type="text" name="department" value={formData.department} onChange={handleChange}
                className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-500" disabled
              />
              <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase">Contact system admin to change department.</p>
            </div>
          )}
        </form>

        <div className="p-6 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-neutral-600 hover:bg-neutral-200 transition-colors">
            Cancel
          </button>
          <button type="submit" onClick={handleSubmit} className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}

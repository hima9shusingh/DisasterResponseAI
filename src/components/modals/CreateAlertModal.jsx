import React, { useState } from 'react';
import { X, BellRing, Eye } from 'lucide-react';
import { clsx } from 'clsx';
import EmergencyAlertBanner from '../ui/EmergencyAlertBanner';

export default function CreateAlertModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Flood',
    severity: 'Warning',
    location: '',
    description: '',
    instructions: '',
    startTime: '',
    endTime: ''
  });
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (status) => {
    onSave({
      title: formData.title,
      type: formData.type.toLowerCase(),
      severity: formData.severity.toLowerCase(),
      targetRegion: formData.location,
      description: formData.description,
      instructions: formData.instructions,
      startTime: formData.startTime || undefined,
      endTime: formData.endTime || undefined,
      status: status.toLowerCase()
    });
    onClose();
  };

  const previewAlert = { ...formData, id: 'PREVIEW-001', status: 'Active' };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2"><BellRing className="w-5 h-5 text-blue-600" /> Create Emergency Alert</h2>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-800 rounded-lg hover:bg-neutral-200 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {showPreview ? (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-2">Banner Preview</h3>
              <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                <EmergencyAlertBanner alert={previewAlert} />
              </div>
              <p className="text-xs text-neutral-500 italic mt-4">This banner will appear on all public and citizen dashboards if published as Active with Critical or Warning severity.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Alert Title</label>
                <input name="title" value={formData.title} onChange={handleChange} className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. CRITICAL FLOOD WARNING" />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Type</label>
                <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Flood">Flood</option>
                  <option value="Cyclone">Cyclone</option>
                  <option value="Fire">Fire</option>
                  <option value="Earthquake">Earthquake</option>
                  <option value="Landslide">Landslide</option>
                  <option value="Weather">Weather</option>
                  <option value="General Emergency">General Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Severity</label>
                <select name="severity" value={formData.severity} onChange={handleChange} className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Critical">Critical</option>
                  <option value="Warning">Warning</option>
                  <option value="Watch">Watch</option>
                  <option value="Information">Information</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Target Region / Location</label>
                <input name="location" value={formData.location} onChange={handleChange} className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Guwahati, Assam" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Brief explanation of the emergency..." />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Emergency Instructions</label>
                <textarea name="instructions" value={formData.instructions} onChange={handleChange} rows={3} className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="1. Move to higher ground..." />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Start Time (Optional)</label>
                <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">End Time (Optional)</label>
                <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex justify-between items-center">
          <button 
            onClick={() => setShowPreview(!showPreview)} 
            className="text-sm font-bold text-neutral-600 hover:text-blue-600 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" /> {showPreview ? 'Edit Alert' : 'Preview'}
          </button>
          <div className="flex gap-3">
            <button onClick={() => handleSubmit('Draft')} className="px-5 py-2.5 bg-neutral-200 text-neutral-800 text-sm font-bold rounded-xl hover:bg-neutral-300 transition-colors">Save Draft</button>
            <button onClick={() => handleSubmit('Active')} className="px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 shadow-sm transition-colors">Publish Alert</button>
          </div>
        </div>
      </div>
    </div>
  );
}

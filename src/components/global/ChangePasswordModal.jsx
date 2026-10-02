import React, { useState } from 'react';
import { X, ShieldCheck, Key } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { clsx } from 'clsx';

export default function ChangePasswordModal({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { addToast } = useToast();

  const getStrength = (pw) => {
    if (pw.length === 0) return 0;
    if (pw.length < 6) return 1;
    if (pw.length < 10) return 2;
    return 3;
  };
  
  const strength = getStrength(newPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('Error', 'New passwords do not match.', 'error');
      return;
    }
    addToast('Password Updated', 'Your password has been changed successfully. (Demo)', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-neutral-200 overflow-hidden">
        
        <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
          <h2 className="text-xl font-black text-neutral-900 flex items-center gap-2">
            <Key className="w-5 h-5 text-neutral-500" /> Change Password
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-200 text-neutral-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Current Password</label>
            <input 
              type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required
              className="w-full p-3 bg-white border border-neutral-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">New Password</label>
            <input 
              type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required
              className="w-full p-3 bg-white border border-neutral-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />
            <div className="flex gap-1 h-1.5 w-full">
              <div className={clsx("h-full flex-1 rounded-l-full transition-colors", strength >= 1 ? 'bg-red-500' : 'bg-neutral-100')}></div>
              <div className={clsx("h-full flex-1 transition-colors", strength >= 2 ? 'bg-yellow-500' : 'bg-neutral-100')}></div>
              <div className={clsx("h-full flex-1 rounded-r-full transition-colors", strength >= 3 ? 'bg-green-500' : 'bg-neutral-100')}></div>
            </div>
            <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-wider">
              {strength === 0 ? 'Enter password' : strength === 1 ? 'Weak' : strength === 2 ? 'Moderate' : 'Strong'}
            </p>
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Confirm New Password</label>
            <input 
              type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
              className="w-full p-3 bg-white border border-neutral-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-neutral-600 hover:bg-neutral-100 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-3 rounded-xl font-bold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-sm">
              <ShieldCheck className="w-4 h-4" /> Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

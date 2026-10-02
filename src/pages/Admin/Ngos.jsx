import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Building, ShieldCheck, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

export default function AdminNgos() {
  const { users, updateUserStatus } = useAdmin();
  
  // Filter for NGOs only
  const ngos = users.filter(u => u.role === 'NGO');

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">NGO Verification</h1>
        <p className="text-sm text-neutral-500 mt-1 font-semibold">Review and verify Non-Governmental Organizations on the platform.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ngos.map(ngo => (
          <div key={ngo.id} className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col md:flex-row gap-6">
            <div className="w-16 h-16 rounded-xl bg-blue-50 text-blue-600 flex justify-center items-center shrink-0">
              <Building className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-neutral-900 text-lg">{ngo.name}</h3>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{ngo.email}</p>
                </div>
                <span className={clsx(
                  "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                  ngo.status === 'Active' ? 'bg-green-100 text-green-700' :
                  ngo.status === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                )}>
                  {ngo.status === 'Active' ? 'Verified' : ngo.status}
                </span>
              </div>
              <p className="text-sm font-semibold text-neutral-500 mb-4">Region: {ngo.location}</p>
              
              <div className="flex gap-2">
                {ngo.status !== 'Active' && (
                  <button onClick={() => updateUserStatus(ngo.id, 'Active')} className="flex-1 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-green-200">
                    <ShieldCheck className="w-4 h-4" /> Verify & Activate
                  </button>
                )}
                {ngo.status !== 'Suspended' && (
                  <button onClick={() => {
                    if(window.confirm('Suspend this NGO?')) updateUserStatus(ngo.id, 'Suspended');
                  }} className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-red-200">
                    <XCircle className="w-4 h-4" /> Suspend
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

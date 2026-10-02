import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Users, CheckCircle2, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';

export default function AdminVolunteers() {
  const { users, updateUserStatus } = useAdmin();
  
  // Filter for Volunteers
  const volunteers = users.filter(u => u.role === 'Volunteer');

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Volunteer Administration</h1>
        <p className="text-sm text-neutral-500 mt-1 font-semibold">Monitor and verify volunteer registrations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {volunteers.map(vol => (
          <div key={vol.id} className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4 w-full">
              <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex justify-center items-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-neutral-900">{vol.name}</h3>
                  <span className={clsx(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                    vol.status === 'Active' ? 'bg-green-100 text-green-700' :
                    vol.status === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  )}>
                    {vol.status}
                  </span>
                </div>
                <p className="text-xs font-semibold text-neutral-500 mt-0.5">{vol.email} • {vol.location}</p>
                <div className="mt-4 flex gap-2">
                  {vol.status !== 'Active' ? (
                    <button onClick={() => updateUserStatus(vol.id, 'Active')} className="px-4 py-2 flex-1 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-green-200">
                      <CheckCircle2 className="w-4 h-4" /> Activate
                    </button>
                  ) : (
                    <button onClick={() => {
                      if(window.confirm('Suspend Volunteer?')) updateUserStatus(vol.id, 'Suspended');
                    }} className="px-4 py-2 flex-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-red-200">
                      <ShieldAlert className="w-4 h-4" /> Suspend
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

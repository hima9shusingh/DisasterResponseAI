import React from 'react';
import { User, ShieldCheck, Mail, MapPin } from 'lucide-react';

export default function AdminProfile() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          
          <div className="w-24 h-24 rounded-2xl bg-neutral-900 flex items-center justify-center text-white shrink-0 shadow-lg">
            <ShieldCheck className="w-10 h-10 text-blue-400" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">System Admin</h1>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider rounded-lg">Super Administrator</span>
            
            <div className="mt-6 flex flex-col gap-3 text-sm font-semibold text-neutral-600">
              <span className="flex items-center justify-center md:justify-start gap-2"><Mail className="w-4 h-4 text-neutral-400" /> admin@adrras.gov.in</span>
              <span className="flex items-center justify-center md:justify-start gap-2"><MapPin className="w-4 h-4 text-neutral-400" /> Delhi Data Center</span>
            </div>
          </div>

        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
        <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-100 pb-2 mb-6">Security Credentials</h2>
        <div className="space-y-4">
          <button className="w-full py-3 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 rounded-xl text-sm font-bold transition-colors border border-neutral-200">Change Password</button>
          <button className="w-full py-3 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 rounded-xl text-sm font-bold transition-colors border border-neutral-200">Setup Two-Factor Authentication</button>
        </div>
      </div>

    </div>
  );
}

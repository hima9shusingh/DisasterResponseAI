import React from 'react';
import { Camera, MapPin, Mail, Phone, ShieldCheck } from 'lucide-react';

export default function ProfileHeader({ profile, role }) {
  // Generate initials
  const initials = profile.name.split(' ').map(n => n[0]).join('').substring(0, 2);

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden mb-6 relative">
      {/* Cover Banner */}
      <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 w-full relative">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="px-8 pb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12 relative z-10">
          
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-md">
              <div className="w-full h-full bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center text-3xl font-black">
                {initials}
              </div>
            </div>
            <button className="absolute bottom-2 right-2 w-8 h-8 bg-neutral-900 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-black text-neutral-900 leading-tight">{profile.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                {role}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> {profile.status}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4 md:mt-0 w-full md:w-auto">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-600 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100">
              <Mail className="w-4 h-4 text-neutral-400" /> {profile.email}
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-600 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100">
              <MapPin className="w-4 h-4 text-neutral-400" /> {profile.location}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

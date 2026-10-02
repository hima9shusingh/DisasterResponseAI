import React from 'react';
import { User, Phone, MapPin, Mail, ShieldAlert, Edit2 } from 'lucide-react';
import { useCitizen } from '../../context/CitizenContext';

export default function CitizenProfile() {
  const { profile, contacts } = useCitizen();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Profile Header */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative">
          <img src={profile.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-neutral-50" />
          <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full shadow-sm hover:bg-blue-700 transition-colors">
            <Edit2 className="w-3 h-3" />
          </button>
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">{profile.name}</h1>
          <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">ID: {profile.id}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-neutral-600 font-semibold">
            <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100"><Mail className="w-4 h-4 text-neutral-400" /> {profile.email}</div>
            <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100"><Phone className="w-4 h-4 text-neutral-400" /> {profile.phone}</div>
            <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100"><MapPin className="w-4 h-4 text-neutral-400" /> {profile.city}</div>
          </div>
        </div>
        <div>
          <button className="px-4 py-2 bg-neutral-100 text-neutral-700 text-sm font-bold rounded-xl hover:bg-neutral-200 transition-colors">Edit Profile</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
          <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-100 pb-2 mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Full Address</label>
              <p className="text-sm font-semibold text-neutral-800 bg-neutral-50 p-3 rounded-lg border border-neutral-100">{profile.address}</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Medical Conditions</label>
              <p className="text-sm font-semibold text-neutral-500 italic bg-neutral-50 p-3 rounded-lg border border-neutral-100">None specified.</p>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
          <div className="flex justify-between items-center border-b border-neutral-100 pb-2 mb-4">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-red-500" /> Emergency Contacts</h2>
            <button className="text-[10px] font-bold text-blue-600 uppercase hover:underline">Add New</button>
          </div>
          <div className="space-y-3">
            {contacts.map(c => (
              <div key={c.id} className="p-4 rounded-xl border border-neutral-100 bg-neutral-50 flex justify-between items-center group">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-neutral-900">{c.name}</p>
                    {c.isPrimary && <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded uppercase">Primary</span>}
                  </div>
                  <p className="text-xs text-neutral-500 font-semibold">{c.relationship} • {c.phone}</p>
                </div>
                <button className="text-neutral-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

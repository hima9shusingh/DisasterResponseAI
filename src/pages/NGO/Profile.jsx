import React from 'react';
import { useNGO } from '../../context/NGOContext';
import { Phone, Mail, MapPin, Building, ShieldCheck, Edit2, Loader2 } from 'lucide-react';

export default function NGOProfile() {
  const { profile, isInitializing } = useNGO();

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-neutral-500 font-semibold">Loading NGO profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          
          <div className="w-32 h-32 rounded-2xl shadow-lg border-4 border-white bg-blue-600 flex items-center justify-center text-white shrink-0">
            <Building className="w-12 h-12" />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 mb-2">
              <div>
                <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-2 justify-center md:justify-start">
                  {profile.organizationName || profile.name}
                  {profile.verificationStatus === 'verified' && <ShieldCheck className="w-6 h-6 text-green-500" title="Verified NGO" />}
                </h1>
                <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mt-1">{profile.registrationId || profile._id}</p>
              </div>
              <button className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-bold text-xs transition-colors flex items-center gap-2">
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            </div>
            
            <p className="text-sm text-neutral-600 max-w-2xl mt-4 font-semibold">{profile.missionStatement || 'No mission statement provided.'}</p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 mt-6 text-sm font-semibold text-neutral-600">
              <span className="flex items-center gap-1.5"><Building className="w-4 h-4 text-neutral-400" /> POC: {profile.name}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-neutral-400" /> {profile.phone || 'N/A'}</span>
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-neutral-400" /> {profile.email}</span>
            </div>
          </div>

        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-100 pb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" /> Operating Regions
        </h2>
        <div className="flex flex-wrap gap-2">
          {(profile.operatingRegions || []).length > 0 ? profile.operatingRegions.map((region, idx) => (
            <span key={idx} className="px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-lg text-xs font-bold border border-neutral-200">
              {region}
            </span>
          )) : (
            <span className="text-sm text-neutral-500">No operating regions specified.</span>
          )}
        </div>
      </div>

    </div>
  );
}

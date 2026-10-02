import React from 'react';
import { useVolunteer } from '../../context/VolunteerContext';
import { Phone, Mail, MapPin, Calendar, Edit2, ShieldCheck, Activity, Loader2 } from 'lucide-react';
import CertificationCard from '../../components/volunteer/CertificationCard';
import { mockCertifications } from '../../data/mock/volunteerMockData';

export default function VolunteerProfile() {
  const { profile, isInitializing } = useVolunteer();

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-neutral-500 font-semibold">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          
          <img src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'V')}&background=0D8ABC&color=fff`} alt={profile.name} className="w-32 h-32 rounded-2xl object-cover shadow-lg border-4 border-white" />
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 mb-2">
              <div>
                <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">{profile.name}</h1>
                <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">{profile.userId || profile._id}</p>
              </div>
              <button className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-bold text-xs transition-colors flex items-center gap-2">
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 mt-4 text-sm font-semibold text-neutral-600">
              <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-neutral-400" /> {profile.phone || 'N/A'}</span>
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-neutral-400" /> {profile.email}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-neutral-400" /> {profile.location?.address || profile.location?.city || profile.location || 'N/A'}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-neutral-400" /> Joined {new Date(profile.createdAt || profile.joinedDate || Date.now()).getFullYear()}</span>
            </div>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col - Skills */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4 border-b border-neutral-100 pb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" /> Core Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {(profile.skills || []).length > 0 ? profile.skills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">
                  {skill}
                </span>
              )) : (
                <span className="text-sm text-neutral-500">No skills listed</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Col - Certifications */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4 border-b border-neutral-100 pb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500" /> Certifications
            </h2>
            <div className="space-y-4">
              {mockCertifications.map(cert => (
                <CertificationCard key={cert.id} cert={cert} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

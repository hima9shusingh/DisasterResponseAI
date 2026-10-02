import React, { useState, useEffect } from 'react';
import ProfileHeader from '../../components/global/ProfileHeader';
import EditProfileModal from '../../components/global/EditProfileModal';
import { useAuth } from '../../context/AuthContext';
import { Activity, Clock } from 'lucide-react';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const role = user?.role || 'citizen';
  
  // Use real user data, providing safe fallbacks for UI
  const [profile, setProfile] = useState({
    name: user?.name || user?.organizationName || 'User',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || 'Not provided',
    status: user?.isActive ? 'Active' : 'Inactive',
    joined: new Date(user?.createdAt || Date.now()).toLocaleDateString(),
    emergencyContact: user?.emergencyContacts?.[0] || null,
    skills: user?.skills || [],
    recentActivity: [] // Would normally fetch from an activity API
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || user.organizationName || 'User',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || 'Not provided',
        status: user.isActive ? 'Active' : 'Inactive',
        joined: new Date(user.createdAt || Date.now()).toLocaleDateString(),
        emergencyContact: user.emergencyContacts?.[0] || null,
        skills: user.skills || [],
        recentActivity: [] // We don't have this in User model directly
      });
    }
  }, [user]);

  const handleSaveProfile = (updatedData) => {
    // Need to hit a PUT /me API in a real app
    // Then update context
    setProfile(updatedData);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      
      <ProfileHeader profile={profile} role={role} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col - Details */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4 border-b border-neutral-100 pb-2">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Account Created</p>
                <p className="text-sm font-semibold text-neutral-700">{profile.joined}</p>
              </div>
              
              {profile.emergencyContact && (
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Emergency Contact</p>
                  <p className="text-sm font-semibold text-neutral-700">{profile.emergencyContact.name}</p>
                  <p className="text-xs text-neutral-500">{profile.emergencyContact.phone}</p>
                </div>
              )}

              {profile.skills && profile.skills.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Skills & Certifications</p>
                  <div className="flex flex-wrap gap-1">
                    {profile.skills.map(s => <span key={s} className="px-2 py-1 bg-neutral-100 text-neutral-600 text-[10px] font-bold uppercase rounded">{s}</span>)}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsEditing(true)}
              className="w-full mt-6 py-2.5 bg-neutral-900 text-white font-bold text-sm rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Right Col - Activity */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm h-full">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" /> Account Activity
            </h3>
            
            {profile.recentActivity?.length > 0 ? (
              <div className="relative border-l-2 border-neutral-100 ml-3 space-y-8 pb-4">
                {profile.recentActivity.map((activity, idx) => (
                  <div key={idx} className="relative pl-6">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow-sm"></div>
                    <h4 className="text-sm font-bold text-neutral-800 leading-tight">{activity.action}</h4>
                    <p className="text-xs font-medium text-neutral-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" /> {activity.time}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">No recent activity.</p>
            )}
          </div>
        </div>

      </div>

      {isEditing && (
        <EditProfileModal 
          profile={profile} 
          onClose={() => setIsEditing(false)} 
          onSave={handleSaveProfile} 
        />
      )}
    </div>
  );
}

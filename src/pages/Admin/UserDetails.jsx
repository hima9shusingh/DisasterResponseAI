import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { ArrowLeft, User, Mail, MapPin, Activity, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import ErrorState from '../../components/ui/ErrorState';

export default function AdminUserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getUserById(userId);
      if (response.success) {
        setUser({
          id: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role,
          status: response.data.user.isActive ? 'Active' : 'Suspended',
          location: response.data.user.profile?.address || 'N/A',
          lastActive: response.data.user.updatedAt || response.data.user.createdAt,
          joinedDate: response.data.user.createdAt,
          stats: {
            totalReports: 0,
            activeMissions: 0,
            contributions: 0
          }
        });
      } else {
        throw new Error('Failed to load user');
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError('User not found.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const handleUpdateStatus = async (isActive) => {
    if (!isActive && !window.confirm('Suspend user?')) return;
    try {
      await adminService.updateUserStatus(userId, isActive);
      setUser(prev => ({ ...prev, status: isActive ? 'Active' : 'Suspended' }));
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update status');
    }
  };

  const handleRoleChange = async (e) => {
    const newRole = e.target.value;
    if (!window.confirm(`Change user role to ${newRole}?`)) return;
    setIsUpdatingRole(true);
    try {
      await adminService.updateUserRole(userId, newRole);
      setUser(prev => ({ ...prev, role: newRole }));
    } catch (err) {
      console.error('Failed to update role', err);
      alert('Failed to update role');
    } finally {
      setIsUpdatingRole(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-neutral-800">Loading User Details...</h2>
      </div>
    );
  }

  if (error || !user) {
    return <ErrorState message={error || "User not found."} onRetry={fetchUser} />;
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Suspended': return 'bg-red-100 text-red-700';
      case 'Pending Verification': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const availableRoles = ['citizen', 'volunteer', 'ngo', 'government', 'admin'];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      <button onClick={() => navigate('/admin/users')} className="flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-neutral-900 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Users
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-neutral-900">{user.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <select 
                  value={user.role} 
                  onChange={handleRoleChange} 
                  disabled={isUpdatingRole}
                  className="px-2 py-1 rounded bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase tracking-wider border-none focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  {availableRoles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <span className={clsx("px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider", getStatusColor(user.status))}>{user.status}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {user.status === 'Suspended' ? (
              <button onClick={() => handleUpdateStatus(true)} className="flex-1 md:flex-none px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm">Activate User</button>
            ) : (
              <button onClick={() => handleUpdateStatus(false)} className="flex-1 md:flex-none px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-bold transition-colors border border-red-200">Suspend User</button>
            )}
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-neutral-100">
          
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2"><Activity className="w-3.5 h-3.5" /> Account Details</h3>
            <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-xl">
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">User ID</p>
                <p className="font-bold text-neutral-800 break-all">{user.id}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Joined Date</p>
                <p className="font-bold text-neutral-800">{new Date(user.joinedDate).toLocaleDateString()}</p>
              </div>
              <div className="col-span-2 pt-2 border-t border-neutral-200">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Last Active</p>
                <p className="font-bold text-neutral-800">{new Date(user.lastActive).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2"><User className="w-3.5 h-3.5" /> Contact Profile</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm font-semibold text-neutral-700 bg-white p-3 border border-neutral-200 rounded-xl">
                <Mail className="w-4 h-4 text-neutral-400" /> {user.email}
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-neutral-700 bg-white p-3 border border-neutral-200 rounded-xl">
                <MapPin className="w-4 h-4 text-neutral-400" /> {user.location}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import UserTable from '../../components/admin/UserTable';
import { Search, Loader2 } from 'lucide-react';
import ErrorState from '../../components/ui/ErrorState';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debounce search effect
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (roleFilter !== 'All') params.role = roleFilter.toLowerCase();
        
        const response = await adminService.getUsers(params);
        if (response.success) {
          // Map backend data to UI format
          setUsers(response.data.users.map(u => ({
            id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            status: u.isActive ? 'Active' : 'Suspended',
            location: u.profile?.address || 'N/A',
            lastActive: u.updatedAt || u.createdAt,
            joinedDate: u.createdAt
          })));
        } else {
          throw new Error('Failed to fetch users');
        }
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Unable to load users.');
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, roleFilter]);

  const roles = ['All', 'admin', 'government', 'ngo', 'volunteer', 'citizen'];

  const handleSuspend = async (id) => {
    if (window.confirm("Are you sure you want to suspend this user? They will lose platform access immediately.")) {
      try {
        await adminService.updateUserStatus(id, false);
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'Suspended' } : u));
      } catch (err) {
        console.error('Failed to suspend user', err);
        alert('Failed to suspend user');
      }
    }
  };

  const handleActivate = async (id) => {
    try {
      await adminService.updateUserStatus(id, true);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'Active' } : u));
    } catch (err) {
      console.error('Failed to activate user', err);
      alert('Failed to activate user');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">User Management</h1>
        <p className="text-sm text-neutral-500 mt-1 font-semibold">View and manage all registered platform users.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search users by name, email or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          />
        </div>
        <select 
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-sm min-w-[150px] capitalize"
        >
          {roles.map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
        </select>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      ) : isLoading && users.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-neutral-100">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
          <h2 className="text-sm font-bold text-neutral-500">Loading Users...</h2>
        </div>
      ) : (
        <UserTable 
          users={users}
          onSuspend={handleSuspend}
          onActivate={handleActivate}
        />
      )}

    </div>
  );
}

import React from 'react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, MoreVertical, Eye } from 'lucide-react';

export default function UserTable({ users, onSuspend, onActivate }) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Suspended': return 'bg-red-100 text-red-700';
      case 'Pending Verification': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 text-center text-neutral-500 font-semibold text-sm">
        No users found.
      </div>
    );
  }

  return (
    <>
      {/* Mobile View: Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-neutral-900">{user.name}</div>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-0.5">{user.id}</div>
              </div>
              <span className={clsx("px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider", getStatusColor(user.status))}>
                {user.status}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">Role & Email</span>
              <div className="text-sm font-semibold text-neutral-700 truncate">{user.email}</div>
              <span className="px-2 py-1 inline-block mt-1 rounded bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase tracking-wider">{user.role}</span>
            </div>

            <div className="flex justify-between items-end mt-2">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">Last Active</span>
                <span className="text-xs font-semibold text-neutral-500">{new Date(user.lastActive).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-end gap-1.5">
                <button onClick={() => navigate(`/admin/users/${user.id}`)} title="View Details" className="p-2 text-neutral-600 bg-neutral-100 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                {user.status !== 'Suspended' ? (
                  <button onClick={() => onSuspend(user.id)} title="Suspend User" className="p-2 text-neutral-600 bg-neutral-100 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><ShieldAlert className="w-4 h-4" /></button>
                ) : (
                  <button onClick={() => onActivate(user.id)} title="Activate User" className="p-2 text-neutral-600 bg-neutral-100 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"><CheckCircle2 className="w-4 h-4" /></button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="bg-neutral-50 text-neutral-500 text-[10px] uppercase tracking-wider border-b border-neutral-100">
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Last Active</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-neutral-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-neutral-900">{user.name}</div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-0.5">{user.id} • {user.email}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase tracking-wider">{user.role}</span>
                  </td>
                  <td className="p-4 text-xs font-semibold text-neutral-700">{user.location}</td>
                  <td className="p-4">
                    <span className={clsx("px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider", getStatusColor(user.status))}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-semibold text-neutral-500">
                    {new Date(user.lastActive).toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button onClick={() => navigate(`/admin/users/${user.id}`)} title="View Details" className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Eye className="w-4 h-4" /></button>
                      {user.status !== 'Suspended' ? (
                        <button onClick={() => onSuspend(user.id)} title="Suspend User" className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><ShieldAlert className="w-4 h-4" /></button>
                      ) : (
                        <button onClick={() => onActivate(user.id)} title="Activate User" className="p-1.5 text-neutral-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"><CheckCircle2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

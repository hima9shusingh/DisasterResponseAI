import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import RolePermissionTable from '../../components/admin/RolePermissionTable';

export default function AdminRoles() {
  const { roles, updateRolePermission } = useAdmin();
  const [selectedRole, setSelectedRole] = useState('NGO');

  const currentRoleData = roles.find(r => r.role === selectedRole);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Roles & Permissions</h1>
        <p className="text-sm text-neutral-500 mt-1 font-semibold">Configure modular access control across the platform.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {roles.map(r => (
          <button 
            key={r.role}
            onClick={() => setSelectedRole(r.role)}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-colors ${
              selectedRole === r.role 
                ? 'bg-neutral-900 text-white shadow-md' 
                : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            {r.role}
          </button>
        ))}
      </div>

      {currentRoleData && (
        <RolePermissionTable 
          roleData={currentRoleData} 
          onTogglePermission={updateRolePermission} 
        />
      )}

    </div>
  );
}

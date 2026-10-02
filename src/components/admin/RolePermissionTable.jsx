import React from 'react';
import { clsx } from 'clsx';
import { ToggleLeft, ToggleRight } from 'lucide-react';

export default function RolePermissionTable({ roleData, onTogglePermission }) {
  const permCategories = [
    { key: 'incidents', label: 'Incident Management' },
    { key: 'resources', label: 'Resource Allocation' },
    { key: 'camps', label: 'Relief Camps' },
    { key: 'analytics', label: 'Platform Analytics' },
    { key: 'users', label: 'User Management' },
    { key: 'settings', label: 'System Settings' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
      <div className="p-6 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">{roleData.role}</h2>
          <p className="text-xs font-semibold text-neutral-500 mt-1">Configure access levels for all {roleData.role} users.</p>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {permCategories.map(cat => {
            const hasPerm = roleData.permissions[cat.key];
            return (
              <div key={cat.key} className="flex justify-between items-center p-4 rounded-xl border border-neutral-100 hover:bg-neutral-50 transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-neutral-800">{cat.label}</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">Allow users to access and manage {cat.label.toLowerCase()}.</p>
                </div>
                <button 
                  onClick={() => onTogglePermission(roleData.role, cat.key, !hasPerm)}
                  className={clsx("transition-colors", hasPerm ? "text-green-600" : "text-neutral-300")}
                >
                  {hasPerm ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

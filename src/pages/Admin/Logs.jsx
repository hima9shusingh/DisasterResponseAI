import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import ActivityLogTable from '../../components/admin/ActivityLogTable';
import { Search } from 'lucide-react';

export default function AdminLogs() {
  const { logs } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) || log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModule = moduleFilter === 'All' || log.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  const modules = ['All', 'Users', 'Auth', 'Incidents', 'Resources', 'Missions'];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">System Activity Logs</h1>
        <p className="text-sm text-neutral-500 mt-1 font-semibold">Audit trail of all critical platform actions.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search by user or action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          />
        </div>
        <select 
          value={moduleFilter}
          onChange={e => setModuleFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-sm min-w-[150px]"
        >
          {modules.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <ActivityLogTable logs={filteredLogs} />

    </div>
  );
}

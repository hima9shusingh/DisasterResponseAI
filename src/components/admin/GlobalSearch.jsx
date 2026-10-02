import React, { useState } from 'react';
import { Search, Users, Activity, FileText } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useNavigate } from 'react-router-dom';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { users, logs } = useAdmin();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setIsOpen(e.target.value.length > 0);
  };

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())).slice(0, 3);
  const filteredLogs = logs.filter(l => l.description.toLowerCase().includes(query.toLowerCase()) || l.action.toLowerCase().includes(query.toLowerCase())).slice(0, 3);

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="relative w-full max-w-2xl mb-8">
      <div className="relative">
        <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input 
          type="text"
          placeholder="Global Search (Users, NGOs, Logs...)"
          value={query}
          onChange={handleSearch}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden z-50">
          
          {filteredUsers.length > 0 && (
            <div className="p-2 border-b border-neutral-100">
              <h3 className="px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Users & NGOs</h3>
              {filteredUsers.map(u => (
                <button key={u.id} onClick={() => handleNavigate(`/admin/users/${u.id}`)} className="w-full text-left px-3 py-2 hover:bg-neutral-50 rounded-xl transition-colors flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-neutral-800">{u.name}</p>
                    <p className="text-xs font-semibold text-neutral-500">{u.role} • {u.email}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {filteredLogs.length > 0 && (
            <div className="p-2 border-b border-neutral-100">
              <h3 className="px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> Activity Logs</h3>
              {filteredLogs.map(l => (
                <button key={l.id} onClick={() => handleNavigate(`/admin/logs`)} className="w-full text-left px-3 py-2 hover:bg-neutral-50 rounded-xl transition-colors">
                  <p className="text-sm font-bold text-neutral-800">{l.action}</p>
                  <p className="text-xs font-semibold text-neutral-500 truncate">{l.description}</p>
                </button>
              ))}
            </div>
          )}

          {filteredUsers.length === 0 && filteredLogs.length === 0 && (
            <div className="p-6 text-center text-sm font-semibold text-neutral-500">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

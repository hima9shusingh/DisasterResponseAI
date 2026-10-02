import React, { useState } from 'react';
import { BellRing, CheckCircle, Search } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationItem from '../../components/global/NotificationItem';
import { clsx } from 'clsx';

export default function NotificationCenter() {
  const { notifications, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = ['All', 'Unread', 'Emergency', 'System'];

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = 
      filter === 'All' || 
      (filter === 'Unread' && !n.isRead) || 
      (filter === 'Emergency' && n.priority === 'critical') || 
      (filter === 'System' && n.type === 'system');
    
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto pb-12 space-y-6">
      
      <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <BellRing className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Notification Center</h1>
            <p className="text-sm font-semibold text-neutral-500">Stay updated with important activity and emergency information.</p>
          </div>
        </div>
        <button 
          onClick={markAllAsRead}
          className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-sm rounded-xl transition-colors flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" /> Mark All as Read
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-neutral-100 bg-neutral-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {filters.map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  "px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border",
                  filter === f ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search notifications..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="p-4 space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(n => (
              <NotificationItem key={n._id} notification={n} />
            ))
          ) : (
            <div className="py-12 text-center text-neutral-500 font-semibold text-sm">
              No notifications found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

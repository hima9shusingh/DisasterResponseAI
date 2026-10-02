import React, { useState } from 'react';
import { Bell, Check, Trash2, ArrowRight } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const getRoleBasePath = () => {
    const pathParts = location.pathname.split('/');
    return pathParts.length > 1 ? `/${pathParts[1]}` : '/citizen';
  };

  const handleNotificationClick = (n) => {
    markAsRead(n._id);
    setIsOpen(false);
    // Dummy navigation logic based on entity
    if (n.relatedEntity?.startsWith('INC-')) {
      navigate(`${getRoleBasePath()}/incidents/${n.relatedEntity}`);
    } else {
      navigate(`${getRoleBasePath()}/notifications`);
    }
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-neutral-600 hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-neutral-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
              <h3 className="text-sm font-bold text-neutral-900">Notifications</h3>
              <button 
                onClick={markAllAsRead}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {recentNotifications.length > 0 ? (
                <div className="divide-y divide-neutral-100">
                  {recentNotifications.map(n => (
                    <div 
                      key={n._id}
                      className={clsx(
                        "p-4 hover:bg-neutral-50 transition-colors cursor-pointer relative group",
                        !n.isRead ? 'bg-blue-50/30' : 'bg-white'
                      )}
                      onClick={() => handleNotificationClick(n)}
                    >
                      {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>}
                      <div className="flex justify-between items-start mb-1">
                        <span className={clsx(
                          "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                          n.priority?.toLowerCase() === 'critical' ? 'bg-red-100 text-red-700' :
                          n.priority?.toLowerCase() === 'high' ? 'bg-orange-100 text-orange-700' :
                          n.priority?.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-neutral-100 text-neutral-600'
                        )}>
                          {n.type?.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-semibold text-neutral-400">
                          {n.createdAt ? new Date(n.createdAt).toLocaleString() : n.time}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900 mb-1">{n.title}</h4>
                      <p className="text-xs font-medium text-neutral-500 line-clamp-2">{n.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-neutral-500 text-sm font-semibold">
                  No new notifications
                </div>
              )}
            </div>

            <div className="p-2 border-t border-neutral-100 bg-neutral-50">
              <button 
                onClick={() => { setIsOpen(false); navigate(`${getRoleBasePath()}/notifications`); }}
                className="w-full py-2 text-xs font-bold text-neutral-600 hover:text-blue-600 flex items-center justify-center gap-1 transition-colors"
              >
                View all notifications <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  );
}

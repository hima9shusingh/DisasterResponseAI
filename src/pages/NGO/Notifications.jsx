import React from 'react';
import { Bell, Package, CheckCircle2, Tent, Users } from 'lucide-react';
import { useNGO } from '../../context/NGOContext';
import { clsx } from 'clsx';

export default function NGONotifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useNGO();

  const getIcon = (type) => {
    switch(type) {
      case 'Supply': return <Package className="w-5 h-5 text-orange-600" />;
      case 'Camp': return <Tent className="w-5 h-5 text-blue-600" />;
      case 'Volunteer': return <Users className="w-5 h-5 text-green-600" />;
      default: return <Bell className="w-5 h-5 text-neutral-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Notifications</h1>
          <p className="text-sm text-neutral-500 mt-1 font-semibold">You have {unreadCount} unread messages.</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllNotificationsRead} className="px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden divide-y divide-neutral-100">
        {notifications.map((notif) => (
          <div key={notif.id} onClick={() => markNotificationRead(notif.id)} className={clsx(
            "p-5 flex items-start gap-4 transition-colors cursor-pointer hover:bg-neutral-50",
            !notif.read ? "bg-blue-50/30" : ""
          )}>
            <div className={clsx("p-2.5 rounded-xl shrink-0", !notif.read ? "bg-white shadow-sm border border-neutral-100" : "bg-neutral-50")}>
              {getIcon(notif.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2 mb-1">
                <h4 className={clsx("text-sm font-bold truncate", !notif.read ? "text-neutral-900" : "text-neutral-700")}>{notif.title}</h4>
                <span className="text-[10px] font-semibold text-neutral-400 whitespace-nowrap">{notif.time}</span>
              </div>
              <p className={clsx("text-sm line-clamp-2", !notif.read ? "text-neutral-700 font-medium" : "text-neutral-500")}>{notif.message}</p>
            </div>
            {!notif.read && <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0"></div>}
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="p-8 text-center text-neutral-500 font-semibold">No notifications.</div>
        )}
      </div>
    </div>
  );
}

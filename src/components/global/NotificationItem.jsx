import React from 'react';
import { clsx } from 'clsx';
import { Bell, AlertTriangle, Info, MapPin, Target, Package, Shield, Activity, Trash2, Check, RotateCcw } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export default function NotificationItem({ notification, onClick }) {
  const { markAsRead, markAsUnread, deleteNotification } = useNotifications();

  const getIcon = () => {
    switch(notification.type?.toLowerCase()) {
      case 'emergency_alert': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'incident': return <Activity className="w-5 h-5 text-orange-600" />;
      case 'mission': return <Target className="w-5 h-5 text-indigo-600" />;
      case 'resource': return <Package className="w-5 h-5 text-blue-600" />;
      case 'relief_camp': return <MapPin className="w-5 h-5 text-green-600" />;
      case 'system': return <Shield className="w-5 h-5 text-neutral-600" />;
      default: return <Info className="w-5 h-5 text-neutral-600" />;
    }
  };

  const getBadgeColor = () => {
    switch(notification.priority?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  return (
    <div className={clsx(
      "p-4 flex gap-4 transition-all duration-200 group relative rounded-2xl border",
      notification.isRead ? "bg-white border-transparent hover:border-neutral-200 hover:shadow-sm" : "bg-blue-50/50 border-blue-100 shadow-sm"
    )}>
      
      {!notification.isRead && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1/2 bg-blue-500 rounded-r-full"></div>}

      <div className="w-12 h-12 rounded-xl bg-white border border-neutral-100 flex items-center justify-center shrink-0 shadow-sm">
        {getIcon()}
      </div>

      <div className="flex-1 cursor-pointer" onClick={() => onClick && onClick(notification)}>
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-2">
            <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border", getBadgeColor())}>
              {notification.type?.replace('_', ' ')}
            </span>
            <span className="text-[10px] font-semibold text-neutral-400">
              {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : notification.time}
            </span>
          </div>
        </div>
        <h3 className={clsx("text-base mb-1", notification.isRead ? "font-bold text-neutral-700" : "font-black text-neutral-900")}>
          {notification.title}
        </h3>
        <p className="text-sm font-medium text-neutral-500">{notification.message}</p>
        
        {notification.relatedEntity && (
          <div className="mt-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">
              Ref: {notification.relatedEntity}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => notification.isRead ? markAsUnread(notification._id) : markAsRead(notification._id)}
          className="p-2 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
          title={notification.isRead ? "Mark as unread" : "Mark as read"}
        >
          {notification.isRead ? <RotateCcw className="w-4 h-4" /> : <Check className="w-4 h-4" />}
        </button>
        <button 
          onClick={() => deleteNotification(notification._id)}
          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          title="Delete notification"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}

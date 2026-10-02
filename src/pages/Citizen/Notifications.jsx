import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CheckCircle2, ShieldAlert, CloudLightning, Package, Activity } from 'lucide-react';
import { useCitizen } from '../../context/CitizenContext';
import { clsx } from 'clsx';
import { mockEmergencyAlerts } from '../../data/mock/alertMockData';

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications: contextNotifications, markNotificationRead, markAllNotificationsRead } = useCitizen();

  const activeAlerts = mockEmergencyAlerts
    .filter(a => a.status === 'Active')
    .map(a => ({
      id: a.id,
      type: 'Emergency',
      title: a.title,
      message: a.description,
      time: 'Just now',
      read: false
    }));

  const notifications = [...activeAlerts, ...contextNotifications];

  const getIcon = (type) => {
    switch(type) {
      case 'Emergency': return <ShieldAlert className="w-5 h-5 text-red-600" />;
      case 'Response': return <Activity className="w-5 h-5 text-blue-600" />;
      case 'Weather': return <CloudLightning className="w-5 h-5 text-orange-600" />;
      case 'Relief': return <Package className="w-5 h-5 text-purple-600" />;
      default: return <CheckCircle2 className="w-5 h-5 text-neutral-600" />;
    }
  };

  const getBg = (type, read) => {
    if (read) return 'bg-white border-neutral-100 hover:border-neutral-200';
    switch(type) {
      case 'Emergency': return 'bg-red-50 border-red-100';
      case 'Response': return 'bg-blue-50 border-blue-100';
      case 'Weather': return 'bg-orange-50 border-orange-100';
      case 'Relief': return 'bg-purple-50 border-purple-100';
      default: return 'bg-neutral-50 border-neutral-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Notification Center</h1>
          <p className="text-sm text-neutral-500 mt-1">Stay updated with critical emergency alerts and response tracking.</p>
        </div>
        <button 
          onClick={markAllNotificationsRead}
          className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-sm rounded-xl transition-colors flex items-center gap-2"
        >
          <Check className="w-4 h-4" /> Mark All as Read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map(n => (
          <div 
            key={n.id}
            onClick={() => {
              if (!n.read) markNotificationRead(n.id);
              if (n.link) navigate(n.link);
            }}
            className={clsx(
              "p-4 rounded-xl shadow-sm border flex items-start gap-4 transition-colors",
              getBg(n.type, n.read),
              n.link ? "cursor-pointer" : ""
            )}
          >
            <div className={clsx(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
              n.read ? "bg-neutral-100" : "bg-white shadow-sm"
            )}>
              {getIcon(n.type)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <span className={clsx(
                  "text-[10px] font-bold uppercase tracking-wider",
                  n.type === 'Emergency' ? 'text-red-600' :
                  n.type === 'Response' ? 'text-blue-600' :
                  n.type === 'Weather' ? 'text-orange-600' :
                  n.type === 'Relief' ? 'text-purple-600' : 'text-neutral-500'
                )}>{n.type} Alert</span>
                <span className="text-[10px] font-bold text-neutral-400">{n.time}</span>
              </div>
              <h3 className="font-bold text-neutral-900 leading-tight mb-1">{n.title}</h3>
              <p className="text-sm text-neutral-700">{n.message}</p>
            </div>
            {!n.read && (
              <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0 mt-1"></div>
            )}
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
            <p>You have no notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
}

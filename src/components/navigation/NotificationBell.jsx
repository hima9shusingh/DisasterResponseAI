import { Bell } from 'lucide-react';
import { useState } from 'react';

const NotificationBell = () => {
  const [hasNotifications] = useState(true);

  return (
    <button className="relative p-2 rounded-full text-neutral-600 hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1">
      <Bell className="w-5 h-5" />
      {hasNotifications && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emergency rounded-full ring-2 ring-white"></span>
      )}
    </button>
  );
};

export default NotificationBell;

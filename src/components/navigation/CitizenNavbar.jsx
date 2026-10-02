import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import { useCitizen } from '../../context/CitizenContext';
import { useNotifications } from '../../context/NotificationContext';
import { clsx } from 'clsx';

export default function CitizenNavbar() {
  const { unreadCount, notifications, markAsRead } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="h-16 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-6 flex items-center justify-between sticky top-0 z-40">
      <Link to="/citizen" className="text-xl font-bold text-primary flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">
          A
        </div>
        ADRRAS
      </Link>
      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />
        
        {/* Notification Bell & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative p-2 rounded-full text-neutral-600 hover:bg-neutral-100 transition-colors focus:outline-none"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden z-50">
              <div className="p-3 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                <span className="font-bold text-sm text-neutral-800">Notifications</span>
                {unreadCount > 0 && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{unreadCount} New</span>}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.slice(0, 5).map(n => (
                  <div 
                    key={n._id} 
                    onClick={() => {
                      if (!n.isRead) markAsRead(n._id);
                      if (n.link || n.relatedEntity) {
                        navigate(n.link || `/citizen/incidents/${n.relatedEntity}`);
                        setShowDropdown(false);
                      }
                    }}
                    className={clsx(
                      "p-3 border-b border-neutral-50 hover:bg-neutral-50 transition-colors cursor-pointer",
                      !n.isRead ? "bg-blue-50/30" : ""
                    )}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{n.type?.replace('_', ' ')}</span>
                      <span className="text-[10px] text-neutral-400">
                        {n.createdAt ? new Date(n.createdAt).toLocaleString() : n.time}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-neutral-800 leading-tight mb-1">{n.title}</p>
                    <p className="text-xs text-neutral-500 leading-snug line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
              <div 
                className="p-2 border-t border-neutral-100 text-center text-xs font-bold text-blue-600 hover:bg-neutral-50 cursor-pointer transition-colors"
                onClick={() => {
                  navigate('/citizen/notifications');
                  setShowDropdown(false);
                }}
              >
                View All Notifications
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-neutral-200 mx-1 hidden md:block"></div>
        
        {/* Profile Dropdown Placeholder (reusing styling) */}
        <button onClick={() => navigate('/citizen/profile')} className="relative p-2 rounded-full text-neutral-600 hover:bg-neutral-100 transition-colors focus:outline-none hidden md:block">
           <User className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}

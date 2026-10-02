import { User, LogOut, Settings } from 'lucide-react';

const ProfileDropdown = () => {
  return (
    <div className="relative group cursor-pointer">
      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 hover:ring-2 hover:ring-primary/50 transition-all">
        <User className="w-4 h-4" />
      </div>
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-glass border border-neutral-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-3 border-b border-neutral-100">
          <p className="text-sm font-medium text-neutral-900">User Profile</p>
          <p className="text-xs text-neutral-500 truncate">user@example.com</p>
        </div>
        <div className="p-1">
          <button className="w-full text-left px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-primary rounded-md flex items-center gap-2">
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-emergency hover:bg-emergency/5 rounded-md flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;

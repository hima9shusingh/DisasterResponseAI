import { Link } from 'react-router-dom';
import NotificationDropdown from '../global/NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import ThemeToggle from '../ui/ThemeToggle';
import { useSettings } from '../../context/SettingsContext';

const Navbar = () => {
  const { toggleMobileMenu } = useSettings();

  return (
    <nav className="h-16 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-md hover:bg-neutral-100 text-neutral-600 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm">
            A
          </div>
          ADRRAS
        </Link>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />
        <NotificationDropdown />
        <div className="h-6 w-px bg-neutral-200 mx-1 hidden md:block"></div>
        <ProfileDropdown />
      </div>
    </nav>
  );
};

export default Navbar;

import { NavLink } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

const Sidebar = ({ role }) => {
  const isGov = role === 'Government';
  const { isMobileMenuOpen, closeMobileMenu } = useSettings();

  const navClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-primary text-white font-semibold'
        : 'text-neutral-700 hover:bg-primary-light hover:text-white'
    }`;

  const sosClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg font-bold transition-colors ${
      isActive
        ? 'bg-red-700 text-white'
        : 'text-red-600 hover:bg-red-600 hover:text-white'
    }`;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      <aside className={`
        w-64 bg-white border-r border-neutral-200 h-[calc(100vh-4rem)] flex flex-col p-4 overflow-y-auto
        fixed md:sticky top-16 md:top-0 z-50
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4 flex justify-between items-center">
          {role} Menu
          <button className="md:hidden text-neutral-500" onClick={closeMobileMenu}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <nav className="flex flex-col gap-2" onClick={() => { if(window.innerWidth < 768) closeMobileMenu(); }}>
          <NavLink to="/map" className={navClass}>Live Map</NavLink>
          {role === 'Admin' && (
            <>
              <NavLink to="/admin/dashboard" className={navClass}>Dashboard</NavLink>
              <NavLink to="/admin/users" className={navClass}>Users</NavLink>
              <NavLink to="/admin/roles" className={navClass}>Roles & Permissions</NavLink>
              <NavLink to="/admin/incidents" className={navClass}>Incidents</NavLink>
              <NavLink to="/admin/sos" className={sosClass}>SOS Response</NavLink>
              <NavLink to="/admin/ngos" className={navClass}>NGOs</NavLink>
              <NavLink to="/admin/volunteers" className={navClass}>Volunteers</NavLink>
              <NavLink to="/admin/logs" className={navClass}>Activity Logs</NavLink>
              <NavLink to="/admin/analytics" className={navClass}>Analytics</NavLink>
              <NavLink to="/admin/notifications" className={navClass}>Notifications</NavLink>
              <NavLink to="/admin/settings" className={navClass}>Settings</NavLink>
            </>
          )}
          {role === 'NGO' && (
            <>
              <NavLink to="/ngo/dashboard" className={navClass}>Dashboard</NavLink>
              <NavLink to="/ngo/inventory" className={navClass}>Inventory</NavLink>
              <NavLink to="/ngo/requests" className={navClass}>Supply Requests</NavLink>
              <NavLink to="/ngo/camps" className={navClass}>Relief Camps</NavLink>
              <NavLink to="/ngo/donations" className={navClass}>Donations</NavLink>
              <NavLink to="/ngo/volunteers" className={navClass}>Volunteers</NavLink>
              <NavLink to="/ngo/distribution" className={navClass}>Distribution</NavLink>
              <NavLink to="/ngo/analytics" className={navClass}>Analytics</NavLink>
              <NavLink to="/ngo/notifications" className={navClass}>Notifications</NavLink>
              <NavLink to="/ngo/profile" className={navClass}>Profile</NavLink>
              <NavLink to="/ngo/settings" className={navClass}>Settings</NavLink>
            </>
          )}
          {isGov && (
            <>
              <NavLink to="/government/dashboard" className={navClass}>Dashboard</NavLink>
              <NavLink to="/government/incidents" className={navClass}>Incidents</NavLink>
              <NavLink to="/government/resources" className={navClass}>Resources</NavLink>
              <NavLink to="/government/relief-camps" className={navClass}>Relief Camps</NavLink>
              <NavLink to="/government/weather" className={navClass}>Weather & Risk</NavLink>
              <NavLink to="/government/ai-assessment" className={navClass}>AI Assessment</NavLink>
              <NavLink to="/government/analytics" className={navClass}>Analytics</NavLink>
              <NavLink to="/government/reports" className={navClass}>Reports</NavLink>
              <NavLink to="/government/alerts" className={navClass}>Alert Center</NavLink>
              <NavLink to="/government/settings" className={navClass}>Settings</NavLink>
            </>
          )}
          {role === 'Citizen' && (
            <>
              <NavLink to="/citizen/dashboard" className={navClass}>Dashboard</NavLink>
              <NavLink to="/citizen/reports" className={navClass}>My Reports</NavLink>
              <NavLink to="/citizen/help" className={navClass}>Nearby Help</NavLink>
              <NavLink to="/citizen/emergency-guide" className={navClass}>Emergency Guide</NavLink>
              <NavLink to="/citizen/sos" className={sosClass}>SOS / Emergency</NavLink>
              <NavLink to="/citizen/notifications" className={navClass}>Notifications</NavLink>
              <NavLink to="/citizen/profile" className={navClass}>Profile</NavLink>
              <NavLink to="/citizen/settings" className={navClass}>Settings</NavLink>
            </>
          )}
          {role === 'Volunteer' && (
            <>
              <NavLink to="/volunteer/dashboard" className={navClass}>Dashboard</NavLink>
              <NavLink to="/volunteer/missions" className={navClass}>Find Missions</NavLink>
              <NavLink to="/volunteer/history" className={navClass}>Mission History</NavLink>
              <NavLink to="/volunteer/notifications" className={navClass}>Notifications</NavLink>
              <NavLink to="/volunteer/profile" className={navClass}>Profile</NavLink>
              <NavLink to="/volunteer/settings" className={navClass}>Settings</NavLink>
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

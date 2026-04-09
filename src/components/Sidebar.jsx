import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Truck, 
  ClipboardList, 
  LogOut,
  ShieldAlert
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/report', name: 'Report Incident', icon: <AlertTriangle size={20} /> },
    { path: '/resources', name: 'Resources', icon: <Truck size={20} /> },
    { path: '/allocations', name: 'Allocations', icon: <ClipboardList size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <ShieldAlert size={32} color="var(--primary)" />
        <div className="brand">
          <h2>ADR-RAS</h2>
          <span>Disaster Response</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/login" className="nav-link logout">
          <LogOut size={20} />
          <span>Sign Out</span>
        </NavLink>
      </div>

      <style jsx>{`
        .sidebar {
          width: var(--sidebar-width);
          height: 100vh;
          background: var(--bg-sidebar);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
        }

        .sidebar-header {
          padding: 2rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .brand h2 {
          font-size: 1.25rem;
          letter-spacing: 0.05em;
        }

        .brand span {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .sidebar-nav {
          flex: 1;
          padding: 1rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1rem;
          border-radius: 8px;
          color: var(--text-muted);
          transition: all 0.2s ease;
        }

        .nav-link:hover {
          background: rgba(59, 130, 246, 0.1);
          color: var(--text-main);
        }

        .nav-link.active {
          background: var(--primary);
          color: white;
        }

        .sidebar-footer {
          padding: 1.5rem 0.75rem;
          border-top: 1px solid var(--border);
        }

        .logout:hover {
          color: var(--danger);
          background: rgba(239, 68, 68, 0.1);
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100vw;
            height: 70px;
            top: auto;
            bottom: 0;
            flex-direction: row;
            border-right: none;
            border-top: 1px solid var(--border);
            justify-content: space-between;
          }

          .sidebar-header {
            display: none;
          }

          .sidebar-nav {
            flex-direction: row;
            justify-content: space-around;
            padding: 0;
            align-items: center;
          }

          .nav-link {
            flex-direction: column;
            gap: 0.25rem;
            padding: 0.5rem;
            border-radius: 0;
            font-size: 0.65rem;
            justify-content: center;
          }
          
          .nav-link.active {
            background: transparent;
            color: var(--primary);
          }

          .sidebar-footer {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;

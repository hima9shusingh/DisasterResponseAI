import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { DisasterProvider, useDisaster } from './context/DisasterContext';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import IncidentReport from './pages/IncidentReport';
import ResourceManager from './pages/ResourceManager';
import AllocationDashboard from './pages/AllocationDashboard';

const ToastContainer = () => {
  const { systemToasts } = useDisaster();

  if (!systemToasts || systemToasts.length === 0) return null;

  return (
    <div className="toast-container">
      {systemToasts.map(toast => {
        let icon = <Info size={18} />;
        if (toast.type === 'success') icon = <CheckCircle size={18} />;
        if (toast.type === 'error' || toast.type === 'warning') icon = <AlertTriangle size={18} />;

        return (
          <div key={toast.id} className={`toast toast-${toast.type} fade-in`}>
            {icon}
            <span>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};

const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="app-container">
      {!isLoginPage && <Sidebar />}
      <main className={`main-content ${isLoginPage ? 'full-width' : ''}`}>
        {children}
      </main>
      {!isLoginPage && <ToastContainer />}

      <style jsx>{`
        .app-container {
          display: flex;
          min-height: 100vh;
        }
        .main-content {
          flex: 1;
          margin-left: var(--sidebar-width);
          padding: 2rem;
          min-height: 100vh;
          transition: margin-left 0.3s ease;
        }
        .main-content.full-width {
          margin-left: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

function App() {
  return (
    <DisasterProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report" element={<IncidentReport />} />
            <Route path="/resources" element={<ResourceManager />} />
            <Route path="/allocations" element={<AllocationDashboard />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Layout>
      </Router>
    </DisasterProvider>
  );
}

export default App;

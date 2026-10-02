import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Sidebar from '../components/navigation/Sidebar';
import { NGOProvider } from '../context/NGOContext';
import EmergencyAlertBanner from '../components/ui/EmergencyAlertBanner';
import { useNotifications } from '../context/NotificationContext';

const NGOLayoutInner = () => {
  const { activeEmergencyAlert } = useNotifications();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 pb-20 md:pb-0">
      <Navbar />
      <EmergencyAlertBanner alert={activeEmergencyAlert} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar role="NGO" />
        <main className="flex-1 overflow-auto p-4 md:p-6 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const NGOLayout = () => {
  return (
    <NGOProvider>
      <NGOLayoutInner />
    </NGOProvider>
  );
};

export default NGOLayout;

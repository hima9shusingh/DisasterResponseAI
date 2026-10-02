import { Outlet } from 'react-router-dom';
import CitizenNavbar from '../components/navigation/CitizenNavbar';
import Sidebar from '../components/navigation/Sidebar';
import EmergencyActionBar from '../components/navigation/EmergencyActionBar';
import { CitizenProvider } from '../context/CitizenContext';
import EmergencyAlertBanner from '../components/ui/EmergencyAlertBanner';
import { useNotifications } from '../context/NotificationContext';

const CitizenLayout = () => {
  const { activeEmergencyAlert } = useNotifications();

  return (
    <CitizenProvider>
      <div className="min-h-screen flex flex-col bg-neutral-100 pb-20 md:pb-0">
        <CitizenNavbar />
        <EmergencyAlertBanner alert={activeEmergencyAlert} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar role="Citizen" />
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
        <EmergencyActionBar />
      </div>
    </CitizenProvider>
  );
};

export default CitizenLayout;

import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/navigation/PublicNavbar';
import Footer from '../components/navigation/Footer';
import EmergencyAlertBanner from '../components/ui/EmergencyAlertBanner';
import { useNotifications } from '../context/NotificationContext';

const PublicLayout = () => {
  const { activeEmergencyAlert } = useNotifications();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 scroll-smooth">
      <PublicNavbar />
      <EmergencyAlertBanner alert={activeEmergencyAlert} />
      <main className="flex-1 w-full overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;

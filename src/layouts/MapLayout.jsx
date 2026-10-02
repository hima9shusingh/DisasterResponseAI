import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/navigation/PublicNavbar';

const MapLayout = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-neutral-100 overflow-hidden">
      <PublicNavbar />
      <main className="flex-1 w-full relative z-0">
        <Outlet />
      </main>
    </div>
  );
};

export default MapLayout;

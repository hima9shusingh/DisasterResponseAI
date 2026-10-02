import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark to-primary">
      <div className="glass-panel p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">ADRRAS</h1>
          <p className="text-white/80">Disaster Management Portal</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;

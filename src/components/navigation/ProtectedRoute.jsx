import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900 flex-col">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
        <p className="text-slate-400 font-medium">Verifying Session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected.
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role.toLowerCase())) {
    // Role not allowed to access this route
    // Redirect to their default dashboard
    const roleMap = {
      'citizen': '/citizen/dashboard',
      'volunteer': '/volunteer/dashboard',
      'ngo': '/ngo/dashboard',
      'government': '/government/dashboard',
      'admin': '/admin/dashboard'
    };
    
    return <Navigate to={roleMap[user.role.toLowerCase()] || '/auth/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;

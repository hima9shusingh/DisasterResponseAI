import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ToastProvider } from './context/ToastContext';
import { SettingsProvider } from './context/SettingsContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ToastProvider>
          <SettingsProvider>
            <NotificationProvider>
              <RouterProvider router={router} />
            </NotificationProvider>
          </SettingsProvider>
        </ToastProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;

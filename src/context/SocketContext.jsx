import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { socketService } from '../services/socketService';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, isInitializing } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Wait until auth is resolved before trying to connect
    if (isInitializing) return;

    if (isAuthenticated) {
      const newSocket = socketService.connectSocket();
      if (newSocket) {
        setSocket(newSocket);

        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);

        newSocket.on('connect', onConnect);
        newSocket.on('disconnect', onDisconnect);

        // Handle the case where it might already be connected
        if (newSocket.connected) {
          setIsConnected(true);
        }

        return () => {
          newSocket.off('connect', onConnect);
          newSocket.off('disconnect', onDisconnect);
          // Note: we don't disconnect the socket entirely here to avoid 
          // thrashing on every re-render of child components, 
          // disconnectSocket() will be handled when isAuthenticated becomes false.
        };
      }
    } else {
      socketService.disconnectSocket();
      setSocket(null);
      setIsConnected(false);
    }
  }, [isAuthenticated, isInitializing]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

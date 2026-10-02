import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Mock implementation for demo
  const addToast = (title, message, type = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    
    // Auto remove after 3s
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}
      
      {/* Global Toast Container */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className={`p-4 rounded-xl shadow-lg border bg-white flex flex-col gap-1 min-w-[300px] animate-in slide-in-from-right-4 fade-in duration-300
            ${toast.type === 'error' ? 'border-red-200 shadow-red-500/10' : 
              toast.type === 'success' ? 'border-green-200 shadow-green-500/10' : 
              toast.type === 'warning' ? 'border-yellow-200 shadow-yellow-500/10' : 'border-blue-200 shadow-blue-500/10'}`}
          >
            <h4 className="text-sm font-bold text-neutral-900">{toast.title}</h4>
            <p className="text-xs font-semibold text-neutral-500">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

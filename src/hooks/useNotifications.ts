import { useState, useCallback } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning';
  message: string;
  duration?: number;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((
    type: 'success' | 'error' | 'warning',
    message: string,
    duration: number = 3000
  ) => {
    const id = Date.now().toString();
    const notification: Notification = { id, type, message, duration };
    
    // Prevent duplicate notifications
    setNotifications(prev => {
      const exists = prev.some(n => n.message === message && n.type === type);
      if (exists) return prev;
      return [...prev, notification];
    });
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    addNotification('success', message, duration);
  }, [addNotification]);

  const error = useCallback((message: string, duration?: number) => {
    addNotification('error', message, duration);
  }, [addNotification]);

  const warning = useCallback((message: string, duration?: number) => {
    addNotification('warning', message, duration);
  }, [addNotification]);

  return {
    notifications,
    removeNotification,
    success,
    error,
    warning,
  };
};
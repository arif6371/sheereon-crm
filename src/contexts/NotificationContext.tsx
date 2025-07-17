import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'lead_assigned' | 'payment_pending' | 'project_update';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  userId?: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  unreadCount: number;
  getNotificationsByType: (type: string) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'info',
      title: 'Welcome to Seereon CRM',
      message: 'Your CRM system is ready to use',
      timestamp: new Date(),
      read: false,
      priority: 'medium'
    },
    {
      id: '2',
      type: 'lead_assigned',
      title: 'New Lead Assigned',
      message: 'You have been assigned a new lead: ABC Technologies',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      priority: 'high',
      actionUrl: '/presales'
    },
    {
      id: '3',
      type: 'payment_pending',
      title: 'Payment Reminder',
      message: 'Invoice INV-001 payment is due in 2 days',
      timestamp: new Date(Date.now() - 7200000),
      read: false,
      priority: 'high',
      actionUrl: '/accounts'
    },
    {
      id: '4',
      type: 'project_update',
      title: 'Project Milestone',
      message: 'E-commerce Platform project reached 75% completion',
      timestamp: new Date(Date.now() - 10800000),
      read: false,
      priority: 'medium',
      actionUrl: '/projects'
    }
  ]);

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new notifications for demo
      if (Math.random() > 0.95) {
        const mockNotifications = [
          {
            type: 'lead_assigned' as const,
            title: 'New Lead Assignment',
            message: 'A new lead has been assigned to you',
            priority: 'high' as const
          },
          {
            type: 'project_update' as const,
            title: 'Project Update',
            message: 'New update posted on your project',
            priority: 'medium' as const
          },
          {
            type: 'info' as const,
            title: 'System Update',
            message: 'System maintenance scheduled for tonight',
            priority: 'low' as const
          }
        ];
        
        const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
        addNotification(randomNotification);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getNotificationsByType = (type: string) => {
    return notifications.filter(n => n.type === type);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    unreadCount,
    getNotificationsByType
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
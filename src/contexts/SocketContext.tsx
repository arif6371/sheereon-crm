import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: string[];
  emit: (event: string, data?: any) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { user } = useAuth();
  const { addNotification } = useNotification();

  useEffect(() => {
    // Temporarily disable socket connection until backend is ready
    if (false && user) {
      const token = localStorage.getItem('token');
      const newSocket = io(SOCKET_URL, {
        auth: {
          token: token
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.log('Socket connection disabled - backend not ready');
        setIsConnected(false);
      });

      // Handle real-time notifications
      newSocket.on('new_notice', (data) => {
        addNotification(data.notification);
      });

      newSocket.on('new_event', (data) => {
        addNotification(data.notification);
      });

      newSocket.on('project_created', (data) => {
        addNotification(data.notification);
      });

      // Handle existing notification events
      newSocket.on('notification', (notification) => {
        addNotification({
          type: notification.type,
          title: notification.title,
          message: notification.message,
          priority: notification.priority || 'medium',
          actionUrl: notification.actionUrl
        });
      });

      newSocket.on('system_notification', (notification) => {
        addNotification({
          type: notification.type,
          title: notification.title,
          message: notification.message,
          priority: notification.priority || 'medium',
          actionUrl: notification.actionUrl
        });
      });

      newSocket.on('online_users', (users) => {
        setOnlineUsers(users);
      });

      newSocket.on('user_status_changed', ({ userId, status }) => {
        // Handle user status changes
        console.log(`User ${userId} is now ${status}`);
      });

      newSocket.on('lead_updated', (data) => {
        // Handle lead updates in real-time
        console.log('Lead updated:', data);
      });

      newSocket.on('project_updated', (data) => {
        // Handle project updates in real-time
        console.log('Project updated:', data);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user, addNotification]);

  const emit = (event: string, data?: any) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  };

  const value = {
    socket,
    isConnected,
    onlineUsers,
    emit
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
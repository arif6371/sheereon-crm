import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: string[];
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
    if (user) {
      const newSocket = io('http://localhost:5001', {
        auth: {
          userId: user.id
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
        newSocket.emit('join_room', user.id);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      newSocket.on('notification', (notification) => {
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

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user, addNotification]);

  const value = {
    socket,
    isConnected,
    onlineUsers
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
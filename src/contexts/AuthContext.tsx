import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'Admin' | 'HR' | 'PCF' | 'SALES' | 'DEV' | 'DM' | 'Accounts';

export interface User {
  id: string;
  userId: string; // Format: AK-25-001
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  joinDate?: string;
  status: 'pending' | 'approved' | 'active' | 'inactive';
  isEmailVerified: boolean;
  phone?: string;
  address?: string;
  state?: string;
  organization?: string;
  onlineStatus: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  isLoading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Generate User ID in format: initials-year-serial
  const generateUserId = (name: string): string => {
    const initials = name.split(' ').map(n => n.charAt(0).toUpperCase()).join('');
    const year = new Date().getFullYear().toString().slice(-2);
    const serial = Math.floor(Math.random() * 999) + 1;
    return `${initials}-${year}-${serial.toString().padStart(3, '0')}`;
  };

  // Mock user data for demonstration
  const mockUsers: Record<string, User> = {
    'admin@seereon.com': {
      id: '1',
      userId: 'AD-25-001',
      name: 'Admin User',
      email: 'admin@seereon.com',
      role: 'Admin',
      department: 'Management',
      joinDate: '2020-01-01',
      status: 'active',
      isEmailVerified: true,
      onlineStatus: 'online'
    },
    'hr@seereon.com': {
      id: '2',
      userId: 'HR-25-002',
      name: 'HR Manager',
      email: 'hr@seereon.com',
      role: 'HR',
      department: 'Human Resources',
      joinDate: '2021-03-15',
      status: 'active',
      isEmailVerified: true,
      onlineStatus: 'online'
    },
    'pcf@seereon.com': {
      id: '3',
      userId: 'PCF-25-003',
      name: 'Pre-Sales Coordinator',
      email: 'pcf@seereon.com',
      role: 'PCF',
      department: 'Pre-Sales',
      joinDate: '2022-01-10',
      status: 'active',
      isEmailVerified: true,
      onlineStatus: 'online'
    },
    'sales@seereon.com': {
      id: '4',
      userId: 'SL-25-004',
      name: 'Sales Executive',
      email: 'sales@seereon.com',
      role: 'SALES',
      department: 'Sales',
      joinDate: '2022-01-10',
      status: 'active',
      isEmailVerified: true,
      onlineStatus: 'online'
    },
    'dev@seereon.com': {
      id: '5',
      userId: 'DV-25-005',
      name: 'Developer',
      email: 'dev@seereon.com',
      role: 'DEV',
      department: 'Development',
      joinDate: '2023-05-20',
      status: 'active',
      isEmailVerified: true,
      onlineStatus: 'online'
    },
    'dm@seereon.com': {
      id: '6',
      userId: 'DM-25-006',
      name: 'Development Manager',
      email: 'dm@seereon.com',
      role: 'DM',
      department: 'Development',
      joinDate: '2021-08-15',
      status: 'active',
      isEmailVerified: true,
      onlineStatus: 'online'
    },
    'accounts@seereon.com': {
      id: '7',
      userId: 'AC-25-007',
      name: 'Accounts Manager',
      email: 'accounts@seereon.com',
      role: 'Accounts',
      department: 'Finance',
      joinDate: '2022-03-20',
      status: 'active',
      isEmailVerified: true,
      onlineStatus: 'online'
    }
  };

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('seereon_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.status === 'active' && userData.isEmailVerified) {
        setUser(userData);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers[email];
    if (foundUser && password === 'password123') {
      if (!foundUser.isEmailVerified) {
        setIsLoading(false);
        return { success: false, message: 'Please verify your email before logging in' };
      }
      
      if (foundUser.status === 'pending') {
        setIsLoading(false);
        return { success: false, message: 'Your account is pending admin approval' };
      }
      
      if (foundUser.status === 'inactive') {
        setIsLoading(false);
        return { success: false, message: 'Your account has been deactivated' };
      }
      
      const updatedUser = { ...foundUser, onlineStatus: 'online' as const };
      setUser(updatedUser);
      localStorage.setItem('seereon_user', JSON.stringify(updatedUser));
      setIsLoading(false);
      return { success: true, message: 'Login successful' };
    }
    
    setIsLoading(false);
    return { success: false, message: 'Invalid email or password' };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    // Simulate Google OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock Google user data
    const googleUser = {
      id: '8',
      userId: 'GU-25-008',
      name: 'Google User',
      email: 'google.user@gmail.com',
      role: 'SALES' as UserRole,
      department: 'Sales',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'pending' as const,
      isEmailVerified: true,
      onlineStatus: 'online' as const
    };
    
    setIsLoading(false);
    return { success: false, message: 'Google account registered. Awaiting admin approval.' };
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userId = generateUserId(userData.name);
    
    // Mock registration success
    setIsLoading(false);
    return { 
      success: true, 
      message: `Registration successful! User ID: ${userId}. Please check your email for verification.` 
    };
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    // Simulate email verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('seereon_user', JSON.stringify(updatedUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('seereon_user');
  };

  const value = {
    user,
    login,
    loginWithGoogle,
    register,
    logout,
    verifyEmail,
    updateProfile,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
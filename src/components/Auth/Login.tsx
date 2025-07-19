import React, { useState } from 'react';
import { Building2, Mail, Lock, Eye, EyeOff, Chrome, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import RegisterForm from './RegisterForm';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState('');
  const { login, loginWithGoogle, isLoading } = useAuth();
  const { addNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
    } else {
      addNotification({
        type: 'success',
        title: 'Login Successful',
        message: 'Welcome back to Seereon CRM',
        priority: 'medium'
      });
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    const result = await loginWithGoogle();
    if (!result.success) {
      setError(result.message);
    } else {
      addNotification({
        type: 'success',
        title: 'Google Login Successful',
        message: 'Welcome to Seereon CRM',
        priority: 'medium'
      });
    }
  };

  const demoAccounts = [
    { email: 'admin@seereon.com', role: 'Admin', userId: 'AD-25-001' },
    { email: 'hr@seereon.com', role: 'HR', userId: 'HR-25-002' },
    { email: 'pcf@seereon.com', role: 'PCF', userId: 'PCF-25-003' },
    { email: 'sales@seereon.com', role: 'SALES', userId: 'SL-25-004' },
    { email: 'dev@seereon.com', role: 'DEV', userId: 'DV-25-005' },
    { email: 'dm@seereon.com', role: 'DM', userId: 'DM-25-006' },
    { email: 'accounts@seereon.com', role: 'Accounts', userId: 'AC-25-007' }
  ];

  if (showRegister) {
    return <RegisterForm onBack={() => setShowRegister(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Seereon CRM</h2>
          <p className="text-gray-600 mt-2">Consulting & IT Services</p>
          <p className="text-sm text-gray-500 mt-1">Enhanced Multi-Role Access System</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <Chrome className="h-4 w-4" />
              <span>Sign in with Google</span>
            </button>

            <button
              type="button"
              onClick={() => setShowRegister(true)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>Create New Account</span>
            </button>
          </form>

          <div className="mt-6 border-t pt-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Demo Accounts:</h3>
            <div className="grid grid-cols-1 gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => {
                    setEmail(account.email);
                    setPassword('password123');
                  }}
                  className="text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{account.role}</div>
                      <div className="text-gray-600">{account.email}</div>
                    </div>
                    <div className="text-xs text-blue-600 font-mono">{account.userId}</div>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Password: password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
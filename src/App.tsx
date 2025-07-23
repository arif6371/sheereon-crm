import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SocketProvider } from './contexts/SocketContext';
import Login from './components/Auth/Login';
import EmailVerification from './components/Auth/EmailVerification';
import Dashboard from './components/Dashboard/Dashboard';
import Layout from './components/Layout/Layout';
import PreSales from './components/PreSales/PreSales';
import SalesManagement from './components/Sales/SalesManagement';
import ProjectManagement from './components/Projects/ProjectManagement';
import HRMS from './components/HRMS/HRMS';
import Accounts from './components/Accounts/Accounts';
import Profile from './components/Profile/Profile';
import NoticeBoard from './components/Shared/NoticeBoard';
import Calendar from './components/Shared/Calendar';
import UserApproval from './components/Admin/UserApproval';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email/:token" element={<EmailVerification />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/presales" element={
          <ProtectedRoute allowedRoles={['Admin', 'PCF']}>
            <PreSales />
          </ProtectedRoute>
        } />
        <Route path="/sales" element={
          <ProtectedRoute allowedRoles={['Admin', 'SALES']}>
            <SalesManagement />
          </ProtectedRoute>
        } />
        <Route path="/projects" element={
          <ProtectedRoute allowedRoles={['Admin', 'DEV', 'DM']}>
            <ProjectManagement />
          </ProtectedRoute>
        } />
        <Route path="/hrms" element={
          <ProtectedRoute allowedRoles={['Admin', 'HR']}>
            <HRMS />
          </ProtectedRoute>
        } />
        <Route path="/accounts" element={
          <ProtectedRoute allowedRoles={['Admin', 'Accounts']}>
            <Accounts />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <UserApproval />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['Admin', 'HR']}>
            <UserApproval />
          </ProtectedRoute>
        } />
        <Route path="/notices" element={<NoticeBoard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <SocketProvider>
          <Router>
            <div className="App">
              <AppContent />
            </div>
          </Router>
        </SocketProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import HRDashboard from './HRDashboard';
import BDEDashboard from './BDEDashboard';
import DevDashboard from './DevDashboard';
import AccountsDashboard from './AccountsDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'Admin':
        return <AdminDashboard />;
      case 'HR':
        return <HRDashboard />;
      case 'BDE':
      case 'DM':
        return <BDEDashboard />;
      case 'DEV':
      case 'PCF':
        return <DevDashboard />;
      case 'Accounts':
        return <AccountsDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {user?.role} Dashboard
        </h2>
        <p className="text-gray-600">
          Overview and quick actions for your role
        </p>
      </div>
      
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
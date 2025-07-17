import React from 'react';
import { Target, TrendingUp, Users, DollarSign } from 'lucide-react';
import StatsCard from './StatsCard';

const BDEDashboard: React.FC = () => {
  const stats = [
    {
      name: 'Active Leads',
      value: '42',
      change: '+8%',
      changeType: 'positive' as const,
      icon: Target
    },
    {
      name: 'Deals Closed',
      value: '12',
      change: '+15%',
      changeType: 'positive' as const,
      icon: TrendingUp
    },
    {
      name: 'Pipeline Value',
      value: '$1.2M',
      change: '+22%',
      changeType: 'positive' as const,
      icon: DollarSign
    },
    {
      name: 'New Clients',
      value: '8',
      change: '+33%',
      changeType: 'positive' as const,
      icon: Users
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatsCard key={stat.name} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Pipeline</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Prospecting</span>
              <span className="text-sm font-medium text-blue-600">15 leads</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Qualification</span>
              <span className="text-sm font-medium text-yellow-600">12 leads</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Proposal</span>
              <span className="text-sm font-medium text-orange-600">8 leads</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Negotiation</span>
              <span className="text-sm font-medium text-green-600">7 leads</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Deal closed with ABC Corp</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">New lead added</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Follow-up scheduled</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BDEDashboard;
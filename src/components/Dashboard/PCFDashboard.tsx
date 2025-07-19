import React from 'react';
import { Target, TrendingUp, Users, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import StatsCard from './StatsCard';

const PCFDashboard: React.FC = () => {
  const stats = [
    {
      name: 'Total Leads Created',
      value: '156',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Target
    },
    {
      name: 'Pending Approval',
      value: '8',
      change: '+3',
      changeType: 'negative' as const,
      icon: Clock
    },
    {
      name: 'Approved Leads',
      value: '142',
      change: '+15%',
      changeType: 'positive' as const,
      icon: CheckCircle
    },
    {
      name: 'Duplicate Detected',
      value: '6',
      change: '-2',
      changeType: 'positive' as const,
      icon: AlertTriangle
    }
  ];

  const recentLeads = [
    { company: 'TechCorp Solutions', status: 'pending', value: '$75,000', created: '2 hours ago' },
    { company: 'HealthPlus Medical', status: 'approved', value: '$120,000', created: '4 hours ago' },
    { company: 'FinanceFlow Inc', status: 'duplicate', value: '$45,000', created: '6 hours ago' },
    { company: 'DataDrive Systems', status: 'approved', value: '$85,000', created: '1 day ago' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'duplicate': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatsCard key={stat.name} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Lead Activity</h3>
          <div className="space-y-3">
            {recentLeads.map((lead, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{lead.company}</p>
                  <p className="text-xs text-gray-500">{lead.created}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{lead.value}</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Sources</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Website</span>
              <span className="text-sm font-medium text-blue-600">45 leads</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Referral</span>
              <span className="text-sm font-medium text-green-600">32 leads</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">LinkedIn</span>
              <span className="text-sm font-medium text-purple-600">28 leads</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Email Campaign</span>
              <span className="text-sm font-medium text-orange-600">18 leads</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cold Calling</span>
              <span className="text-sm font-medium text-red-600">12 leads</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
            <Target className="h-6 w-6 text-blue-600 mb-2" />
            <div className="text-sm font-medium text-gray-900">Create New Lead</div>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
            <Users className="h-6 w-6 text-green-600 mb-2" />
            <div className="text-sm font-medium text-gray-900">View All Leads</div>
          </button>
          <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-left transition-colors">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mb-2" />
            <div className="text-sm font-medium text-gray-900">Check Duplicates</div>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
            <TrendingUp className="h-6 w-6 text-purple-600 mb-2" />
            <div className="text-sm font-medium text-gray-900">Lead Analytics</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PCFDashboard;
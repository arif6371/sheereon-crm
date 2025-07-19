import React from 'react';
import { Target, TrendingUp, Users, DollarSign, Clock, CheckCircle } from 'lucide-react';
import StatsCard from './StatsCard';

const SalesDashboard: React.FC = () => {
  const stats = [
    {
      name: 'Assigned Leads',
      value: '24',
      change: '+8%',
      changeType: 'positive' as const,
      icon: Target
    },
    {
      name: 'Converted to Paid',
      value: '8',
      change: '+15%',
      changeType: 'positive' as const,
      icon: CheckCircle
    },
    {
      name: 'Pipeline Value',
      value: '$1.2M',
      change: '+22%',
      changeType: 'positive' as const,
      icon: DollarSign
    },
    {
      name: 'Follow-ups Due',
      value: '6',
      change: '-2',
      changeType: 'positive' as const,
      icon: Clock
    }
  ];

  const assignedLeads = [
    { company: 'ABC Technologies', status: 'qualified', value: '$45,000', lastContact: '2 days ago', priority: 'high' },
    { company: 'XYZ Solutions', status: 'proposal', value: '$75,000', lastContact: '1 day ago', priority: 'high' },
    { company: 'Tech Innovators', status: 'negotiation', value: '$32,000', lastContact: '3 hours ago', priority: 'medium' },
    { company: 'Digital Dynamics', status: 'contacted', value: '$58,000', lastContact: '5 hours ago', priority: 'medium' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-blue-100 text-blue-800';
      case 'negotiation': return 'bg-purple-100 text-purple-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Leads</h3>
          <div className="space-y-3">
            {assignedLeads.map((lead, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{lead.company}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                    <span className={`text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                      {lead.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Last contact: {lead.lastContact}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{lead.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Pipeline</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Contacted</span>
              <span className="text-sm font-medium text-blue-600">8 leads</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Qualified</span>
              <span className="text-sm font-medium text-green-600">6 leads</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Proposal Sent</span>
              <span className="text-sm font-medium text-purple-600">4 leads</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Negotiation</span>
              <span className="text-sm font-medium text-orange-600">3 leads</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Paid</span>
              <span className="text-sm font-medium text-emerald-600">8 leads</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
            <Target className="h-6 w-6 text-blue-600 mb-2" />
            <div className="text-sm font-medium text-gray-900">Follow Up Leads</div>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
            <DollarSign className="h-6 w-6 text-green-600 mb-2" />
            <div className="text-sm font-medium text-gray-900">Update Quotations</div>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
            <Users className="h-6 w-6 text-purple-600 mb-2" />
            <div className="text-sm font-medium text-gray-900">Schedule Meetings</div>
          </button>
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors">
            <TrendingUp className="h-6 w-6 text-orange-600 mb-2" />
            <div className="text-sm font-medium text-gray-900">View Reports</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
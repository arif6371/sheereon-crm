import React, { useState } from 'react';
import { TrendingUp, DollarSign, Target, Users, Calendar } from 'lucide-react';

const SalesManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pipeline');

  const pipelineData = [
    { stage: 'Prospecting', count: 15, value: '$450K', color: 'bg-blue-500' },
    { stage: 'Qualification', count: 12, value: '$380K', color: 'bg-yellow-500' },
    { stage: 'Proposal', count: 8, value: '$280K', color: 'bg-orange-500' },
    { stage: 'Negotiation', count: 5, value: '$200K', color: 'bg-green-500' },
    { stage: 'Closed Won', count: 3, value: '$150K', color: 'bg-purple-500' }
  ];

  const recentDeals = [
    { company: 'ABC Corp', amount: '$45,000', stage: 'Negotiation', probability: 85 },
    { company: 'XYZ Solutions', amount: '$75,000', stage: 'Proposal', probability: 60 },
    { company: 'Tech Innovators', amount: '$32,000', stage: 'Qualification', probability: 40 },
    { company: 'Digital Dynamics', amount: '$58,000', stage: 'Negotiation', probability: 90 }
  ];

  const activities = [
    { type: 'call', client: 'ABC Corp', description: 'Follow-up call scheduled', time: '10:00 AM' },
    { type: 'meeting', client: 'XYZ Solutions', description: 'Product demo', time: '2:00 PM' },
    { type: 'email', client: 'Tech Innovators', description: 'Send proposal', time: '4:00 PM' },
    { type: 'call', client: 'Digital Dynamics', description: 'Contract negotiation', time: '5:00 PM' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Sales Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'pipeline'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pipeline
          </button>
          <button
            onClick={() => setActiveTab('deals')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'deals'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Deals
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'activities'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Activities
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
              <p className="text-2xl font-bold text-gray-900">$1.31M</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Closed This Month</p>
              <p className="text-2xl font-bold text-gray-900">$150K</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Deals</p>
              <p className="text-2xl font-bold text-gray-900">43</p>
            </div>
            <Target className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">23%</p>
            </div>
            <Users className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'pipeline' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Pipeline</h3>
            <div className="space-y-4">
              {pipelineData.map((stage, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${stage.color}`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{stage.stage}</p>
                      <p className="text-sm text-gray-500">{stage.count} deals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{stage.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'deals' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Deals</h3>
            <div className="space-y-4">
              {recentDeals.map((deal, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{deal.company}</p>
                    <p className="text-sm text-gray-500">{deal.stage}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{deal.amount}</p>
                    <p className="text-sm text-gray-500">{deal.probability}% probability</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activities' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Activities</h3>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.client}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesManagement;
import React, { useState } from 'react';
import { TrendingUp, DollarSign, Target, Users, Calendar, CheckCircle, Clock, AlertTriangle, Edit } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const SalesManagement: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('pipeline');
  const [assignedLeads, setAssignedLeads] = useState([
    {
      id: '1',
      company: 'ABC Technologies',
      contact: 'John Smith',
      email: 'john@abctech.com',
      phone: '+1-555-0123',
      status: 'qualified',
      value: '$45,000',
      assignedDate: '2024-01-15',
      lastActivity: '2024-01-20',
      clientQuotation: '$50,000',
      finalQuotation: '$45,000',
      priority: 'high',
      followUpDate: '2024-01-25',
      platforms: ['Web Development', 'Mobile App'],
      slaAgreed: true,
      ndaSigned: true
    },
    {
      id: '2',
      company: 'XYZ Solutions',
      contact: 'Sarah Johnson',
      email: 'sarah@xyz.com',
      phone: '+1-555-0124',
      status: 'proposal',
      value: '$75,000',
      assignedDate: '2024-01-10',
      lastActivity: '2024-01-18',
      clientQuotation: '$80,000',
      finalQuotation: '$75,000',
      priority: 'high',
      platforms: ['ERP System', 'Data Analytics'],
      slaAgreed: false,
      ndaSigned: true
    }
  ]);

  const pipelineData = [
    { stage: 'Contacted', count: 8, value: '$320K', color: 'bg-blue-500' },
    { stage: 'Qualified', count: 6, value: '$280K', color: 'bg-green-500' },
    { stage: 'Proposal', count: 4, value: '$200K', color: 'bg-yellow-500' },
    { stage: 'Negotiation', count: 3, value: '$150K', color: 'bg-orange-500' },
    { stage: 'Paid', count: 8, value: '$450K', color: 'bg-purple-500' }
  ];

  const handleStatusUpdate = (leadId: string, newStatus: string) => {
    setAssignedLeads(prev => 
      prev.map(lead => 
        lead.id === leadId 
          ? { ...lead, status: newStatus, lastActivity: new Date().toISOString().split('T')[0] }
          : lead
      )
    );

    // If status is 'paid', transfer to development
    if (newStatus === 'paid') {
      const lead = assignedLeads.find(l => l.id === leadId);
      if (lead) {
        addNotification({
          type: 'project_update',
          title: 'Lead Converted to Project',
          message: `${lead.company} has been converted to a project and transferred to development team`,
          priority: 'high'
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-yellow-100 text-yellow-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'paid': return 'bg-purple-100 text-purple-800';
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

  const activities = [
    { type: 'call', client: 'ABC Technologies', description: 'Follow-up call scheduled', time: '10:00 AM', status: 'pending' },
    { type: 'meeting', client: 'XYZ Solutions', description: 'Product demo presentation', time: '2:00 PM', status: 'scheduled' },
    { type: 'email', client: 'Tech Innovators', description: 'Send updated proposal', time: '4:00 PM', status: 'completed' },
    { type: 'call', client: 'Digital Dynamics', description: 'Contract negotiation call', time: '5:00 PM', status: 'pending' }
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
              <p className="text-sm font-medium text-gray-600">Assigned Leads</p>
              <p className="text-2xl font-bold text-gray-900">{assignedLeads.length}</p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Converted to Paid</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
              <p className="text-2xl font-bold text-gray-900">$1.4M</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">33%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
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
                      <p className="text-sm text-gray-500">{stage.count} leads</p>
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
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Leads</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lead.company}</div>
                      <div className="text-sm text-gray-500">Assigned: {lead.assignedDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.contact}</div>
                      <div className="text-sm text-gray-500">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                        className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${getStatusColor(lead.status)}`}
                      >
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="proposal">Proposal</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="paid">Paid</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.value}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getPriorityColor(lead.priority)}`}>
                        {lead.priority?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        Follow Up
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'activities' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Activities</h3>
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.client}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{activity.time}</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                      activity.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activity.status}
                    </span>
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
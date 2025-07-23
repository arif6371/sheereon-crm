import React from 'react';
import { Users, Calendar, Clock, UserCheck, AlertTriangle, Activity, TrendingUp, FileText } from 'lucide-react';
import StatsCard from './StatsCard';

const HRDashboard: React.FC = () => {
  const stats = [
    {
      name: 'Total Employees',
      value: '156',
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users
    },
    {
      name: 'Attendance Rate',
      value: '91%',
      change: '+3%',
      changeType: 'positive' as const,
      icon: Activity
    },
    {
      name: 'Leave Requests',
      value: '12',
      change: '+2',
      changeType: 'positive' as const,
      icon: Calendar
    },
    {
      name: 'Performance Issues',
      value: '3',
      change: '-1',
      changeType: 'positive' as const,
      icon: AlertTriangle
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Performance Alerts</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">Task Delays</p>
                <p className="text-xs text-gray-500">3 employees behind schedule</p>
              </div>
              <span className="text-sm font-medium text-red-600">High Priority</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">Meeting Absences</p>
                <p className="text-xs text-gray-500">2 employees missed meetings</p>
              </div>
              <span className="text-sm font-medium text-yellow-600">Medium</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">Low Productivity</p>
                <p className="text-xs text-gray-500">1 employee needs attention</p>
              </div>
              <span className="text-sm font-medium text-orange-600">Low</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending HR Actions</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Leave Approvals</p>
                <p className="text-xs text-gray-500">5 requests pending review</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700">Review</button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Document Uploads</p>
                <p className="text-xs text-gray-500">3 onboarding documents needed</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700">Upload</button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Performance Reviews</p>
                <p className="text-xs text-gray-500">2 quarterly reviews due</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700">Schedule</button>
            </div>
          </div>
        </div>
      </div>

      {/* HR Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">HR Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
            <Calendar className="h-6 w-6 text-blue-600 mb-2" />
            <div className="text-sm font-medium text-gray-900">Schedule Meeting</div>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
            <FileText className="h-6 w-6 text-green-600 mb-2" />
            <div className="text-sm font-medium text-gray-900">Upload Documents</div>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
            <TrendingUp className="h-6 w-6 text-purple-600 mb-2" />
            <div className="text-sm font-medium text-gray-900">Performance Review</div>
          </button>
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors">
            <AlertTriangle className="h-6 w-6 text-orange-600 mb-2" />
            <div className="text-sm font-medium text-gray-900">Emergency Notice</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
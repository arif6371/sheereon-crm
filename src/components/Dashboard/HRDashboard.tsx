import React from 'react';
import { Users, Calendar, Clock, UserCheck } from 'lucide-react';
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
      name: 'Present Today',
      value: '142',
      change: '+2%',
      changeType: 'positive' as const,
      icon: UserCheck
    },
    {
      name: 'Leave Requests',
      value: '8',
      change: '+3',
      changeType: 'negative' as const,
      icon: Calendar
    },
    {
      name: 'Pending Approvals',
      value: '5',
      change: '-2',
      changeType: 'positive' as const,
      icon: Clock
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Attendance</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">On Time</span>
              <span className="text-sm font-medium text-green-600">128 employees</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Late</span>
              <span className="text-sm font-medium text-yellow-600">14 employees</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Absent</span>
              <span className="text-sm font-medium text-red-600">14 employees</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Requests</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Sick Leave - 2 days</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700">Approve</button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Jane Smith</p>
                <p className="text-xs text-gray-500">Vacation - 5 days</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700">Approve</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
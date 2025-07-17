import React from 'react';
import { Code, GitBranch, Bug, CheckCircle } from 'lucide-react';
import StatsCard from './StatsCard';

const DevDashboard: React.FC = () => {
  const stats = [
    {
      name: 'Active Projects',
      value: '8',
      change: '+2',
      changeType: 'positive' as const,
      icon: Code
    },
    {
      name: 'Tasks Completed',
      value: '45',
      change: '+12%',
      changeType: 'positive' as const,
      icon: CheckCircle
    },
    {
      name: 'Open Issues',
      value: '12',
      change: '-8%',
      changeType: 'positive' as const,
      icon: Bug
    },
    {
      name: 'Code Reviews',
      value: '6',
      change: '+50%',
      changeType: 'positive' as const,
      icon: GitBranch
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Tasks</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">User Authentication Module</p>
                <p className="text-xs text-gray-500">Project Alpha</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">In Progress</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Database Optimization</p>
                <p className="text-xs text-gray-500">Project Beta</p>
              </div>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Review</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">API Integration</p>
                <p className="text-xs text-gray-500">Project Gamma</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Completed</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Commits</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Fixed authentication bug</p>
                <p className="text-xs text-gray-500">main branch • 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Added user profile feature</p>
                <p className="text-xs text-gray-500">develop branch • 4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Updated dependencies</p>
                <p className="text-xs text-gray-500">main branch • 1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevDashboard;
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield,
  Bell,
  BarChart3,
  DollarSign, 
  Clock,
  UserCheck,
  AlertCircle,
  Calendar,
  Activity,
  Settings,
  FileText,
  Eye,
  TrendingUp,
  Code
} from 'lucide-react';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 156,
    pendingApprovals: 8,
    activeProjects: 23,
    totalNotices: 12,
    systemAlerts: 3,
    meetingsScheduled: 12,
    attendanceRate: 91,
    activeUsers: 148,
    moduleAccess: {
      presales: 15,
      sales: 12,
      development: 25,
      hr: 8,
      accounts: 6
    }
  });

  const stats = [
    {
      name: 'Total Employees',
      value: dashboardData.totalEmployees.toString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users
    },
    {
      name: 'Pending Approvals',
      value: dashboardData.pendingApprovals.toString(),
      change: '-3',
      changeType: 'positive' as const,
      icon: UserCheck
    },
    {
      name: 'Active Notices',
      value: dashboardData.totalNotices.toString(),
      change: '+2',
      changeType: 'positive' as const,
      icon: Bell
    },
    {
      name: 'System Alerts',
      value: dashboardData.systemAlerts.toString(),
      change: '-1',
      changeType: 'positive' as const,
      icon: AlertCircle
    }
  ];

  const moduleStats = [
    {
      name: 'PreSales Team',
      value: dashboardData.moduleAccess.presales.toString(),
      icon: Users,
      color: 'text-blue-600'
    },
    {
      name: 'Sales Team',
      value: dashboardData.moduleAccess.sales.toString(),
      icon: TrendingUp,
      color: 'text-yellow-600'
    },
    {
      name: 'Development Team',
      value: dashboardData.moduleAccess.development.toString(),
      icon: Settings,
      color: 'text-green-600'
    },
    {
      name: 'Support Teams',
      value: (dashboardData.moduleAccess.hr + dashboardData.moduleAccess.accounts).toString(),
      icon: Shield,
      color: 'text-purple-600'
    }
  ];

  const systemMetricsData = {
    labels: ['Users', 'Projects', 'Notices', 'Reports', 'Alerts', 'Tasks'],
    datasets: [
      {
        label: 'System Activity',
        data: [156, 23, 12, 45, 3, 89],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
      },
    ],
  };

  const roleDistributionData = {
    labels: ['Admin', 'HR', 'PCF', 'Sales', 'Dev/DM', 'Accounts'],
    datasets: [
      {
        data: [2, 8, 15, 12, 25, 6],
        backgroundColor: ['#EF4444', '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#06B6D4'],
        borderWidth: 0,
      },
    ],
  };

  const recentActivities = [
    { action: 'User registration approved', user: 'John Doe', time: '2 hours ago', type: 'success' },
    { action: 'New notice posted', user: 'HR Team', time: '4 hours ago', type: 'info' },
    { action: 'Role updated', user: 'Jane Smith → Sales', time: '6 hours ago', type: 'info' },
    { action: 'System alert resolved', user: 'IT Team', time: '1 day ago', type: 'success' },
    { action: 'User access granted', user: 'Mike Johnson', time: '2 hours ago', type: 'success' },
    { action: 'Emergency notice posted', user: 'Admin', time: '3 hours ago', type: 'warning' }
  ];

  const pendingApprovals = [
    { name: 'Alice Brown', email: 'alice@company.com', role: 'Sales', applied: '2 hours ago' },
    { name: 'Bob Wilson', email: 'bob@company.com', role: 'Developer', applied: '4 hours ago' },
    { name: 'Carol Davis', email: 'carol@company.com', role: 'PCF', applied: '1 day ago' }
  ];

  const systemAlerts = [
    { type: 'warning', message: 'High server load detected', time: '1 hour ago' },
    { type: 'info', message: 'Scheduled maintenance tonight', time: '2 hours ago' },
    { type: 'error', message: 'Failed login attempts detected', time: '3 hours ago' }
  ];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'System Activity Overview',
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Role Distribution',
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatsCard key={stat.name} {...stat} />
        ))}
      </div>

      {/* Module Access Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-600" />
          Module Access Control
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {moduleStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="text-center p-4 bg-gray-50 rounded-lg">
                <Icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pending Approvals & System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <UserCheck className="h-5 w-5 mr-2 text-orange-600" />
            Pending User Approvals
          </h3>
          <div className="space-y-3">
            {pendingApprovals.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email} • {user.role}</p>
                  <p className="text-xs text-gray-400">Applied {user.applied}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                    Approve
                  </button>
                  <button className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
            System Alerts
          </h3>
          <div className="space-y-3">
            {systemAlerts.map((alert, index) => (
              <div key={index} className={`p-3 rounded-lg ${
                alert.type === 'error' ? 'bg-red-50 border-l-4 border-red-500' :
                alert.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
                'bg-blue-50 border-l-4 border-blue-500'
              }`}>
                <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                <p className="text-xs text-gray-500">{alert.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Bar data={systemMetricsData} options={chartOptions} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Pie data={roleDistributionData} options={pieOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
              <UserCheck className="h-6 w-6 text-blue-600 mb-2" />
              <div className="text-sm font-medium text-gray-900">Approve Users</div>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
              <Bell className="h-6 w-6 text-green-600 mb-2" />
              <div className="text-sm font-medium text-gray-900">Post Notice</div>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
              <Settings className="h-6 w-6 text-purple-600 mb-2" />
              <div className="text-sm font-medium text-gray-900">Manage Roles</div>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors">
              <BarChart3 className="h-6 w-6 text-orange-600 mb-2" />
              <div className="text-sm font-medium text-gray-900">System Reports</div>
            </button>
          </div>
        </div>

        <RecentActivity activities={recentActivities} />
      </div>

      {/* System Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-green-600" />
          System Health & Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">94%</div>
            <div className="text-sm text-gray-600">System Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{dashboardData.attendanceRate}%</div>
            <div className="text-sm text-gray-600">Attendance Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{dashboardData.activeUsers}</div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{dashboardData.totalNotices}</div>
            <div className="text-sm text-gray-600">Active Notices</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
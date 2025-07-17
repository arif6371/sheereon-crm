import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  FolderOpen, 
  Calculator, 
  DollarSign, 
  Clock,
  Target,
  AlertCircle,
  Calendar,
  BarChart3,
  PieChart,
  Activity
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
    activeProjects: 23,
    monthlyRevenue: 2400000,
    activeLeads: 42,
    leadsAssigned: 15,
    leadsPending: 8,
    leadsAttended: 7,
    monthlyTarget: 3000000,
    meetingsScheduled: 12,
    attendanceRate: 91,
    supportTickets: 5,
    salesData: [450, 520, 480, 600, 580, 650]
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
      name: 'Active Projects',
      value: dashboardData.activeProjects.toString(),
      change: '+8%',
      changeType: 'positive' as const,
      icon: FolderOpen
    },
    {
      name: 'Monthly Revenue',
      value: `$${(dashboardData.monthlyRevenue / 1000000).toFixed(1)}M`,
      change: '+15%',
      changeType: 'positive' as const,
      icon: DollarSign
    },
    {
      name: 'Active Leads',
      value: dashboardData.activeLeads.toString(),
      change: '-5%',
      changeType: 'negative' as const,
      icon: Target
    }
  ];

  const leadStats = [
    {
      name: 'Leads Assigned',
      value: dashboardData.leadsAssigned.toString(),
      icon: Target,
      color: 'text-blue-600'
    },
    {
      name: 'Leads Pending',
      value: dashboardData.leadsPending.toString(),
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      name: 'Leads Attended',
      value: dashboardData.leadsAttended.toString(),
      icon: Users,
      color: 'text-green-600'
    },
    {
      name: 'Meetings Scheduled',
      value: dashboardData.meetingsScheduled.toString(),
      icon: Calendar,
      color: 'text-purple-600'
    }
  ];

  const salesChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue ($K)',
        data: dashboardData.salesData,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
      },
    ],
  };

  const targetAchievementData = {
    labels: ['Achieved', 'Remaining'],
    datasets: [
      {
        data: [dashboardData.monthlyRevenue, dashboardData.monthlyTarget - dashboardData.monthlyRevenue],
        backgroundColor: ['#10B981', '#EF4444'],
        borderWidth: 0,
      },
    ],
  };

  const recentActivities = [
    { action: 'New employee onboarded', user: 'John Doe', time: '2 hours ago', type: 'success' },
    { action: 'Project milestone completed', user: 'Team Alpha', time: '4 hours ago', type: 'success' },
    { action: 'Invoice payment received', user: 'Client ABC', time: '6 hours ago', type: 'success' },
    { action: 'Leave request pending', user: 'Jane Smith', time: '1 day ago', type: 'warning' },
    { action: 'New lead assigned', user: 'BDE Team', time: '2 hours ago', type: 'info' },
    { action: 'Support ticket created', user: 'Client XYZ', time: '3 hours ago', type: 'warning' }
  ];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Sales Performance',
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
        text: 'Monthly Target Achievement',
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

      {/* Lead Management Stats */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-blue-600" />
          Lead Management Overview
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {leadStats.map((stat) => {
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

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Bar data={salesChartData} options={chartOptions} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Pie data={targetAchievementData} options={pieOptions} />
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-600">
              Target Achievement: {((dashboardData.monthlyRevenue / dashboardData.monthlyTarget) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
              <Users className="h-6 w-6 text-blue-600 mb-2" />
              <div className="text-sm font-medium text-gray-900">Add Employee</div>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
              <FolderOpen className="h-6 w-6 text-green-600 mb-2" />
              <div className="text-sm font-medium text-gray-900">New Project</div>
            </button>
            <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
              <Calculator className="h-6 w-6 text-purple-600 mb-2" />
              <div className="text-sm font-medium text-gray-900">Generate Report</div>
            </button>
            <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors">
              <TrendingUp className="h-6 w-6 text-orange-600 mb-2" />
              <div className="text-sm font-medium text-gray-900">View Analytics</div>
            </button>
          </div>
        </div>

        <RecentActivity activities={recentActivities} />
      </div>

      {/* System Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
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
            <div className="text-3xl font-bold text-purple-600">76%</div>
            <div className="text-sm text-gray-600">Project Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{dashboardData.supportTickets}</div>
            <div className="text-sm text-gray-600">Open Support Tickets</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
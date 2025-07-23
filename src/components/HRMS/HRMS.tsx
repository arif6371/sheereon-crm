import React, { useState } from 'react';
import { Users, Calendar, Clock, UserPlus, FileText, TrendingUp, Upload, Download, CheckCircle, XCircle } from 'lucide-react';
import AttendanceTracker from './AttendanceTracker';
import EmployeeDirectory from './EmployeeDirectory';
import LeaveManagement from './LeaveManagement';
import DocumentManager from './DocumentManager';

const HRMS: React.FC = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [attendanceData, setAttendanceData] = useState([
    { date: '2024-01-22', present: 142, absent: 8, late: 6 },
    { date: '2024-01-21', present: 145, absent: 5, late: 6 },
    { date: '2024-01-20', present: 140, absent: 10, late: 6 },
    { date: '2024-01-19', present: 143, absent: 7, late: 6 },
    { date: '2024-01-18', present: 138, absent: 12, late: 6 }
  ]);

  const [employees, setEmployees] = useState([
    {
      id: 1,
      userId: 'JD-25-001',
      name: 'John Doe',
      position: 'Senior Developer',
      department: 'Development',
      email: 'john@seereon.com',
      phone: '+1 234 567 8900',
      joinDate: '2022-01-15',
      salary: '$85,000',
      status: 'active',
      profilePhoto: null,
      address: '123 Main St, New York, NY',
      state: 'New York',
      onlineStatus: 'online' as const,
      lastSeen: new Date()
    },
    {
      id: 2,
      userId: 'JS-25-002',
      name: 'Jane Smith',
      position: 'HR Manager',
      department: 'Human Resources',
      email: 'jane@seereon.com',
      phone: '+1 234 567 8901',
      joinDate: '2021-03-10',
      salary: '$75,000',
      status: 'active',
      profilePhoto: null,
      address: '456 Oak Ave, Boston, MA',
      state: 'Massachusetts',
      onlineStatus: 'away' as const,
      lastSeen: new Date(Date.now() - 1800000)
    },
    {
      id: 3,
      userId: 'MJ-25-003',
      name: 'Mike Johnson',
      position: 'Business Analyst',
      department: 'Sales',
      email: 'mike@seereon.com',
      phone: '+1 234 567 8902',
      joinDate: '2023-05-20',
      salary: '$70,000',
      status: 'active',
      profilePhoto: null,
      address: '789 Pine St, Chicago, IL',
      state: 'Illinois',
      onlineStatus: 'offline' as const,
      lastSeen: new Date(Date.now() - 3600000)
    }
  ]);

  const [leaveRequests, setLeaveRequests] = useState([
    { 
      id: 1, 
      employee: 'John Doe', 
      employeeId: 'JD-25-001',
      type: 'Sick Leave', 
      days: 2, 
      startDate: '2024-01-25', 
      endDate: '2024-01-26',
      status: 'pending',
      reason: 'Medical appointment',
      appliedDate: '2024-01-20'
    },
    { 
      id: 2, 
      employee: 'Sarah Wilson', 
      employeeId: 'SW-25-004',
      type: 'Vacation', 
      days: 5, 
      startDate: '2024-02-01', 
      endDate: '2024-02-05',
      status: 'approved',
      reason: 'Family vacation',
      appliedDate: '2024-01-15'
    },
    { 
      id: 3, 
      employee: 'Mike Johnson', 
      employeeId: 'MJ-25-003',
      type: 'Personal', 
      days: 1, 
      startDate: '2024-01-26', 
      endDate: '2024-01-26',
      status: 'pending',
      reason: 'Personal work',
      appliedDate: '2024-01-22'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOnlineStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleLeaveAction = (requestId: number, action: 'approve' | 'deny') => {
    setLeaveRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? { ...request, status: action === 'approve' ? 'approved' : 'denied' }
          : request
      )
    );
  };

  const todayAttendance = attendanceData[0];
  const attendanceRate = Math.round((todayAttendance.present / (todayAttendance.present + todayAttendance.absent)) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Human Resource Management</h1>
          <p className="text-gray-600 mt-1">Manage employees, attendance, and HR operations</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
          <UserPlus className="h-4 w-4" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Present Today</p>
              <p className="text-2xl font-bold text-gray-900">{todayAttendance.present}</p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Leave Requests</p>
              <p className="text-2xl font-bold text-gray-900">{leaveRequests.filter(r => r.status === 'pending').length}</p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900">{attendanceRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'employees'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Employee Directory
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'attendance'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Attendance Tracking
        </button>
        <button
          onClick={() => setActiveTab('leaves')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'leaves'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Leave Management
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'documents'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Document Manager
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'employees' && (
        <EmployeeDirectory employees={employees} setEmployees={setEmployees} />
      )}

      {activeTab === 'attendance' && (
        <AttendanceTracker attendanceData={attendanceData} employees={employees} />
      )}

      {activeTab === 'leaves' && (
        <LeaveManagement 
          leaveRequests={leaveRequests} 
          onLeaveAction={handleLeaveAction}
          getStatusColor={getStatusColor}
        />
      )}

      {activeTab === 'documents' && (
        <DocumentManager employees={employees} />
      )}
    </div>
  );
};

// Performance Monitor Component
const PerformanceMonitor: React.FC<{ employees: any[] }> = ({ employees }) => {
  const performanceData = [
    { employee: 'John Doe', department: 'Development', taskCompletion: 95, meetingAttendance: 98, punctuality: 92, overallScore: 95 },
    { employee: 'Jane Smith', department: 'HR', taskCompletion: 88, meetingAttendance: 100, punctuality: 96, overallScore: 94 },
    { employee: 'Mike Johnson', department: 'Sales', taskCompletion: 92, meetingAttendance: 85, punctuality: 88, overallScore: 88 }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Employee Performance Monitor</h3>
          <p className="text-sm text-gray-600 mt-1">Track task completion, meeting participation, and overall performance</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Completion</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meeting Attendance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Punctuality</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {performanceData.map((emp, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{emp.employee}</div>
                      <div className="text-sm text-gray-500">{emp.department}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getScoreColor(emp.taskCompletion)}`}>{emp.taskCompletion}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getScoreColor(emp.meetingAttendance)}`}>{emp.meetingAttendance}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getScoreColor(emp.punctuality)}`}>{emp.punctuality}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-bold ${getScoreColor(emp.overallScore)}`}>{emp.overallScore}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// HR Reports Component
const HRReports: React.FC<{ employees: any[], leaveRequests: any[], attendanceData: any[] }> = ({ 
  employees, leaveRequests, attendanceData 
}) => {
  const reports = [
    { name: 'Monthly Attendance Report', description: 'Detailed attendance analysis for all employees', type: 'attendance' },
    { name: 'Leave Management Report', description: 'Leave requests, approvals, and patterns', type: 'leave' },
    { name: 'Performance Summary', description: 'Employee performance metrics and trends', type: 'performance' },
    { name: 'Onboarding Report', description: 'New employee onboarding status and progress', type: 'onboarding' },
    { name: 'Training & Development', description: 'Employee skill development and training records', type: 'training' }
  ];

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'attendance': return <Clock className="h-6 w-6 text-blue-600" />;
      case 'leave': return <Calendar className="h-6 w-6 text-green-600" />;
      case 'performance': return <TrendingUp className="h-6 w-6 text-purple-600" />;
      case 'onboarding': return <UserPlus className="h-6 w-6 text-orange-600" />;
      case 'training': return <FileText className="h-6 w-6 text-red-600" />;
      default: return <FileText className="h-6 w-6 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">HR Analytics & Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center space-x-3 mb-3">
                {getReportIcon(report.type)}
                <h4 className="text-md font-medium text-gray-900">{report.name}</h4>
              </div>
              <p className="text-sm text-gray-600 mb-4">{report.description}</p>
              <button className="w-full bg-blue-50 text-blue-600 px-3 py-2 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Generate Report</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{employees.length}</div>
            <div className="text-sm text-gray-600">Total Employees</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{leaveRequests.filter(r => r.status === 'approved').length}</div>
            <div className="text-sm text-gray-600">Approved Leaves</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{leaveRequests.filter(r => r.status === 'pending').length}</div>
            <div className="text-sm text-gray-600">Pending Requests</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">91%</div>
            <div className="text-sm text-gray-600">Avg Attendance</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HRMS;
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

export default HRMS;
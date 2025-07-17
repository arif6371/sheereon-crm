import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Calendar, Download } from 'lucide-react';

interface AttendanceData {
  date: string;
  present: number;
  absent: number;
  late: number;
}

interface Employee {
  id: number;
  userId: string;
  name: string;
  department: string;
  onlineStatus: 'online' | 'away' | 'offline';
}

interface AttendanceTrackerProps {
  attendanceData: AttendanceData[];
  employees: Employee[];
}

const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({ attendanceData, employees }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      employeeId: 1,
      name: 'John Doe',
      userId: 'JD-25-001',
      department: 'Development',
      checkIn: '09:00',
      checkOut: '18:00',
      status: 'present',
      workingHours: '9h 0m',
      date: '2024-01-22'
    },
    {
      employeeId: 2,
      name: 'Jane Smith',
      userId: 'JS-25-002',
      department: 'HR',
      checkIn: '09:15',
      checkOut: '18:15',
      status: 'late',
      workingHours: '9h 0m',
      date: '2024-01-22'
    },
    {
      employeeId: 3,
      name: 'Mike Johnson',
      userId: 'MJ-25-003',
      department: 'Sales',
      checkIn: null,
      checkOut: null,
      status: 'absent',
      workingHours: '0h 0m',
      date: '2024-01-22'
    }
  ]);

  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'late':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'absent':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCheckIn = (employeeId: number) => {
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 0);
    
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.employeeId === employeeId
          ? {
              ...record,
              checkIn: timeString,
              status: isLate ? 'late' : 'present'
            }
          : record
      )
    );
  };

  const handleCheckOut = (employeeId: number) => {
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);
    
    setAttendanceRecords(prev =>
      prev.map(record => {
        if (record.employeeId === employeeId && record.checkIn) {
          const checkInTime = new Date(`2024-01-01 ${record.checkIn}`);
          const checkOutTime = new Date(`2024-01-01 ${timeString}`);
          const diffMs = checkOutTime.getTime() - checkInTime.getTime();
          const hours = Math.floor(diffMs / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          
          return {
            ...record,
            checkOut: timeString,
            workingHours: `${hours}h ${minutes}m`
          };
        }
        return record;
      })
    );
  };

  const exportAttendance = () => {
    // Mock export functionality
    const csvContent = attendanceRecords.map(record => 
      `${record.name},${record.userId},${record.department},${record.checkIn || 'N/A'},${record.checkOut || 'N/A'},${record.status},${record.workingHours}`
    ).join('\n');
    
    const blob = new Blob([`Name,User ID,Department,Check In,Check Out,Status,Working Hours\n${csvContent}`], 
      { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${selectedDate}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Attendance Overview */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Attendance Overview</h3>
            <div className="flex items-center space-x-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={exportAttendance}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {attendanceData.slice(0, 1).map((day, index) => (
              <React.Fragment key={index}>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{day.present}</div>
                  <div className="text-sm text-gray-600">Present</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{day.absent}</div>
                  <div className="text-sm text-gray-600">Absent</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{day.late}</div>
                  <div className="text-sm text-gray-600">Late</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round((day.present / (day.present + day.absent)) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Attendance Rate</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Daily Attendance Records */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Daily Attendance Records</h3>
          <p className="text-sm text-gray-600 mt-1">Track employee check-in/check-out times</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Working Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceRecords.map((record) => (
                <tr key={record.employeeId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                        {record.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{record.name}</div>
                        <div className="text-sm text-gray-500">{record.userId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.checkIn || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.checkOut || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.workingHours}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(record.status)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {!record.checkIn && record.status !== 'absent' && (
                        <button
                          onClick={() => handleCheckIn(record.employeeId)}
                          className="text-green-600 hover:text-green-900 px-2 py-1 border border-green-600 rounded text-xs"
                        >
                          Check In
                        </button>
                      )}
                      {record.checkIn && !record.checkOut && (
                        <button
                          onClick={() => handleCheckOut(record.employeeId)}
                          className="text-blue-600 hover:text-blue-900 px-2 py-1 border border-blue-600 rounded text-xs"
                        >
                          Check Out
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Attendance */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Historical Attendance</h3>
          <div className="space-y-4">
            {attendanceData.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div className="text-sm font-medium text-gray-900">{day.date}</div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{day.present}</div>
                    <div className="text-xs text-gray-500">Present</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{day.absent}</div>
                    <div className="text-xs text-gray-500">Absent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600">{day.late}</div>
                    <div className="text-xs text-gray-500">Late</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {Math.round((day.present / (day.present + day.absent)) * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">Rate</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;
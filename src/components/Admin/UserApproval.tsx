import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, User, Mail, Phone, Building, Shield, Edit, Trash2 } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

interface PendingUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  department: string;
  phone?: string;
  joinDate: string;
  status: string;
}

interface ActiveUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  joinDate: string;
  lastSeen: string;
}

const UserApproval: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'roles'>('pending');
  const [loading, setLoading] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ActiveUser | null>(null);
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchPendingUsers();
    fetchActiveUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      // Mock data for pending users
      const mockPendingUsers: PendingUser[] = [
        {
          id: '1',
          userId: 'AB-25-008',
          name: 'Alice Brown',
          email: 'alice@company.com',
          role: 'SALES',
          department: 'Sales',
          phone: '+1-555-0789',
          joinDate: '2024-01-23',
          status: 'pending'
        },
        {
          id: '2',
          userId: 'BW-25-009',
          name: 'Bob Wilson',
          email: 'bob@company.com',
          role: 'DEV',
          department: 'Development',
          phone: '+1-555-0790',
          joinDate: '2024-01-23',
          status: 'pending'
        }
      ];
      setPendingUsers(mockPendingUsers);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      setPendingUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveUsers = async () => {
    try {
      // Mock data for active users
      const mockActiveUsers: ActiveUser[] = [
        {
          id: '1',
          userId: 'AD-25-001',
          name: 'Admin User',
          email: 'admin@seereon.com',
          role: 'Admin',
          department: 'Management',
          status: 'active',
          joinDate: '2020-01-01',
          lastSeen: '2 hours ago'
        },
        {
          id: '2',
          userId: 'HR-25-002',
          name: 'HR Manager',
          email: 'hr@seereon.com',
          role: 'HR',
          department: 'Human Resources',
          status: 'active',
          joinDate: '2021-03-15',
          lastSeen: '1 hour ago'
        },
        {
          id: '3',
          userId: 'PCF-25-003',
          name: 'Pre-Sales Coordinator',
          email: 'pcf@seereon.com',
          role: 'PCF',
          department: 'Pre-Sales',
          status: 'active',
          joinDate: '2022-01-10',
          lastSeen: '30 minutes ago'
        }
      ];
      setActiveUsers(mockActiveUsers);
    } catch (error) {
      console.error('Error fetching active users:', error);
      setActiveUsers([]);
    }
  };

  const handleApproval = async (userId: string, action: 'approve' | 'reject') => {
    try {
      // Mock approval process
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
      
      addNotification({
        type: 'success',
        title: `User ${action === 'approve' ? 'Approved' : 'Rejected'}`,
        message: `User has been ${action}d successfully`,
        priority: 'medium'
      });
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      addNotification({
        type: 'error',
        title: 'Action Failed',
        message: `Failed to ${action} user. Please try again.`,
        priority: 'high'
      });
    }
  };

  const handleRoleUpdate = (userId: string, newRole: string) => {
    setActiveUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
    setShowRoleModal(false);
    setSelectedUser(null);
    
    addNotification({
      type: 'success',
      title: 'Role Updated',
      message: `User role has been updated to ${newRole}`,
      priority: 'medium'
    });
  };

  const handleUserStatusToggle = (userId: string) => {
    setActiveUsers(prev =>
      prev.map(user =>
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      )
    );
    
    addNotification({
      type: 'info',
      title: 'User Status Updated',
      message: 'User status has been changed',
      priority: 'medium'
    });
  };

  const roles = ['Admin', 'HR', 'PCF', 'SALES', 'DEV', 'DM', 'Accounts'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">Approve registrations, assign roles, and manage user access</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-orange-600">
            <Clock className="h-4 w-4" />
            <span>{pendingUsers.length} pending approvals</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <User className="h-4 w-4" />
            <span>{activeUsers.length} active users</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'pending'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Pending Approvals ({pendingUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'active'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Active Users ({activeUsers.length})
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'roles'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Role Management
        </button>
      </div>

      {/* Pending Approvals Tab */}
      {activeTab === 'pending' && (
        <>
      {pendingUsers.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
          <p className="text-gray-500">No pending user approvals at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.userId}</p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Pending
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {user.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  {user.role}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Building className="h-4 w-4 mr-2" />
                  {user.department}
                </div>
                {user.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {user.phone}
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleApproval(user.id, 'approve')}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => handleApproval(user.id, 'reject')}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Reject</span>
                </button>
              </div>

              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                Applied: {new Date(user.joinDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
        </>
      )}

      {/* Active Users Tab */}
      {activeTab === 'active' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Seen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-400">{user.userId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'Admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'HR' ? 'bg-green-100 text-green-800' :
                        user.role === 'PCF' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'SALES' ? 'bg-yellow-100 text-yellow-800' :
                        user.role === 'DEV' || user.role === 'DM' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastSeen}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowRoleModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit Role"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleUserStatusToggle(user.id)}
                          className={`${
                            user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                          }`}
                          title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          <Shield className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Role Management Tab */}
      {activeTab === 'roles' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Permissions & Access Control</h3>
          <div className="space-y-6">
            {roles.map((role) => (
              <div key={role} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-medium text-gray-900">{role}</h4>
                  <span className="text-sm text-gray-500">
                    {activeUsers.filter(u => u.role === role).length} users
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {role === 'Admin' && 'Full system access, user management, role assignment, notices'}
                  {role === 'HR' && 'Employee management, attendance, leave management, notices'}
                  {role === 'PCF' && 'Lead creation, pre-sales coordination, requirement analysis'}
                  {role === 'SALES' && 'Lead management, client communication, deal closure'}
                  {role === 'DEV' && 'Project development, task management, code implementation'}
                  {role === 'DM' && 'Project management, team coordination, development oversight'}
                  {role === 'Accounts' && 'Financial management, invoicing, payment tracking'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Role Update Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update User Role</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600">User: <span className="font-medium">{selectedUser.name}</span></p>
                <p className="text-sm text-gray-600">Current Role: <span className="font-medium">{selectedUser.role}</span></p>
              </div>
              <div className="space-y-2">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleUpdate(selectedUser.id, role)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedUser.role === role
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <div className="flex space-x-4 pt-4 mt-4 border-t">
                <button
                  onClick={() => {
                    setShowRoleModal(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserApproval;
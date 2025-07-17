import React, { useState, useEffect } from 'react';
import { Bell, Pin, Calendar, AlertTriangle, Info, Plus, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'announcement' | 'policy' | 'emergency' | 'event' | 'holiday' | 'rule';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: string;
  postedBy: {
    name: string;
    role: string;
  };
  isActive: boolean;
  expiryDate?: string;
  createdAt: string;
  readBy: string[];
}

const NoticeBoard: React.FC = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch('/api/notices', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotices(data);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (noticeId: string) => {
    try {
      await fetch(`/api/notices/${noticeId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setNotices(prev => 
        prev.map(notice => 
          notice.id === noticeId 
            ? { ...notice, readBy: [...notice.readBy, user?.id || ''] }
            : notice
        )
      );
    } catch (error) {
      console.error('Error marking notice as read:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'announcement':
        return <Bell className="h-5 w-5 text-blue-600" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-purple-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'announcement':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'event':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'policy':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'holiday':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      default:
        return 'text-green-600';
    }
  };

  const canCreateNotice = user?.role === 'Admin' || user?.role === 'HR';

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
          <h2 className="text-2xl font-bold text-gray-900">Notice Board</h2>
          <p className="text-gray-600 mt-1">Company announcements and important updates</p>
        </div>
        {canCreateNotice && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Post Notice</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notices.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notices yet</h3>
            <p className="text-gray-500">Check back later for company updates and announcements.</p>
          </div>
        ) : (
          notices.map((notice) => {
            const isRead = notice.readBy.includes(user?.id || '');
            const isUrgent = notice.priority === 'urgent';
            
            return (
              <div
                key={notice.id}
                className={`bg-white rounded-lg shadow-sm border-l-4 p-6 cursor-pointer transition-all hover:shadow-md ${
                  isUrgent ? 'border-l-red-500' : 'border-l-blue-500'
                } ${!isRead ? 'bg-blue-50' : ''}`}
                onClick={() => !isRead && markAsRead(notice.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(notice.type)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                        <span>{notice.title}</span>
                        {!isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                        {isUrgent && <Pin className="h-4 w-4 text-red-500" />}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>By {notice.postedBy.name}</span>
                        <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                        <span className={`font-medium ${getPriorityColor(notice.priority)}`}>
                          {notice.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getTypeColor(notice.type)}`}>
                    {notice.type}
                  </span>
                </div>

                <div className="prose prose-sm max-w-none text-gray-700 mb-4">
                  {notice.content}
                </div>

                {notice.expiryDate && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Expires: {new Date(notice.expiryDate).toLocaleDateString()}</span>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    Target: {notice.targetAudience === 'all' ? 'All Employees' : notice.targetAudience.toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {notice.readBy.length} read
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showCreateModal && (
        <CreateNoticeModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchNotices();
          }}
        />
      )}
    </div>
  );
};

interface CreateNoticeModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateNoticeModal: React.FC<CreateNoticeModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'announcement',
    priority: 'medium',
    targetAudience: 'all',
    expiryDate: ''
  });
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/notices', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Notice Posted',
          message: 'Your notice has been posted successfully.',
          priority: 'medium'
        });
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating notice:', error);
      addNotification({
        type: 'error',
        title: 'Failed to Post Notice',
        message: 'Please try again.',
        priority: 'high'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Post New Notice</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter notice title"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="announcement">Announcement</option>
                <option value="policy">Policy</option>
                <option value="emergency">Emergency</option>
                <option value="event">Event</option>
                <option value="holiday">Holiday</option>
                <option value="rule">Rule</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Audience
              </label>
              <select
                value={formData.targetAudience}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Employees</option>
                <option value="hr">HR</option>
                <option value="sales">Sales</option>
                <option value="dev">Development</option>
                <option value="accounts">Accounts</option>
                <option value="management">Management</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              required
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter notice content"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date (Optional)
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Posting...' : 'Post Notice'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoticeBoard;
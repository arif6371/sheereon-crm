import React, { useState } from 'react';
import { Plus, Calendar, Users, Clock, CheckCircle, AlertTriangle, Upload, FileText, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const ProjectManagement: React.FC = () => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('active');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const projects = [
    {
      id: 1,
      name: 'E-commerce Platform',
      client: 'ABC Corp',
      status: 'active',
      progress: 75,
      deadline: '2024-03-15',
      team: ['John', 'Sarah', 'Mike'],
      budget: '$150,000',
      tasks: { total: 45, completed: 34 },
      assignedFrom: 'sales@seereon.com',
      transferDate: '2024-01-15',
      stage: 'execution',
      platforms: ['React', 'Node.js', 'MongoDB'],
      issues: 2,
      documents: 8
    },
    {
      id: 2,
      name: 'Mobile App Development',
      client: 'XYZ Solutions',
      status: 'active',
      progress: 40,
      deadline: '2024-04-20',
      team: ['Alice', 'Bob', 'Charlie'],
      budget: '$80,000',
      tasks: { total: 32, completed: 13 },
      assignedFrom: 'sales@seereon.com',
      transferDate: '2024-01-20',
      stage: 'planning',
      platforms: ['React Native', 'Firebase'],
      issues: 0,
      documents: 5
    },
    {
      id: 3,
      name: 'CRM System',
      client: 'Tech Innovators',
      status: 'completed',
      progress: 100,
      deadline: '2024-01-30',
      team: ['David', 'Emma', 'Frank'],
      budget: '$120,000',
      tasks: { total: 38, completed: 38 },
      assignedFrom: 'sales@seereon.com',
      transferDate: '2023-12-01',
      stage: 'deployment',
      platforms: ['Vue.js', 'Laravel', 'MySQL'],
      issues: 0,
      documents: 12
    }
  ];

  const filteredProjects = projects.filter(project => {
    if (activeTab === 'active') return project.status === 'active';
    if (activeTab === 'completed') return project.status === 'completed';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'requirement': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'execution': return 'bg-orange-100 text-orange-800';
      case 'testing': return 'bg-purple-100 text-purple-800';
      case 'deployment': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStageUpdate = (projectId: number, newStage: string) => {
    // Update project stage logic
    addNotification({
      type: 'project_update',
      title: 'Project Stage Updated',
      message: `Project stage has been updated to ${newStage}`,
      priority: 'medium'
    });
  };

  const canManageProject = (project: any) => {
    return user?.role === 'DM' || user?.role === 'Admin' || 
           (user?.role === 'DEV' && project.team.includes(user.name));
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
        <div className="flex space-x-2">
          {user?.role === 'DM' && (
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors">
              <Upload className="h-4 w-4" />
              <span>Upload Documents</span>
            </button>
          )}
          <button 
            onClick={() => setShowTaskModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Assign Task</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'active'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Active Projects
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'completed'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'tasks'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          My Tasks
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Projects
        </button>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">{projects.filter(p => p.status === 'active').length}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Issues</p>
              <p className="text-2xl font-bold text-gray-900">{projects.reduce((sum, p) => sum + p.issues, 0)}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {(activeTab === 'active' || activeTab === 'completed' || activeTab === 'all') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  {project.issues > 0 && (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      {project.issues} issues
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Client:</span>
                  <span className="font-medium">{project.client}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Stage:</span>
                  {canManageProject(project) ? (
                    <select
                      value={project.stage}
                      onChange={(e) => handleStageUpdate(project.id, e.target.value)}
                      className={`px-2 py-1 text-xs font-medium rounded-full border-0 ${getStageColor(project.stage)}`}
                    >
                      <option value="requirement">Requirement Analysis</option>
                      <option value="planning">Planning</option>
                      <option value="execution">Execution</option>
                      <option value="testing">Testing</option>
                      <option value="deployment">Deployment</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStageColor(project.stage)}`}>
                      {project.stage}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Budget:</span>
                  <span className="font-medium">{project.budget}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Deadline:</span>
                  <span className="font-medium">{project.deadline}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tasks:</span>
                  <span className="font-medium">{project.tasks.completed}/{project.tasks.total}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Documents:</span>
                  <span className="font-medium">{project.documents} files</span>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
    </div>
  );
};

              <div className="mt-4">
                <div className="text-sm text-gray-600 mb-2">Platforms:</div>
                <div className="flex flex-wrap gap-1">
                  {project.platforms.map((platform, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {project.team.slice(0, 3).map((member, index) => (
                      <div key={index} className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                        {member.charAt(0)}
                      </div>
                    ))}
                    {project.team.length > 3 && (
                      <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                        +{project.team.length - 3}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => setSelectedProject(project)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
      {activeTab === 'tasks' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Assigned Tasks</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">User Authentication Module</p>
                  <p className="text-sm text-gray-500">E-commerce Platform • Due: Jan 25</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">In Progress</span>
                  <button className="text-blue-600 hover:text-blue-900 text-sm">Update</button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Database Schema Design</p>
                  <p className="text-sm text-gray-500">Mobile App Development • Due: Jan 28</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Review</span>
                  <button className="text-blue-600 hover:text-blue-900 text-sm">Update</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
                  >
      {/* Task Assignment Modal */}
      {showTaskModal && (
        <TaskAssignmentModal
          projects={projects.filter(p => p.status === 'active')}
          onClose={() => setShowTaskModal(false)}
          onAssign={(taskData) => {
            addNotification({
              type: 'info',
              title: 'Task Assigned',
              message: `Task "${taskData.title}" has been assigned successfully`,
              priority: 'medium'
            });
            setShowTaskModal(false);
          }}
        />
      )}
                    View Details
                  </button>
                </div>
              </div>
interface TaskAssignmentModalProps {
  projects: any[];
  onClose: () => void;
  onAssign: (taskData: any) => void;
}
            </div>
const TaskAssignmentModal: React.FC<TaskAssignmentModalProps> = ({ projects, onClose, onAssign }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: '',
    estimatedHours: ''
  });

  const developers = ['dev1@seereon.com', 'dev2@seereon.com', 'dev3@seereon.com'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign New Task</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select developer</option>
                  {developers.map(dev => (
                    <option key={dev} value={dev}>{dev}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Est. Hours</label>
                <input
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
        </div>
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Assign Task
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
    </div>
  );
};
      )}
export default ProjectManagement;
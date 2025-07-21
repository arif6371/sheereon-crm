import React, { useState, useEffect } from 'react';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Upload,
  MessageSquare,
  Users
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  deadline: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
}

interface Project {
  id: string;
  name: string;
  client: string;
  status: 'requirement-analysis' | 'planning' | 'execution' | 'testing' | 'deployment' | 'completed';
  startDate: string;
  deadline: string;
  assignedDev: string;
  description: string;
  tasks: Task[];
  documents: string[];
  progress: number;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Website',
    client: 'ABC Corp',
    status: 'execution',
    startDate: '2024-01-15',
    deadline: '2024-03-15',
    assignedDev: 'John Developer',
    description: 'Full-stack e-commerce solution with payment integration',
    tasks: [
      {
        id: '1',
        title: 'Setup database schema',
        description: 'Create database tables and relationships',
        assignedTo: 'Junior Dev 1',
        deadline: '2024-02-01',
        status: 'completed',
        priority: 'high'
      },
      {
        id: '2',
        title: 'Implement user authentication',
        description: 'JWT-based authentication system',
        assignedTo: 'Junior Dev 2',
        deadline: '2024-02-10',
        status: 'in-progress',
        priority: 'high'
      }
    ],
    documents: ['requirements.pdf', 'wireframes.fig', 'api-docs.md'],
    progress: 65
  },
  {
    id: '2',
    name: 'Mobile App Development',
    client: 'XYZ Ltd',
    status: 'planning',
    startDate: '2024-02-01',
    deadline: '2024-05-01',
    assignedDev: 'Sarah Developer',
    description: 'React Native mobile application',
    tasks: [],
    documents: ['requirements.pdf'],
    progress: 25
  }
];

const statusColors = {
  'requirement-analysis': 'bg-purple-100 text-purple-800',
  'planning': 'bg-blue-100 text-blue-800',
  'execution': 'bg-yellow-100 text-yellow-800',
  'testing': 'bg-orange-100 text-orange-800',
  'deployment': 'bg-green-100 text-green-800',
  'completed': 'bg-gray-100 text-gray-800'
};

const taskStatusColors = {
  'pending': 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'completed': 'bg-green-100 text-green-800',
  'overdue': 'bg-red-100 text-red-800'
};

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    deadline: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTask = () => {
    if (!selectedProject || !newTask.title) return;

    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      status: 'pending'
    };

    const updatedProjects = projects.map(project => 
      project.id === selectedProject.id 
        ? { ...project, tasks: [...project.tasks, task] }
        : project
    );

    setProjects(updatedProjects);
    setSelectedProject({ ...selectedProject, tasks: [...selectedProject.tasks, task] });
    setNewTask({ title: '', description: '', assignedTo: '', deadline: '', priority: 'medium' });
    setShowTaskModal(false);
  };

  const updateProjectStatus = (projectId: string, newStatus: Project['status']) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId ? { ...project, status: newStatus } : project
    );
    setProjects(updatedProjects);
    if (selectedProject?.id === projectId) {
      setSelectedProject({ ...selectedProject, status: newStatus });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Project Management</h1>
          <p className="text-gray-600 mt-1">Manage development projects and tasks</p>
        </div>
      </div>

      {!selectedProject ? (
        <div>
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="requirement-analysis">Requirement Analysis</option>
                  <option value="planning">Planning</option>
                  <option value="execution">Execution</option>
                  <option value="testing">Testing</option>
                  <option value="deployment">Deployment</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                      {project.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      {project.client}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      Due: {new Date(project.deadline).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {project.assignedDev}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{project.tasks.length} tasks</span>
                    <span>{project.documents.length} documents</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Project Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <button
                onClick={() => setSelectedProject(null)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Projects
              </button>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedProject.status]}`}>
                {selectedProject.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedProject.name}</h2>
            <p className="text-gray-600 mb-4">{selectedProject.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Client</p>
                  <p className="font-medium">{selectedProject.client}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Deadline</p>
                  <p className="font-medium">{new Date(selectedProject.deadline).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Assigned Developer</p>
                  <p className="font-medium">{selectedProject.assignedDev}</p>
                </div>
              </div>
            </div>

            {/* Project Status Update */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Project Status
              </label>
              <select
                value={selectedProject.status}
                onChange={(e) => updateProjectStatus(selectedProject.id, e.target.value as Project['status'])}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="requirement-analysis">Requirement Analysis</option>
                <option value="planning">Planning</option>
                <option value="execution">Execution</option>
                <option value="testing">Testing</option>
                <option value="deployment">Deployment</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Tasks</h3>
              <button
                onClick={() => setShowTaskModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>

            <div className="space-y-4">
              {selectedProject.tasks.map((task) => (
                <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">{task.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${taskStatusColors[task.status]}`}>
                      {task.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Assigned to: {task.assignedTo}</span>
                    <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {selectedProject.tasks.length === 0 && (
                <p className="text-gray-500 text-center py-8">No tasks assigned yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Task Creation Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Task</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                <input
                  type="text"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                <input
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
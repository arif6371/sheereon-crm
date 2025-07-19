import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, Eye, Edit, Trash2, Clock, CheckCircle, AlertTriangle, User, Calendar, DollarSign } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';
import LeadDetailsModal from './LeadDetailsModal';
import AssignLeadModal from './AssignLeadModal';
import DuplicateLeadDetection from './DuplicateLeadDetection';

interface Lead {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'paid' | 'pending';
  value: string;
  source: string;
  date: string;
  assignedTo?: string;
  assignedBy?: string;
  assignedDate?: string;
  lastActivity?: string;
  industry: string;
  clientQuotation?: string;
  finalQuotation?: string;
  interestedPlatforms: string[];
  customPlatform?: string;
  slaAgreed: boolean;
  ndaSigned: boolean;
  projectNotes: string[];
  priority: 'low' | 'medium' | 'high';
  followUpDate?: string;
  meetingScheduled?: string;
}

const PreSales: React.FC = () => {
  const { addNotification } = useNotification();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('leads');
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      company: 'ABC Technologies',
      contact: 'John Smith',
      email: 'john@abctech.com',
      phone: '+1-555-0123',
      status: 'qualified',
      value: '$45,000',
      source: 'Website',
      date: '2024-01-15',
      assignedTo: 'bde@seereon.com',
      assignedBy: 'admin@seereon.com',
      assignedDate: '2024-01-15',
      lastActivity: '2024-01-20',
      industry: 'Technology',
      clientQuotation: '$50,000',
      finalQuotation: '$45,000',
      interestedPlatforms: ['Web Development', 'Mobile App'],
      slaAgreed: true,
      ndaSigned: true,
      projectNotes: ['Initial discussion completed', 'Requirements gathered'],
      priority: 'high',
      followUpDate: '2024-01-25'
    },
    {
      id: '2',
      company: 'XYZ Solutions',
      contact: 'Sarah Johnson',
      email: 'sarah@xyz.com',
      phone: '+1-555-0124',
      status: 'proposal',
      value: '$75,000',
      source: 'Referral',
      date: '2024-01-10',
      assignedTo: 'bde@seereon.com',
      assignedBy: 'admin@seereon.com',
      assignedDate: '2024-01-10',
      lastActivity: '2024-01-18',
      industry: 'Healthcare',
      clientQuotation: '$80,000',
      finalQuotation: '$75,000',
      interestedPlatforms: ['ERP System', 'Data Analytics'],
      slaAgreed: false,
      ndaSigned: true,
      projectNotes: ['Proposal sent', 'Awaiting client feedback'],
      priority: 'high',
      meetingScheduled: '2024-01-26 10:00'
    },
    {
      id: '3',
      company: 'Tech Innovators',
      contact: 'Mike Wilson',
      email: 'mike@techinno.com',
      phone: '+1-555-0125',
      status: 'pending',
      value: '$32,000',
      source: 'LinkedIn',
      date: '2024-01-20',
      assignedTo: 'bde@seereon.com',
      assignedBy: 'admin@seereon.com',
      assignedDate: '2024-01-20',
      lastActivity: '2024-01-20',
      industry: 'Finance',
      interestedPlatforms: ['Web Development'],
      slaAgreed: false,
      ndaSigned: false,
      projectNotes: ['Lead assigned today', 'Need to contact'],
      priority: 'medium'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Auto-move leads to pending if not attended on the same day
  useEffect(() => {
    const checkPendingLeads = () => {
      const today = new Date().toISOString().split('T')[0];
      setLeads(prevLeads => 
        prevLeads.map(lead => {
          if (lead.assignedDate === today && lead.lastActivity === lead.assignedDate && lead.status === 'new') {
            return { ...lead, status: 'pending' as const };
          }
          return lead;
        })
      );
    };

    const interval = setInterval(checkPendingLeads, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'paid': return 'bg-emerald-100 text-emerald-800';
      case 'pending': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="h-4 w-4" />;
      case 'contacted': return <User className="h-4 w-4" />;
      case 'qualified': return <CheckCircle className="h-4 w-4" />;
      case 'proposal': return <Edit className="h-4 w-4" />;
      case 'negotiation': return <DollarSign className="h-4 w-4" />;
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    
    // PCF can see all leads they created and unassigned leads
    if (user?.role === 'PCF') {
      return matchesSearch && matchesStatus && matchesPriority;
    }
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newLead: Lead = {
      id: Date.now().toString(),
      company: formData.get('company') as string,
      contact: formData.get('contact') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      status: 'new',
      value: formData.get('value') as string,
      source: formData.get('source') as string,
      date: new Date().toISOString().split('T')[0],
      industry: formData.get('industry') as string,
      interestedPlatforms: [formData.get('platforms') as string],
      slaAgreed: false,
      ndaSigned: false,
      projectNotes: ['Lead created'],
      priority: formData.get('priority') as 'low' | 'medium' | 'high'
    };
    
    setLeads([...leads, newLead]);
    setShowAddForm(false);
    addNotification({
      type: 'success',
      title: 'Lead Added',
      message: `New lead ${newLead.company} has been added successfully`,
      priority: 'medium'
    });
  };

  const handleStatusChange = (leadId: string, newStatus: string) => {
    setLeads(leads.map(lead => {
      if (lead.id === leadId) {
        const updatedLead = { 
          ...lead, 
          status: newStatus as any,
          lastActivity: new Date().toISOString().split('T')[0]
        };
        
        // If status is changed to 'paid', initiate project transfer
        if (newStatus === 'paid') {
          addNotification({
            type: 'project_update',
            title: 'Project Initiated',
            message: `Lead ${lead.company} has been converted to project and assigned to development team`,
            priority: 'high',
            actionUrl: '/projects'
          });
        }
        
        return updatedLead;
      }
      return lead;
    }));
    
    addNotification({
      type: 'info',
      title: 'Status Updated',
      message: `Lead status has been updated to ${newStatus}`,
      priority: 'medium'
    });
  };

  const handleAssignLead = (leadId: string, assignTo: string) => {
    setLeads(leads.map(lead => 
      lead.id === leadId 
        ? { 
            ...lead, 
            assignedTo: assignTo,
            assignedBy: user?.email || '',
            assignedDate: new Date().toISOString().split('T')[0]
          } 
        : lead
    ));
    
    addNotification({
      type: 'lead_assigned',
      title: 'Lead Assigned',
      message: `Lead has been assigned to ${assignTo}`,
      priority: 'high'
    });
  };

  const canEditLead = (lead: Lead) => {
    if (user?.role === 'Admin') return true;
    if (user?.role === 'PCF' && !lead.assignedTo) return true; // PCF can only edit unassigned leads
    return false;
  };

  const platforms = [
    'Web Development',
    'Mobile App Development',
    'ERP System',
    'CRM System',
    'E-commerce Platform',
    'Data Analytics',
    'Cloud Solutions',
    'AI/ML Solutions'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">PreSales Management</h1>
          <p className="text-gray-600 mt-1">Create and manage leads for sales team assignment</p>
        </div>
        <div className="flex space-x-2">
          {user?.role === 'Admin' && (
            <button
              onClick={() => setShowAssignModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
            >
              <User className="h-4 w-4" />
              <span>Assign to Sales</span>
            </button>
          )}
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'leads'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Leads
        </button>
        <button
          onClick={() => setActiveTab('duplicates')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'duplicates'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Duplicate Detection
        </button>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Leads</p>
              <p className="text-2xl font-bold text-red-600">{leads.filter(l => l.status === 'pending').length}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Qualified Leads</p>
              <p className="text-2xl font-bold text-green-600">{leads.filter(l => l.status === 'qualified').length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {leads.length > 0 ? Math.round((leads.filter(l => l.status === 'paid').length / leads.length) * 100) : 0}%
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'leads' && (
        <>
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="proposal">Proposal</option>
                  <option value="negotiation">Negotiation</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{lead.company}</div>
                        <div className="text-sm text-gray-500">{lead.industry}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{lead.contact}</div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                        <div className="text-sm text-gray-500">{lead.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(lead.status)}`}>
                          {getStatusIcon(lead.status)}
                          <span>{lead.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getPriorityColor(lead.priority)}`}>
                          {lead.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.value}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.assignedTo ? (
                          <div>
                            <div className="font-medium text-green-600">Assigned to Sales</div>
                            <div className="text-xs text-gray-500">
                              {lead.assignedDate}
                            </div>
                          </div>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                            Awaiting Assignment
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {lead.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedLead(lead);
                              setShowDetailsModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {canEditLead(lead) && (
                            <>
                              <button className="text-green-600 hover:text-green-900">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'duplicates' && (
        <DuplicateLeadDetection />
      )}
      {/* Add Lead Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-screen overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Lead</h3>
              <form onSubmit={handleAddLead} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    <input
                      type="text"
                      name="industry"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      name="contact"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Potential Value
                    </label>
                    <input
                      type="text"
                      name="value"
                      required
                      placeholder="$50,000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      name="priority"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Source
                    </label>
                    <select
                      name="source"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select source</option>
                      <option value="Website">Website</option>
                      <option value="Referral">Referral</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Email">Email</option>
                      <option value="Phone">Phone</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Interested Platform
                    </label>
                    <select
                      name="platforms"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select platform</option>
                      {platforms.map(platform => (
                        <option key={platform} value={platform}>{platform}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add Lead
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Lead Details Modal */}
      {showDetailsModal && selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedLead(null);
          }}
          onUpdate={(updatedLead) => {
            setLeads(leads.map(l => l.id === updatedLead.id ? updatedLead : l));
            setShowDetailsModal(false);
            setSelectedLead(null);
          }}
          canEdit={canEditLead(selectedLead)}
        />
      )}

      {/* Assign Lead Modal */}
      {showAssignModal && (
        <AssignLeadModal
          leads={leads.filter(l => !l.assignedTo)}
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssignLead}
        />
      )}
    </div>
  );
};

export default PreSales;
import React, { useState } from 'react';
import { X, User, Search } from 'lucide-react';

interface Lead {
  id: string;
  company: string;
  contact: string;
  email: string;
  status: string;
  value: string;
  priority: string;
}

interface AssignLeadModalProps {
  leads: Lead[];
  onClose: () => void;
  onAssign: (leadId: string, assignTo: string) => void;
}

const AssignLeadModal: React.FC<AssignLeadModalProps> = ({ leads, onClose, onAssign }) => {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [assignTo, setAssignTo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const salesUsers = [
    'sales@seereon.com',
    'sales2@seereon.com',
    'sales3@seereon.com'
  ];

  const filteredLeads = leads.filter(lead =>
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLeadToggle = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleAssign = () => {
    if (selectedLeads.length > 0 && assignTo) {
      selectedLeads.forEach(leadId => {
        onAssign(leadId, assignTo);
      });
      onClose();
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

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full m-4 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <User className="h-6 w-6 mr-2 text-blue-600" />
            Assign Leads to BDE
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Assignment Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign To
            </label>
            <select
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select BDE</option>
              {bdeUsers.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Unassigned Leads
            </label>
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

          {/* Leads List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">
                Leads Ready for Assignment ({filteredLeads.length})
              </h4>
              <div className="text-sm text-gray-600">
                Selected: {selectedLeads.length}
              </div>
            </div>

            {filteredLeads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No leads ready for assignment
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredLeads.map(lead => (
                  <div
                    key={lead.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedLeads.includes(lead.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleLeadToggle(lead.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => handleLeadToggle(lead.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{lead.company}</div>
                          <div className="text-sm text-gray-500">{lead.contact} • {lead.email}</div>
                Assign To Sales Team
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">{lead.value}</div>
                        <div className={`text-sm font-medium ${getPriorityColor(lead.priority)}`}>
                          {lead.priority.toUpperCase()}
                        </div>
                <option value="">Select Sales Executive</option>
                {salesUsers.map(user => (
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={selectedLeads.length === 0 || !assignTo}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Assign {selectedLeads.length} Lead{selectedLeads.length !== 1 ? 's' : ''} to Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignLeadModal;
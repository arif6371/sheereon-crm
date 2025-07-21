import React, { useState } from 'react';
import { X, User, Building, Mail, Phone, Calendar, DollarSign } from 'lucide-react';

interface Lead {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  status: string;
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

interface AssignLeadModalProps {
  leads: Lead[];
  onClose: () => void;
  onAssign: (leadId: string, assignTo: string) => void;
}

const AssignLeadModal: React.FC<AssignLeadModalProps> = ({ leads, onClose, onAssign }) => {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [assignTo, setAssignTo] = useState('');

  const salesPersons = [
    { id: 'sales1@seereon.com', name: 'Sales Executive 1', email: 'sales1@seereon.com' },
    { id: 'sales2@seereon.com', name: 'Sales Executive 2', email: 'sales2@seereon.com' },
    { id: 'sales3@seereon.com', name: 'Sales Executive 3', email: 'sales3@seereon.com' }
  ];

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

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full m-4 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">Assign Leads to Sales Team</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Sales Person Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Sales Person
            </label>
            <select
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose a sales person...</option>
              {salesPersons.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name} ({person.email})
                </option>
              ))}
            </select>
          </div>

          {/* Unassigned Leads */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Unassigned Leads ({leads.length})
            </h4>
            
            {leads.length === 0 ? (
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No unassigned leads available</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedLeads.includes(lead.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleLeadToggle(lead.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={() => handleLeadToggle(lead.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-blue-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{lead.company}</p>
                              <p className="text-xs text-gray-500">{lead.industry}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-green-600" />
                            <div>
                              <p className="text-sm text-gray-900">{lead.contact}</p>
                              <p className="text-xs text-gray-500">{lead.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-purple-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{lead.value}</p>
                              <p className="text-xs text-gray-500">Potential Value</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-orange-600" />
                            <div>
                              <p className="text-sm text-gray-900">{lead.date}</p>
                              <p className="text-xs text-gray-500">Created</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              lead.priority === 'high' ? 'bg-red-100 text-red-800' :
                              lead.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {lead.priority.toUpperCase()} PRIORITY
                            </span>
                            <span className="text-xs text-gray-500">
                              Platforms: {lead.interestedPlatforms.join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t">
            <button
              onClick={handleAssign}
              disabled={selectedLeads.length === 0 || !assignTo}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Assign {selectedLeads.length} Lead{selectedLeads.length !== 1 ? 's' : ''}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignLeadModal;
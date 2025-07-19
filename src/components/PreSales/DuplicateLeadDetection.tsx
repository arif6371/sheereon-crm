import React, { useState } from 'react';
import { AlertTriangle, Eye, Merge, X, Mail, Phone, Building } from 'lucide-react';

interface DuplicateLead {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  source: string;
  createdDate: string;
  createdBy: string;
  status: string;
  value: string;
}

interface DuplicateGroup {
  duplicateKey: string;
  reason: 'email' | 'phone' | 'company';
  leads: DuplicateLead[];
}

const DuplicateLeadDetection: React.FC = () => {
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([
    {
      duplicateKey: 'john@abctech.com',
      reason: 'email',
      leads: [
        {
          id: '1',
          company: 'ABC Technologies',
          contact: 'John Smith',
          email: 'john@abctech.com',
          phone: '+1-555-0123',
          source: 'Website',
          createdDate: '2024-01-15',
          createdBy: 'pcf@seereon.com',
          status: 'new',
          value: '$45,000'
        },
        {
          id: '2',
          company: 'ABC Tech Solutions',
          contact: 'John Smith',
          email: 'john@abctech.com',
          phone: '+1-555-0123',
          source: 'LinkedIn',
          createdDate: '2024-01-20',
          createdBy: 'pcf2@seereon.com',
          status: 'new',
          value: '$50,000'
        }
      ]
    },
    {
      duplicateKey: '+1-555-0456',
      reason: 'phone',
      leads: [
        {
          id: '3',
          company: 'XYZ Solutions',
          contact: 'Sarah Johnson',
          email: 'sarah@xyz.com',
          phone: '+1-555-0456',
          source: 'Referral',
          createdDate: '2024-01-18',
          createdBy: 'pcf@seereon.com',
          status: 'new',
          value: '$75,000'
        },
        {
          id: '4',
          company: 'XYZ Corp',
          contact: 'Sarah J.',
          email: 'sarah.johnson@xyzcorp.com',
          phone: '+1-555-0456',
          source: 'Email',
          createdDate: '2024-01-22',
          createdBy: 'pcf3@seereon.com',
          status: 'new',
          value: '$80,000'
        }
      ]
    }
  ]);

  const [selectedGroup, setSelectedGroup] = useState<DuplicateGroup | null>(null);
  const [showMergeModal, setShowMergeModal] = useState(false);

  const getDuplicateIcon = (reason: string) => {
    switch (reason) {
      case 'email':
        return <Mail className="h-5 w-5 text-red-600" />;
      case 'phone':
        return <Phone className="h-5 w-5 text-red-600" />;
      case 'company':
        return <Building className="h-5 w-5 text-red-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
    }
  };

  const handleMergeLeads = (group: DuplicateGroup, primaryLeadId: string) => {
    // Logic to merge duplicate leads
    setDuplicateGroups(prev => prev.filter(g => g.duplicateKey !== group.duplicateKey));
    setShowMergeModal(false);
    setSelectedGroup(null);
  };

  const handleIgnoreDuplicate = (groupKey: string) => {
    setDuplicateGroups(prev => prev.filter(g => g.duplicateKey !== groupKey));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Duplicate Lead Detection</h3>
          <p className="text-sm text-gray-600 mt-1">
            Review and manage potential duplicate leads in the system
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-red-600">
          <AlertTriangle className="h-4 w-4" />
          <span>{duplicateGroups.length} duplicate groups found</span>
        </div>
      </div>

      {duplicateGroups.length === 0 ? (
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Duplicates Found</h3>
          <p className="text-gray-500">All leads are unique. Great job maintaining clean data!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {duplicateGroups.map((group) => (
            <div key={group.duplicateKey} className="bg-white rounded-lg shadow-sm border-l-4 border-l-red-500 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getDuplicateIcon(group.reason)}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      Duplicate {group.reason}: {group.duplicateKey}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {group.leads.length} leads found with the same {group.reason}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedGroup(group);
                      setShowMergeModal(true);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center space-x-1"
                  >
                    <Merge className="h-4 w-4" />
                    <span>Merge</span>
                  </button>
                  <button
                    onClick={() => handleIgnoreDuplicate(group.duplicateKey)}
                    className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 flex items-center space-x-1"
                  >
                    <X className="h-4 w-4" />
                    <span>Ignore</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.leads.map((lead, index) => (
                  <div key={lead.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900">Lead #{index + 1}</h5>
                      <span className="text-xs text-gray-500">Created: {lead.createdDate}</span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Company:</span>
                        <span className="font-medium">{lead.company}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact:</span>
                        <span className="font-medium">{lead.contact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{lead.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{lead.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Value:</span>
                        <span className="font-medium">{lead.value}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Source:</span>
                        <span className="font-medium">{lead.source}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created by:</span>
                        <span className="font-medium">{lead.createdBy}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Merge Modal */}
      {showMergeModal && selectedGroup && (
        <MergeLeadsModal
          group={selectedGroup}
          onClose={() => {
            setShowMergeModal(false);
            setSelectedGroup(null);
          }}
          onMerge={handleMergeLeads}
        />
      )}
    </div>
  );
};

interface MergeLeadsModalProps {
  group: DuplicateGroup;
  onClose: () => void;
  onMerge: (group: DuplicateGroup, primaryLeadId: string) => void;
}

const MergeLeadsModal: React.FC<MergeLeadsModalProps> = ({ group, onClose, onMerge }) => {
  const [primaryLeadId, setPrimaryLeadId] = useState(group.leads[0].id);

  const handleMerge = () => {
    onMerge(group, primaryLeadId);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full m-4 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">Merge Duplicate Leads</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Select Primary Lead
            </h4>
            <p className="text-sm text-gray-600">
              Choose which lead should be kept as the primary record. Data from other leads will be merged into this one.
            </p>
          </div>

          <div className="space-y-4">
            {group.leads.map((lead) => (
              <div
                key={lead.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  primaryLeadId === lead.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setPrimaryLeadId(lead.id)}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={primaryLeadId === lead.id}
                    onChange={() => setPrimaryLeadId(lead.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Company:</span>
                        <div className="font-medium">{lead.company}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Contact:</span>
                        <div className="font-medium">{lead.contact}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Value:</span>
                        <div className="font-medium">{lead.value}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Created:</span>
                        <div className="font-medium">{lead.createdDate}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex space-x-4 pt-6 mt-6 border-t">
            <button
              onClick={handleMerge}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Merge Leads
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

export default DuplicateLeadDetection;
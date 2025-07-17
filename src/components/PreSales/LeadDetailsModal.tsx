import React, { useState } from 'react';
import { X, Edit, Save, Plus, Calendar, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';

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
  priority: string;
  followUpDate?: string;
  meetingScheduled?: string;
}

interface LeadDetailsModalProps {
  lead: Lead;
  onClose: () => void;
  onUpdate: (lead: Lead) => void;
  canEdit: boolean;
}

const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({ lead, onClose, onUpdate, canEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState(lead);
  const [newNote, setNewNote] = useState('');

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

  const handleSave = () => {
    onUpdate(editedLead);
    setIsEditing(false);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const updatedLead = {
        ...editedLead,
        projectNotes: [...editedLead.projectNotes, `${new Date().toLocaleDateString()}: ${newNote}`]
      };
      setEditedLead(updatedLead);
      setNewNote('');
    }
  };

  const handlePlatformChange = (platform: string, checked: boolean) => {
    if (checked) {
      setEditedLead({
        ...editedLead,
        interestedPlatforms: [...editedLead.interestedPlatforms, platform]
      });
    } else {
      setEditedLead({
        ...editedLead,
        interestedPlatforms: editedLead.interestedPlatforms.filter(p => p !== platform)
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full m-4 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">Lead Details - {lead.company}</h3>
          <div className="flex items-center space-x-2">
            {canEdit && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center space-x-1"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
            )}
            {isEditing && (
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 flex items-center space-x-1"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Basic Information</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedLead.company}
                    onChange={(e) => setEditedLead({...editedLead, company: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{lead.company}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedLead.industry}
                    onChange={(e) => setEditedLead({...editedLead, industry: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{lead.industry}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedLead.contact}
                    onChange={(e) => setEditedLead({...editedLead, contact: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{lead.contact}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{lead.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-gray-900">{lead.phone}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900">Lead Details</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <p className="text-gray-900 capitalize">{lead.status}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <p className="text-gray-900 capitalize">{lead.priority}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <p className="text-gray-900">{lead.source}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Created</label>
                <p className="text-gray-900">{lead.date}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Activity</label>
                <p className="text-gray-900">{lead.lastActivity || 'No activity yet'}</p>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              Financial Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Potential Value</label>
                <p className="text-gray-900 font-semibold">{lead.value}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Quotation</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedLead.clientQuotation || ''}
                    onChange={(e) => setEditedLead({...editedLead, clientQuotation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="$50,000"
                  />
                ) : (
                  <p className="text-gray-900">{lead.clientQuotation || 'Not set'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Final Quotation</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedLead.finalQuotation || ''}
                    onChange={(e) => setEditedLead({...editedLead, finalQuotation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="$45,000"
                  />
                ) : (
                  <p className="text-gray-900">{lead.finalQuotation || 'Not set'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Interested Platforms */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Interested Platforms</h4>
            {isEditing ? (
              <div className="space-y-2">
                {platforms.map(platform => (
                  <label key={platform} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editedLead.interestedPlatforms.includes(platform)}
                      onChange={(e) => handlePlatformChange(platform, e.target.checked)}
                      className="mr-2"
                    />
                    {platform}
                  </label>
                ))}
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custom Platform</label>
                  <input
                    type="text"
                    value={editedLead.customPlatform || ''}
                    onChange={(e) => setEditedLead({...editedLead, customPlatform: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter custom platform"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {lead.interestedPlatforms.map(platform => (
                  <span key={platform} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {platform}
                  </span>
                ))}
                {lead.customPlatform && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {lead.customPlatform}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Agreements */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Agreements</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={editedLead.slaAgreed}
                    onChange={(e) => setEditedLead({...editedLead, slaAgreed: e.target.checked})}
                    className="mr-2"
                  />
                ) : (
                  lead.slaAgreed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )
                )}
                <span className="text-sm font-medium">SLA Agreed</span>
              </div>
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={editedLead.ndaSigned}
                    onChange={(e) => setEditedLead({...editedLead, ndaSigned: e.target.checked})}
                    className="mr-2"
                  />
                ) : (
                  lead.ndaSigned ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )
                )}
                <span className="text-sm font-medium">NDA Signed</span>
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Scheduling
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedLead.followUpDate || ''}
                    onChange={(e) => setEditedLead({...editedLead, followUpDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{lead.followUpDate || 'Not scheduled'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Scheduled</label>
                {isEditing ? (
                  <input
                    type="datetime-local"
                    value={editedLead.meetingScheduled || ''}
                    onChange={(e) => setEditedLead({...editedLead, meetingScheduled: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{lead.meetingScheduled || 'Not scheduled'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Project Notes */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Project Notes</h4>
            <div className="space-y-3">
              {editedLead.projectNotes.map((note, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700">{note}</p>
                </div>
              ))}
              {canEdit && (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a new note..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddNote}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Assignment Information */}
          {lead.assignedTo && (
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Assignment Information</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  <p className="text-gray-900">{lead.assignedTo}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned By</label>
                  <p className="text-gray-900">{lead.assignedBy}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Date</label>
                  <p className="text-gray-900">{lead.assignedDate}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsModal;
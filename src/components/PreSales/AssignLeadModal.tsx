import React, { useState } from 'react';
import { X, User, Building, Mail, Phone, Calendar, DollarSign } from 'lucide-react';

interface Lead {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  interest: string;
  description: string;
  status: string;
  createdAt: string;
  assignedTo?: string;
}

interface AssignLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onAssign: (leadId: string, salesPersonId: string) => void;
}

const salesPersons = [
  { id: '1', name: 'John Smith', email: 'john@company.com' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@company.com' },
  { id: '3', name: 'Mike Davis', email: 'mike@company.com' },
];

export default function AssignLeadModal({ isOpen, onClose, lead, onAssign }: AssignLeadModalProps) {
  const [selectedSalesPerson, setSelectedSalesPerson] = useState('');

  if (!isOpen || !lead) return null;

  const handleAssign = () => {
    if (selectedSalesPerson) {
      onAssign(lead.id, selectedSalesPerson);
      setSelectedSalesPerson('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Assign Lead to Sales</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Lead Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Lead Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Building className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Company</p>
                <p className="font-medium">{lead.companyName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Contact Person</p>
                <p className="font-medium">{lead.contactPerson}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{lead.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{lead.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Interest</p>
                <p className="font-medium">{lead.interest}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Created</p>
                <p className="font-medium">{new Date(lead.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          {lead.description && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Description</p>
              <p className="font-medium">{lead.description}</p>
            </div>
          )}
        </div>

        {/* Sales Person Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Sales Person
          </label>
          <select
            value={selectedSalesPerson}
            onChange={(e) => setSelectedSalesPerson(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a sales person...</option>
            {salesPersons.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name} ({person.email})
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedSalesPerson}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Assign Lead
          </button>
        </div>
      </div>
    </div>
  );
}
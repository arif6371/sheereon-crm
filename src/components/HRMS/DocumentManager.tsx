import React, { useState } from 'react';
import { Upload, Download, Eye, Trash2, FileText, Shield, User } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../../contexts/AuthContext';

interface Document {
  id: string;
  name: string;
  type: 'resume' | 'offer_letter' | 'contract' | 'id_proof' | 'other';
  employeeId: number;
  employeeName: string;
  uploadDate: string;
  size: string;
  uploadedBy: string;
  isConfidential: boolean;
}

interface Employee {
  id: number;
  userId: string;
  name: string;
  department: string;
}

interface DocumentManagerProps {
  employees: Employee[];
}

const DocumentManager: React.FC<DocumentManagerProps> = ({ employees }) => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'John_Doe_Resume.pdf',
      type: 'resume',
      employeeId: 1,
      employeeName: 'John Doe',
      uploadDate: '2024-01-15',
      size: '2.3 MB',
      uploadedBy: 'hr@seereon.com',
      isConfidential: true
    },
    {
      id: '2',
      name: 'Jane_Smith_Offer_Letter.pdf',
      type: 'offer_letter',
      employeeId: 2,
      employeeName: 'Jane Smith',
      uploadDate: '2024-01-10',
      size: '1.8 MB',
      uploadedBy: 'hr@seereon.com',
      isConfidential: true
    },
    {
      id: '3',
      name: 'Mike_Johnson_Contract.pdf',
      type: 'contract',
      employeeId: 3,
      employeeName: 'Mike Johnson',
      uploadDate: '2024-01-20',
      size: '3.1 MB',
      uploadedBy: 'admin@seereon.com',
      isConfidential: true
    }
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');

  const documentTypes = [
    { value: 'resume', label: 'Resume', icon: FileText },
    { value: 'offer_letter', label: 'Offer Letter', icon: FileText },
    { value: 'contract', label: 'Contract', icon: FileText },
    { value: 'id_proof', label: 'ID Proof', icon: Shield },
    { value: 'other', label: 'Other', icon: FileText }
  ];

  const canViewDocument = (document: Document) => {
    if (user?.role === 'Admin' || user?.role === 'HR') return true;
    if (document.employeeId.toString() === user?.id) return true;
    return false;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesEmployee = selectedEmployee === null || doc.employeeId === selectedEmployee;
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    const hasAccess = canViewDocument(doc);
    return matchesEmployee && matchesType && hasAccess;
  });

  const getTypeIcon = (type: string) => {
    const docType = documentTypes.find(dt => dt.value === type);
    const Icon = docType?.icon || FileText;
    return <Icon className="h-5 w-5" />;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'resume': return 'bg-blue-100 text-blue-800';
      case 'offer_letter': return 'bg-green-100 text-green-800';
      case 'contract': return 'bg-purple-100 text-purple-800';
      case 'id_proof': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = (document: Document) => {
    // Mock download functionality
    console.log('Downloading:', document.name);
  };

  const handleDelete = (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Document Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resumes</p>
              <p className="text-2xl font-bold text-blue-600">
                {documents.filter(d => d.type === 'resume').length}
              </p>
            </div>
            <User className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Contracts</p>
              <p className="text-2xl font-bold text-purple-600">
                {documents.filter(d => d.type === 'contract').length}
              </p>
            </div>
            <FileText className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confidential</p>
              <p className="text-2xl font-bold text-red-600">
                {documents.filter(d => d.isConfidential).length}
              </p>
            </div>
            <Shield className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters and Upload */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <select
              value={selectedEmployee || ''}
              onChange={(e) => setSelectedEmployee(e.target.value ? parseInt(e.target.value) : null)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Employees</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.userId})
                </option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          {(user?.role === 'Admin' || user?.role === 'HR') && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Document</span>
            </button>
          )}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => (
          <div key={document.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getTypeIcon(document.type)}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 truncate max-w-32">
                    {document.name}
                  </h3>
                  <p className="text-xs text-gray-500">{document.size}</p>
                </div>
              </div>
              {document.isConfidential && (
                <Shield className="h-4 w-4 text-red-500" title="Confidential" />
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Employee:</span>
                <span className="text-xs font-medium text-gray-900">{document.employeeName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Type:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(document.type)}`}>
                  {documentTypes.find(dt => dt.value === document.type)?.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Uploaded:</span>
                <span className="text-xs text-gray-900">{document.uploadDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">By:</span>
                <span className="text-xs text-gray-900">{document.uploadedBy}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleDownload(document)}
                className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span className="text-xs">Download</span>
              </button>
              <button className="flex-1 bg-gray-50 text-gray-600 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center space-x-1">
                <Eye className="h-4 w-4" />
                <span className="text-xs">View</span>
              </button>
              {(user?.role === 'Admin' || user?.role === 'HR') && (
                <button
                  onClick={() => handleDelete(document.id)}
                  className="bg-red-50 text-red-600 px-3 py-2 rounded-md hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-500">No documents match your current filters.</p>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <UploadDocumentModal
          employees={employees}
          onClose={() => setShowUploadModal(false)}
          onUpload={(newDocument) => {
            setDocuments(prev => [...prev, newDocument]);
            setShowUploadModal(false);
          }}
        />
      )}
    </div>
  );
};

interface UploadDocumentModalProps {
  employees: Employee[];
  onClose: () => void;
  onUpload: (document: Document) => void;
}

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({ employees, onClose, onUpload }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    employeeId: '',
    type: '',
    isConfidential: true
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const documentTypes = [
    { value: 'resume', label: 'Resume' },
    { value: 'offer_letter', label: 'Offer Letter' },
    { value: 'contract', label: 'Contract' },
    { value: 'id_proof', label: 'ID Proof' },
    { value: 'other', label: 'Other' }
  ];

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile || !formData.employeeId || !formData.type) return;

    const employee = employees.find(emp => emp.id === parseInt(formData.employeeId));
    if (!employee) return;

    const newDocument: Document = {
      id: Date.now().toString(),
      name: uploadedFile.name,
      type: formData.type as any,
      employeeId: employee.id,
      employeeName: employee.name,
      uploadDate: new Date().toISOString().split('T')[0],
      size: `${(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadedBy: user?.email || '',
      isConfidential: formData.isConfidential
    };

    onUpload(newDocument);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Document</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee
              </label>
              <select
                value={formData.employeeId}
                onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.userId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select type</option>
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document File
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                {uploadedFile ? (
                  <div>
                    <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600">
                      {isDragActive ? 'Drop the file here' : 'Click or drag to upload document'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, DOC, DOCX, or image files
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="confidential"
                checked={formData.isConfidential}
                onChange={(e) => setFormData(prev => ({ ...prev, isConfidential: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="confidential" className="text-sm text-gray-700">
                Mark as confidential
              </label>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={!uploadedFile || !formData.employeeId || !formData.type}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Upload Document
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

export default DocumentManager;
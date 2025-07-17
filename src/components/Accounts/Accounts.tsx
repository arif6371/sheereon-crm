import React, { useState } from 'react';
import { DollarSign, FileText, TrendingUp, Calendar, Plus, Download } from 'lucide-react';

const Accounts: React.FC = () => {
  const [activeTab, setActiveTab] = useState('invoices');

  const invoices = [
    {
      id: 'INV-001',
      client: 'ABC Corp',
      amount: '$45,000',
      dueDate: '2024-02-15',
      status: 'paid',
      issueDate: '2024-01-15'
    },
    {
      id: 'INV-002',
      client: 'XYZ Solutions',
      amount: '$32,000',
      dueDate: '2024-02-20',
      status: 'pending',
      issueDate: '2024-01-20'
    },
    {
      id: 'INV-003',
      client: 'Tech Innovators',
      amount: '$58,000',
      dueDate: '2024-02-10',
      status: 'overdue',
      issueDate: '2024-01-10'
    }
  ];

  const expenses = [
    {
      id: 'EXP-001',
      category: 'Office Rent',
      amount: '$12,000',
      date: '2024-01-01',
      description: 'Monthly office rent payment',
      status: 'approved'
    },
    {
      id: 'EXP-002',
      category: 'Software License',
      amount: '$8,500',
      date: '2024-01-15',
      description: 'Annual software license renewal',
      status: 'approved'
    },
    {
      id: 'EXP-003',
      category: 'Travel',
      amount: '$3,200',
      date: '2024-01-18',
      description: 'Client meeting travel expenses',
      status: 'pending'
    }
  ];

  const financialData = [
    { month: 'Jan', revenue: 450000, expenses: 320000, profit: 130000 },
    { month: 'Feb', revenue: 520000, expenses: 380000, profit: 140000 },
    { month: 'Mar', revenue: 480000, expenses: 340000, profit: 140000 },
    { month: 'Apr', revenue: 600000, expenses: 420000, profit: 180000 },
    { month: 'May', revenue: 580000, expenses: 410000, profit: 170000 },
    { month: 'Jun', revenue: 650000, expenses: 450000, profit: 200000 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Accounts & Finance</h1>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>New Invoice</span>
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$2.4M</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">$90K</p>
            </div>
            <FileText className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold text-gray-900">$580K</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profit Margin</p>
              <p className="text-2xl font-bold text-gray-900">24%</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'invoices'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Invoices
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'expenses'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Expenses
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'reports'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Reports
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Issue Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.issueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                      <button className="text-green-600 hover:text-green-900">Download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expense ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {expense.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expense.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(expense.status)}`}>
                        {expense.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Monthly Performance</h4>
                {financialData.map((month, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-900">{month.month}</div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-sm font-bold text-green-600">${(month.revenue / 1000).toFixed(0)}K</div>
                        <div className="text-xs text-gray-500">Revenue</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-red-600">${(month.expenses / 1000).toFixed(0)}K</div>
                        <div className="text-xs text-gray-500">Expenses</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-blue-600">${(month.profit / 1000).toFixed(0)}K</div>
                        <div className="text-xs text-gray-500">Profit</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Quick Reports</h4>
                <div className="space-y-3">
                  <button className="w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
                    <div className="font-medium text-blue-900">Monthly P&L Statement</div>
                    <div className="text-sm text-blue-600">Profit and Loss overview</div>
                  </button>
                  <button className="w-full p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
                    <div className="font-medium text-green-900">Cash Flow Report</div>
                    <div className="text-sm text-green-600">Income and expenses flow</div>
                  </button>
                  <button className="w-full p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
                    <div className="font-medium text-purple-900">Tax Summary</div>
                    <div className="text-sm text-purple-600">Tax obligations and deductions</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
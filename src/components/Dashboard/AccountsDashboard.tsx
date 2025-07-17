import React from 'react';
import { DollarSign, TrendingUp, FileText, Clock } from 'lucide-react';
import StatsCard from './StatsCard';

const AccountsDashboard: React.FC = () => {
  const stats = [
    {
      name: 'Monthly Revenue',
      value: '$2.4M',
      change: '+15%',
      changeType: 'positive' as const,
      icon: DollarSign
    },
    {
      name: 'Outstanding Invoices',
      value: '23',
      change: '-8%',
      changeType: 'positive' as const,
      icon: FileText
    },
    {
      name: 'Overdue Payments',
      value: '5',
      change: '+2',
      changeType: 'negative' as const,
      icon: Clock
    },
    {
      name: 'Profit Margin',
      value: '24%',
      change: '+3%',
      changeType: 'positive' as const,
      icon: TrendingUp
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatsCard key={stat.name} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Payment from ABC Corp</p>
                <p className="text-xs text-gray-500">Invoice #INV-001</p>
              </div>
              <span className="text-sm font-medium text-green-600">+$45,000</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Office Rent</p>
                <p className="text-xs text-gray-500">Monthly expense</p>
              </div>
              <span className="text-sm font-medium text-red-600">-$12,000</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Software License</p>
                <p className="text-xs text-gray-500">Annual payment</p>
              </div>
              <span className="text-sm font-medium text-red-600">-$8,500</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Actions</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Invoice Review</p>
                <p className="text-xs text-gray-500">5 invoices pending approval</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700">Review</button>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Overdue Follow-up</p>
                <p className="text-xs text-gray-500">3 clients with overdue payments</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700">Contact</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsDashboard;
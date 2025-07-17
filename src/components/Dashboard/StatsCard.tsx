import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: LucideIcon;
}

const StatsCard: React.FC<StatsCardProps> = ({ name, value, change, changeType, icon: Icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{name}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className={`text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
            {change} from last month
          </p>
        </div>
        <div className="p-3 bg-gray-50 rounded-full">
          <Icon className="h-6 w-6 text-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
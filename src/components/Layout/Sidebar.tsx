import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Home, 
  Users, 
  TrendingUp, 
  FolderOpen, 
  UserCheck, 
  Calculator,
  User,
  X,
  Bell,
  Calendar,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
      { name: 'Calendar', href: '/calendar', icon: Calendar },
      { name: 'Notices', href: '/notices', icon: Bell },
      { name: 'Profile', href: '/profile', icon: User }
    ];

    const roleBasedItems = [];

    if (user?.role === 'Admin') {
      roleBasedItems.push(
        { name: 'PreSales', href: '/presales', icon: TrendingUp },
        { name: 'Sales', href: '/sales', icon: TrendingUp },
        { name: 'Projects', href: '/projects', icon: FolderOpen },
        { name: 'HRMS', href: '/hrms', icon: UserCheck },
        { name: 'Accounts', href: '/accounts', icon: Calculator },
        { name: 'User Management', href: '/admin/users', icon: Settings }
      );
    } else if (user?.role === 'PCF') {
      roleBasedItems.push(
        { name: 'PreSales', href: '/presales', icon: TrendingUp }
      );
    } else if (user?.role === 'SALES') {
      roleBasedItems.push(
        { name: 'Sales', href: '/sales', icon: TrendingUp }
      );
    } else if (user?.role === 'DEV' || user?.role === 'DM') {
      roleBasedItems.push(
        { name: 'Projects', href: '/projects', icon: FolderOpen }
      );
    } else if (user?.role === 'HR') {
      roleBasedItems.push(
        { name: 'HRMS', href: '/hrms', icon: UserCheck }
      );
    } else if (user?.role === 'Accounts') {
      roleBasedItems.push(
        { name: 'Accounts', href: '/accounts', icon: Calculator }
      );
    }

    return [...baseItems, ...roleBasedItems];
  };

  const navigation = getNavigationItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 lg:hidden z-40" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Seereon</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-4 mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Navigation
            </p>
          </div>
          <ul className="space-y-2 px-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={onClose}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
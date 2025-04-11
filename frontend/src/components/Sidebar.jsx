import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  UserGroupIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

function Sidebar() {
  const navigation = [
    { name: 'Home', to: '/', icon: HomeIcon },
    { name: 'Backlogs', to: '/backlogs', icon: ClipboardDocumentListIcon },
    { name: 'Kanban Board', to: '/kanban', icon: ViewColumnsIcon },
    { name: 'Dashboard', to: '/dashboard', icon: Squares2X2Icon },
  ];

  const bottomNavigation = [
    { name: 'Team', to: '/team', icon: UserGroupIcon },
    { name: 'Settings', to: '/settings', icon: CogIcon },
    { name: 'Logout', to: '/login', icon: ArrowLeftOnRectangleIcon },
  ];

  return (
    <motion.div 
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="w-72 bg-white border-r border-gray-200 h-screen flex flex-col"
    >
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <img src="/logo.svg" alt="Work Nest" className="h-8 w-8" />
          <h1 className="text-xl font-bold text-gray-900">Work Nest</h1>
        </div>
        
        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-200">
        <nav className="space-y-1">
          {bottomNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </motion.div>
  );
}

export default Sidebar;
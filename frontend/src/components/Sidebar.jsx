import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  Squares2X2Icon,
  UserGroupIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

function Sidebar() {
  const navigation = [
    { name: 'Home', to: '/', icon: HomeIcon },
    { name: 'Dashboard', to: '/dashboard', icon: Squares2X2Icon },
  ];

  const bottomNavigation = [
    { name: 'Team', to: '/team', icon: UserGroupIcon },
    { name: 'Settings', to: '/settings', icon: CogIcon },
    { name: 'Logout', to: '/login', icon: ArrowLeftOnRectangleIcon },
  ];

  return (
    <motion.div 
  initial={{ x: -400 }}
  animate={{ x: 0 }}
  className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col"
>
  <div className="flex-1 pt-20 p-6 overflow-y-hidden">
    <nav className="space-y-1">
      {navigation.map((item) => (
        <NavLink key={item.name} to={item.to} className={({ isActive }) =>
          `flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
            isActive ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-gray-50"
          }`
        }>
          <item.icon className="w-5 h-5 mr-3" />
          {item.name}
        </NavLink>
      ))}
    </nav>
  </div>

  <div className="p-3 border-t border-gray-200 flex-none">
    <nav className="space-y-1">
      {bottomNavigation.map((item) => (
        <NavLink key={item.name} to={item.to} className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
          <item.icon className="w-5 h-5 mr-0" />
          {item.name}
        </NavLink>
      ))}
    </nav>
  </div>
</motion.div>
  );
}

export default Sidebar;

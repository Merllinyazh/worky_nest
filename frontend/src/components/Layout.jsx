import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

function Layout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 overflow-auto pt-14" // pt-14 to account for fixed Navbar height
        >
          <div className="max-w-7xl mx-auto px-8 py-6">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
}

export default Layout;

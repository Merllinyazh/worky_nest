import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

function Layout() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* Sidebar stays fixed */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col ml-60 overflow-hidden">
        
        {/* Sticky header */}
        <div className="flex-none sticky top-0 z-10 bg-gray-50 shadow-sm">
          <Navbar />
        </div>

        {/* Scrollable content area */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 overflow-auto p-4"
        >
          <div className="max-w-50xl mx-auto px-0 py-3">
            <Outlet />
          </div>
        </motion.main>

      </div>
    </div>
  );
}

export default Layout;

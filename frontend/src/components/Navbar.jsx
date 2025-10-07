import React from 'react';
import { Bell, User, Search } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="w-full bg-white h-16 flex items-center justify-between px-6 shadow-md fixed top-0 left-0 z-50">
      {/* Logo & Title */}
      <div className="flex items-center space-x-2">
        <img
          src="/logoimg.jpg" // Make sure this matches your actual logo path
          alt="logo"
          className="h-6 w-6"
        />
        <span className="text-purple-700 font-semibold text-sm tracking-wide">
          WOrKy NeST
        </span>
      </div>

      {/* Search Bar */}
      <div className="flex-1 flex justify-center px-4">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-1.5 pl-8 pr-4 rounded-full bg-gray-100 focus:outline-none text-sm"
          />
          <Search className="absolute left-2 top-1.5 h-4 w-4 text-purple-600" />
        </div>
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-4">
        <Bell className="text-purple-600 h-5 w-5 cursor-pointer" />
        <User className="text-purple-600 h-5 w-5 cursor-pointer" />
      </div>
    </nav>
  );
};

export default Navbar;

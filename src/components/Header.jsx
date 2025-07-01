import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from './UserMenu';
import * as FiIcons from 'react-icons/fi';

const { FiBookOpen, FiHome, FiFileText, FiUser } = FiIcons;

const Header = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: FiHome },
    { path: '/documents', label: 'Documentos', icon: FiFileText }
  ];

  return (
    <motion.header
      className="bg-white shadow-lg border-b border-gray-200"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <SafeIcon icon={FiBookOpen} className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">DocVersion</h1>
              <p className="text-xs text-gray-600">Control de Versiones Académico</p>
            </div>
          </Link>

          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <SafeIcon icon={item.icon} className="text-lg" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="bg-primary-100 p-2 rounded-full">
                <SafeIcon icon={FiUser} className="text-primary-600" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <UserMenu onClose={() => setShowUserMenu(false)} />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 py-2">
          <nav className="flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                <SafeIcon icon={item.icon} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiSettings, FiLogOut, FiMail, FiGraduationCap, FiBuilding } = FiIcons;

const UserMenu = ({ onClose }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <motion.div
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50"
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-100 p-3 rounded-full">
            <SafeIcon icon={FiUser} className="text-primary-600 text-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
            <p className="text-sm text-gray-600 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {user?.profile && (
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Información Académica</h3>
          <div className="space-y-2">
            {user.profile.institution && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <SafeIcon icon={FiBuilding} className="text-gray-400" />
                <span>{user.profile.institution}</span>
              </div>
            )}
            {user.profile.degree && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <SafeIcon icon={FiGraduationCap} className="text-gray-400" />
                <span className="capitalize">{user.profile.degree}</span>
              </div>
            )}
            {user.profile.field && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <SafeIcon icon={FiUser} className="text-gray-400" />
                <span>{user.profile.field}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="p-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <SafeIcon icon={FiLogOut} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </motion.div>
  );
};

export default UserMenu;
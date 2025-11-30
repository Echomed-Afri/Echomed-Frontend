import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Bell, User, LogOut } from 'lucide-react';

type Props = {
  onLanguageToggle: () => void;
  onProfile: () => void;
  onLogout: () => void;
};

const PatientHeaderActions: React.FC<Props> = ({ onLanguageToggle, onProfile, onLogout }) => {
  return (
    <div className="flex items-center space-x-3">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onLanguageToggle}
        className="p-2 bg-emerald-100 rounded-full"
      >
        <Globe className="w-5 h-5 text-emerald-600" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 bg-gray-100 rounded-full"
      >
        <Bell className="w-5 h-5 text-gray-600" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onProfile}
        className="p-2 bg-gray-100 rounded-full"
      >
        <User className="w-5 h-5 text-gray-600" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onLogout}
        className="p-2 bg-red-100 rounded-full hover:bg-red-200"
      >
        <LogOut className="w-5 h-5 text-red-600" />
      </motion.button>
    </div>
  );
};

export default PatientHeaderActions;

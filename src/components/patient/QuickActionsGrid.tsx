import React from 'react';
import { motion } from 'framer-motion';

export type QuickAction = {
  key: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  screen: string;
};

type Props = {
  actions: QuickAction[];
  onActionClick: (screen: string) => void;
  translate: (key: string) => string;
};

const QuickActionsGrid: React.FC<Props> = ({ actions, onActionClick, translate }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {actions.map((action, index) => (
        <motion.button
          key={action.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onActionClick(action.screen)}
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3`}>
            <action.icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 text-left">
            {translate(action.key)}
          </h3>
        </motion.button>
      ))}
    </div>
  );
};

export default QuickActionsGrid;

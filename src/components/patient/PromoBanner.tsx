import React from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';

type Props = {
  title: string;
  subtitle?: string;
};

const PromoBanner: React.FC<Props> = ({ title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-4 text-white"
    >
      <div className="flex items-center space-x-3">
        <Gift className="w-6 h-6" />
        <div>
          <p className="font-semibold">{title}</p>
          {subtitle && <p className="text-sm opacity-90">{subtitle}</p>}
        </div>
      </div>
    </motion.div>
  );
};

export default PromoBanner;

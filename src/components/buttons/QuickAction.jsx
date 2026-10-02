import React from 'react';
import { motion } from 'framer-motion';

export default function QuickAction({ icon: Icon, label, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 p-4 bg-white border border-neutral-100 rounded-xl shadow-sm hover:shadow-md hover:border-blue-100 transition-all text-neutral-700 hover:text-blue-600 group w-full"
    >
      <div className="p-3 bg-neutral-50 group-hover:bg-blue-50 rounded-full transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-xs font-semibold text-center leading-tight">{label}</span>
    </motion.button>
  );
}

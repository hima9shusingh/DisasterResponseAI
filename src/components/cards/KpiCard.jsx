import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, AlertTriangle, Flame, LifeBuoy, Truck, Tent, Users } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const icons = {
  AlertTriangle,
  Flame,
  LifeBuoy,
  Truck,
  Tent,
  Users
};

export default function KpiCard({ title, value, icon, change, isPositive, className }) {
  const Icon = icons[icon] || AlertTriangle;
  const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={twMerge(
        'bg-white rounded-xl p-5 shadow-sm border border-neutral-100 flex flex-col justify-between relative overflow-hidden',
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-neutral-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div className={clsx(
          "flex items-center text-xs font-semibold px-2 py-1 rounded-full",
          isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        )}>
          <ChangeIcon className="w-3 h-3 mr-1" />
          {change}
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-neutral-800 tracking-tight">{value}</h3>
        <p className="text-sm text-neutral-500 font-medium mt-1">{title}</p>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-50 rounded-full opacity-50 pointer-events-none" />
    </motion.div>
  );
}

import React from 'react';
import { clsx } from 'clsx';
import { Package, Droplets, Pill, Bed } from 'lucide-react';

export default function SupplyCard({ type, inventory }) {
  const icons = {
    food: <Package className="w-5 h-5" />,
    water: <Droplets className="w-5 h-5" />,
    medicine: <Pill className="w-5 h-5" />,
    blankets: <Bed className="w-5 h-5" />
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Good': return 'bg-green-100 text-green-700';
      case 'Moderate': return 'bg-yellow-100 text-yellow-700';
      case 'Low': return 'bg-orange-100 text-orange-700';
      case 'Critical': return 'bg-red-100 text-red-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-neutral-100 rounded-lg text-neutral-600">
            {icons[type.toLowerCase()]}
          </div>
          <h3 className="font-bold text-neutral-800 capitalize">{type}</h3>
        </div>
        <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider", getStatusColor(inventory.status))}>
          {inventory.status}
        </span>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Current Stock</p>
          <p className="text-xl font-extrabold text-neutral-900">{inventory.stock}</p>
        </div>
        <div className="flex justify-between border-t border-neutral-100 pt-3 text-xs">
          <div>
            <p className="text-neutral-500 font-semibold mb-0.5">Daily Usage</p>
            <p className="font-bold text-neutral-800">{inventory.dailyUsage}</p>
          </div>
          <div className="text-right">
            <p className="text-neutral-500 font-semibold mb-0.5">Estimated Remaining</p>
            <p className={clsx("font-bold", inventory.daysRemaining < 3 ? 'text-red-600' : 'text-neutral-800')}>
              {inventory.daysRemaining} days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { clsx } from 'clsx';
import { Edit2, PackagePlus, ArrowRightLeft } from 'lucide-react';

export default function InventoryTable({ items, onUpdateStock, onTransferStock }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Available': return 'bg-green-100 text-green-700';
      case 'Moderate': return 'bg-blue-100 text-blue-700';
      case 'Low': return 'bg-orange-100 text-orange-700';
      case 'Critical': return 'bg-red-100 text-red-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[1000px]">
          <thead>
            <tr className="bg-neutral-50 text-neutral-500 text-[10px] uppercase tracking-wider border-b border-neutral-100">
              <th className="p-4 font-semibold">Item & Category</th>
              <th className="p-4 font-semibold">Quantity</th>
              <th className="p-4 font-semibold">Camp / Location</th>
              <th className="p-4 font-semibold">Daily Consumption</th>
              <th className="p-4 font-semibold">Days Remaining</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-neutral-100">
            {items.map((item) => {
              const daysRemaining = item.dailyConsumption > 0 ? Math.floor(item.quantity / item.dailyConsumption) : '∞';
              
              return (
                <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-neutral-900">{item.item}</div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-0.5">{item.category}</div>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-neutral-800">{item.quantity}</span>
                    <span className="text-xs text-neutral-500 ml-1">{item.unit}</span>
                  </td>
                  <td className="p-4 text-xs font-semibold text-neutral-700">{item.camp}</td>
                  <td className="p-4 text-xs font-semibold text-neutral-700">{item.dailyConsumption}</td>
                  <td className="p-4 font-bold text-neutral-700">{daysRemaining}</td>
                  <td className="p-4">
                    <span className={clsx("px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider", getStatusColor(item.status))}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onUpdateStock(item)} title="Add Stock" className="p-1.5 text-neutral-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"><PackagePlus className="w-4 h-4" /></button>
                      <button onClick={() => onTransferStock(item)} title="Transfer Stock" className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><ArrowRightLeft className="w-4 h-4" /></button>
                      <button title="Edit Item" className="p-1.5 text-neutral-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr><td colSpan="7" className="p-8 text-center text-neutral-500 font-semibold text-sm">No inventory items found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

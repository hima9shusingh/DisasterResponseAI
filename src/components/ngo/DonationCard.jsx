import React from 'react';
import { clsx } from 'clsx';
import { IndianRupee, Package, CheckCircle2, ArrowRight } from 'lucide-react';

export default function DonationCard({ donation, onAssign }) {
  const isFinancial = donation.type === 'Financial';
  
  return (
    <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={clsx("p-2.5 rounded-xl", isFinancial ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600")}>
            {isFinancial ? <IndianRupee className="w-5 h-5" /> : <Package className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="font-bold text-neutral-900">{donation.donor}</h4>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-0.5">{donation.id} • {donation.type}</p>
          </div>
        </div>
        <span className={clsx(
          "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
          donation.status === 'Distributed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        )}>
          {donation.status}
        </span>
      </div>

      <div className="bg-neutral-50 rounded-xl p-4 mb-4">
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Amount / Quantity</p>
        <p className="text-xl font-extrabold text-neutral-800">{isFinancial ? `₹${donation.amount.toLocaleString()}` : donation.amount} <span className="text-sm text-neutral-500">{donation.unit}</span></p>
      </div>

      <div className="flex justify-between items-center text-xs font-semibold text-neutral-500 mb-4">
        <span>Received: {donation.receivedDate}</span>
        <span>Camp: {donation.assignedCamp}</span>
      </div>

      {donation.status === 'Pending' && (
        <button onClick={() => onAssign(donation.id)} className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-xs transition-colors border border-blue-200 flex items-center justify-center gap-1.5">
          Assign to Camp <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
      {donation.status === 'Assigned' && (
        <button onClick={() => onAssign(donation.id, true)} className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-bold text-xs transition-colors flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> Mark Distributed
        </button>
      )}
    </div>
  );
}

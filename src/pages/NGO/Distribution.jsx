import React from 'react';
import { useNGO } from '../../context/NGOContext';
import DistributionProgress from '../../components/ngo/DistributionProgress';
import { Package, Truck, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

export default function NGODistribution() {
  const { distribution } = useNGO();

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'In Progress': return <Truck className="w-5 h-5 text-blue-600" />;
      default: return <Package className="w-5 h-5 text-neutral-400" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Distribution Tracking</h1>
        <p className="text-sm text-neutral-500 mt-1 font-semibold">Monitor the delivery and distribution of relief supplies in real-time.</p>
      </div>

      <div className="space-y-4">
        {distribution.map(dist => (
          <div key={dist.id} className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col md:flex-row gap-6 items-center">
            
            <div className="flex items-center gap-4 w-full md:w-1/3">
              <div className={clsx("p-3 rounded-xl shrink-0", 
                dist.status === 'Completed' ? 'bg-green-50' : 
                dist.status === 'In Progress' ? 'bg-blue-50' : 'bg-neutral-50'
              )}>
                {getStatusIcon(dist.status)}
              </div>
              <div>
                <h3 className="font-bold text-neutral-900">{dist.item}</h3>
                <p className="text-xs font-semibold text-neutral-500 mt-1">To: {dist.camp} • Team: {dist.volunteerTeam}</p>
              </div>
            </div>

            <div className="w-full md:w-1/3 px-4">
              <DistributionProgress target={dist.target} current={dist.distributedTo} label="Distribution Progress" />
            </div>

            <div className="w-full md:w-1/3 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Time</p>
                <p className="text-sm font-semibold text-neutral-700">{new Date(dist.time).toLocaleString()}</p>
              </div>
              <span className={clsx(
                "px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider",
                dist.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                dist.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-neutral-100 text-neutral-700'
              )}>
                {dist.status}
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

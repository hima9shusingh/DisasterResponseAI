import React from 'react';
import NGOAnalyticsChart from '../../components/ngo/NGOAnalyticsChart';
import { Package, IndianRupee } from 'lucide-react';

export default function NGOAnalytics() {
  const consumptionData = [
    { name: 'Mon', food: 4000, water: 2400 },
    { name: 'Tue', food: 3000, water: 1398 },
    { name: 'Wed', food: 2000, water: 9800 },
    { name: 'Thu', food: 2780, water: 3908 },
    { name: 'Fri', food: 1890, water: 4800 },
    { name: 'Sat', food: 2390, water: 3800 },
    { name: 'Sun', food: 3490, water: 4300 },
  ];

  const donationData = [
    { name: 'Week 1', funds: 400000 },
    { name: 'Week 2', funds: 300000 },
    { name: 'Week 3', funds: 200000 },
    { name: 'Week 4', funds: 278000 },
    { name: 'Week 5', funds: 189000 },
    { name: 'Week 6', funds: 639000 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Analytics & Reports</h1>
        <p className="text-sm text-neutral-500 mt-1 font-semibold">Gain insights into relief consumption rates and financial inflows.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Inventory Consumption */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2"><Package className="w-4 h-4 text-blue-500" /> Weekly Consumption</h2>
          </div>
          <NGOAnalyticsChart 
            data={consumptionData} 
            dataKey1="food" 
            dataKey2="water" 
            color1="#3b82f6" 
            color2="#06b6d4" 
            label1="Food (kg)" 
            label2="Water (Liters)" 
          />
        </div>

        {/* Donation Inflow */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2"><IndianRupee className="w-4 h-4 text-green-500" /> Financial Donations</h2>
          </div>
          <NGOAnalyticsChart 
            data={donationData} 
            dataKey1="funds" 
            color1="#10b981" 
            label1="Funds Raised (INR)" 
          />
        </div>

      </div>

    </div>
  );
}

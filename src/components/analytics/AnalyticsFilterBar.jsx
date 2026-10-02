import React from 'react';
import { Filter, X } from 'lucide-react';

export default function AnalyticsFilterBar({ onFilterChange }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 flex flex-col md:flex-row gap-4 items-center">
      <div className="flex items-center gap-2 text-neutral-500 pr-4 md:border-r border-neutral-200">
        <Filter className="w-5 h-5" />
        <span className="text-sm font-bold uppercase tracking-wider">Filters</span>
      </div>

      <div className="flex-1 flex flex-wrap gap-4">
        <select className="flex-1 min-w-[140px] px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition-all">
          <option>Date Range: 30 Days</option>
          <option>7 Days</option>
          <option>90 Days</option>
          <option>1 Year</option>
          <option>Custom Range</option>
        </select>

        <select className="flex-1 min-w-[140px] px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition-all">
          <option>Region: All</option>
          <option>State</option>
          <option>District</option>
          <option>City</option>
        </select>

        <select className="flex-1 min-w-[140px] px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition-all">
          <option>Disaster: All</option>
          <option>Flood</option>
          <option>Fire</option>
          <option>Earthquake</option>
          <option>Cyclone</option>
        </select>

        <select className="flex-1 min-w-[140px] px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition-all">
          <option>Severity: All</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        <button className="flex-1 md:flex-none px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors">Apply Filters</button>
        <button className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-xl transition-colors" title="Reset Filters"><X className="w-5 h-5" /></button>
      </div>
    </div>
  );
}

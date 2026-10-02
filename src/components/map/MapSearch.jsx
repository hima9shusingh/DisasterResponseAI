import React from 'react';
import { Search } from 'lucide-react';
import { useMapData } from '../../context/MapContext';

export default function MapSearch() {
  const { searchQuery, setSearchQuery } = useMapData();

  return (
    <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-2 pointer-events-auto flex items-center gap-2">
      <Search className="w-5 h-5 text-neutral-400 ml-2" />
      <input 
        type="text" 
        placeholder="Search incidents or camps..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full py-1.5 px-2 outline-none text-sm font-semibold text-neutral-800 bg-transparent placeholder-neutral-400"
      />
    </div>
  );
}

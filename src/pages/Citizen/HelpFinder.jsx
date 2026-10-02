import React, { useState } from 'react';
import HelpMap from '../../components/map/HelpMap';
import { helpLocations } from '../../data/mock/citizenHelpMockData';
import { Search, MapPin, Phone, Crosshair, Filter, Navigation, X, Building2, User, HeartPulse, Droplet, Users } from 'lucide-react';
import { clsx } from 'clsx';

export default function HelpFinder() {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  const filters = ['All', 'Hospital', 'Police', 'Fire', 'Relief Camp'];

  const filteredLocations = helpLocations.filter(loc => {
    const matchesFilter = filter === 'All' || loc.type === filter;
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || loc.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="h-[calc(100vh-10rem)] max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
      
      {/* Left Panel: Search & List */}
      <div className="w-full md:w-96 flex flex-col h-full bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden shrink-0 relative z-10">
        
        {/* Search Header */}
        <div className="p-5 border-b border-neutral-100 bg-neutral-50 shrink-0">
          <h1 className="text-xl font-extrabold text-neutral-900 mb-4">Nearby Help</h1>
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search hospitals, camps..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide hide-scrollbar">
            {filters.map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors border",
                  filter === f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* List View (hidden if a location is selected on mobile, but always visible on desktop) */}
        <div className={clsx(
          "flex-1 overflow-y-auto p-4 space-y-3",
          selectedLocation ? "hidden md:block" : "block"
        )}>
          {filteredLocations.map(loc => (
            <div 
              key={loc.id}
              onClick={() => setSelectedLocation(loc)}
              className={clsx(
                "p-4 rounded-xl border transition-all cursor-pointer",
                selectedLocation?.id === loc.id ? "bg-blue-50 border-blue-200 shadow-sm" : "bg-white border-neutral-100 hover:border-blue-200"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-neutral-900 text-sm leading-tight">{loc.name}</h3>
                <span className="text-[10px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">{loc.distance}</span>
              </div>
              <p className="text-xs font-semibold text-blue-600 mb-2">{loc.type}</p>
              <div className="flex items-center gap-1 text-xs text-neutral-500 font-medium mb-1 line-clamp-1">
                <MapPin className="w-3.5 h-3.5" /> {loc.address}
              </div>
              <div className="flex items-center gap-1 text-xs text-neutral-500 font-medium">
                <Phone className="w-3.5 h-3.5" /> {loc.contact}
              </div>
            </div>
          ))}
          {filteredLocations.length === 0 && (
            <div className="text-center text-sm font-semibold text-neutral-500 py-8">
              No locations found.
            </div>
          )}
        </div>

        {/* Details Overlay Panel (Mobile: Full overlay over list, Desktop: Replaces list if wanted, or sits inside. Let's make it a full overlay over the left panel when selected) */}
        {selectedLocation && (
          <div className="absolute inset-0 z-20 bg-white flex flex-col animate-in slide-in-from-right-8 duration-200">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50 sticky top-0">
              <button onClick={() => setSelectedLocation(null)} className="p-1.5 text-neutral-500 hover:bg-neutral-200 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Details</span>
              <div className="w-8"></div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <div className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded mb-2">
                  {selectedLocation.type}
                </div>
                <h2 className="text-2xl font-black text-neutral-900 leading-tight mb-2">{selectedLocation.name}</h2>
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500 mb-1">
                  <MapPin className="w-4 h-4" /> {selectedLocation.address}
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-neutral-700">
                  <Crosshair className="w-4 h-4" /> {selectedLocation.distance} away
                </div>
              </div>

              <div className="flex gap-2">
                <a href={`tel:${selectedLocation.contact}`} className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                  <Phone className="w-4 h-4" /> Call
                </a>
                <button className="flex-1 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-blue-200">
                  <Navigation className="w-4 h-4" /> Directions
                </button>
              </div>

              <div className="border-t border-neutral-100 pt-6 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">Operational Status</h3>
                
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-neutral-600 flex items-center gap-2"><Building2 className="w-4 h-4" /> Status</span>
                    <span className="text-sm font-bold text-green-600">{selectedLocation.status}</span>
                  </div>
                  
                  {selectedLocation.type === 'Hospital' && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-neutral-600 flex items-center gap-2"><HeartPulse className="w-4 h-4" /> Emergency Dept</span>
                        <span className="text-sm font-bold text-neutral-900">{selectedLocation.details.emergencyDept}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-neutral-600 flex items-center gap-2"><User className="w-4 h-4" /> Available Beds</span>
                        <span className="text-sm font-bold text-neutral-900">{selectedLocation.details.bedsAvailable}</span>
                      </div>
                    </>
                  )}

                  {selectedLocation.type === 'Relief Camp' && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-neutral-600 flex items-center gap-2"><Users className="w-4 h-4" /> Occupancy</span>
                        <span className="text-sm font-bold text-neutral-900">{selectedLocation.details.occupied} / {selectedLocation.details.capacity}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-neutral-600 flex items-center gap-2"><Droplet className="w-4 h-4" /> Provisions</span>
                        <span className="text-sm font-bold text-neutral-900">{selectedLocation.details.food}</span>
                      </div>
                    </>
                  )}
                  
                  {selectedLocation.details.support && (
                    <div className="pt-2 border-t border-neutral-200">
                      <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Capabilities</span>
                      <p className="text-sm font-semibold text-neutral-700">{selectedLocation.details.support}</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Right Panel: Map */}
      <div className="flex-1 h-64 md:h-full bg-neutral-100 rounded-3xl relative z-0">
        <HelpMap 
          locations={filteredLocations} 
          selectedLocation={selectedLocation} 
          onSelectLocation={setSelectedLocation} 
        />
      </div>

    </div>
  );
}

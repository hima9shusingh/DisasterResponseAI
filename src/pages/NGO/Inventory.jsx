import React, { useState } from 'react';
import { useNGO } from '../../context/NGOContext';
import InventoryTable from '../../components/ngo/InventoryTable';
import StockUpdateModal from '../../components/ngo/StockUpdateModal';
import { Search, Plus, Loader2 } from 'lucide-react';

export default function NGOInventory() {
  const { camps, updateCampInventory, isInitializing } = useNGO();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const allInventoryItems = [];
  camps.forEach(camp => {
    Object.entries(camp.inventory || {}).forEach(([itemKey, quantity]) => {
      let status = 'Available';
      if (quantity < 20) status = 'Critical';
      else if (quantity < 50) status = 'Low';
      else if (quantity < 100) status = 'Moderate';
      
      const itemName = itemKey.charAt(0).toUpperCase() + itemKey.slice(1);
      allInventoryItems.push({
        id: `${camp._id}-${itemKey}`,
        campId: camp._id,
        itemKey: itemKey,
        item: itemName,
        category: itemName,
        quantity: quantity,
        camp: camp.name,
        status: status,
        unit: itemKey === 'water' ? 'L' : itemKey === 'food' ? 'kg' : 'units',
        dailyConsumption: '-'
      });
    });
  });

  const filteredInventory = allInventoryItems.filter(item => {
    const matchesSearch = item.item.toLowerCase().includes(searchTerm.toLowerCase()) || item.camp.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || item.category.toLowerCase().includes(filterCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Food', 'Water', 'Medicine', 'Blankets', 'Emergency Kits'];

  const handleOpenUpdate = (item) => {
    setSelectedItem(item);
    setIsUpdateModalOpen(true);
  };

  const handleSaveStock = async (campId, itemKey, quantityToAdd) => {
    try {
      await updateCampInventory(campId, itemKey, quantityToAdd, 'add');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update inventory');
    }
  };

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-neutral-500 font-semibold">Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Inventory Management</h1>
          <p className="text-sm text-neutral-500 mt-1 font-semibold">Track and update relief supplies across all locations.</p>
        </div>
        <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Inventory Item
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search items by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          />
        </div>
        <select 
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-sm min-w-[150px]"
        >
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <InventoryTable 
        items={filteredInventory} 
        onUpdateStock={handleOpenUpdate}
        onTransferStock={() => alert("Transfer logic mock")}
      />

      <StockUpdateModal 
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        item={selectedItem}
        onSave={handleSaveStock}
      />
    </div>
  );
}

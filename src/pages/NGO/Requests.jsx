import React, { useState } from 'react';
import { useNGO } from '../../context/NGOContext';
import SupplyRequestTable from '../../components/ngo/SupplyRequestTable';
import SupplyRequestModal from '../../components/ngo/SupplyRequestModal';
import { Plus, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function NGORequests() {
  const { requests, camps, updateRequestStatus, addSupplyRequest, isInitializing } = useNGO();
  const [searchParams] = useSearchParams();
  const defaultCampId = searchParams.get('campId') || '';
  const [isModalOpen, setIsModalOpen] = useState(!!defaultCampId);

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-neutral-500 font-semibold">Loading supply requests...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Supply Requests</h1>
          <p className="text-sm text-neutral-500 mt-1 font-semibold">Manage incoming requests from relief camps.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Request
        </button>
      </div>

      <SupplyRequestTable 
        requests={requests}
        onApprove={(id) => updateRequestStatus(id, 'approved')}
        onReject={(id) => updateRequestStatus(id, 'rejected')}
        onMarkTransit={(id) => updateRequestStatus(id, 'in_transit')}
        onMarkDelivered={(id) => updateRequestStatus(id, 'delivered')}
      />

      <SupplyRequestModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addSupplyRequest}
        camps={camps}
        defaultCampId={defaultCampId}
      />

    </div>
  );
}

import React from 'react';
import { clsx } from 'clsx';
import { CheckCircle2, XCircle, Truck, PackageCheck } from 'lucide-react';

export default function SupplyRequestTable({ requests, onApprove, onMarkTransit, onMarkDelivered, onReject }) {
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-blue-100 text-blue-700';
      case 'in_transit': return 'bg-orange-100 text-orange-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getPriorityColor = (p) => {
    if (p === 'critical') return 'text-red-600';
    if (p === 'high') return 'text-orange-600';
    return 'text-blue-600';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[1000px]">
          <thead>
            <tr className="bg-neutral-50 text-neutral-500 text-[10px] uppercase tracking-wider border-b border-neutral-100">
              <th className="p-4 font-semibold">Request ID / Camp</th>
              <th className="p-4 font-semibold">Item & Quantity</th>
              <th className="p-4 font-semibold">Priority</th>
              <th className="p-4 font-semibold">Reason</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-neutral-100">
            {requests.map((req) => (
              <tr key={req._id} className="hover:bg-neutral-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-neutral-900">{req.requestId}</div>
                  <div className="text-xs font-semibold text-neutral-500">{req.camp?.name || 'Unknown Camp'}</div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-neutral-800">{req.item}</div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase">{req.quantity} Units</div>
                </td>
                <td className="p-4">
                  <span className={clsx("text-xs font-bold uppercase tracking-wider", getPriorityColor(req.priority))}>
                    {req.priority}
                  </span>
                </td>
                <td className="p-4 text-xs text-neutral-600 max-w-[200px] truncate">{req.reason}</td>
                <td className="p-4">
                  <span className={clsx("px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider capitalize", getStatusColor(req.status))}>
                    {req.status?.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-1.5">
                    {req.status === 'pending' && (
                      <>
                        <button onClick={() => onApprove(req._id)} title="Approve" className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><CheckCircle2 className="w-4 h-4" /></button>
                        <button onClick={() => onReject(req._id)} title="Reject" className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><XCircle className="w-4 h-4" /></button>
                      </>
                    )}
                    {req.status === 'approved' && (
                      <button onClick={() => onMarkTransit(req._id)} title="Mark In Transit" className="p-1.5 text-neutral-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"><Truck className="w-4 h-4" /></button>
                    )}
                    {req.status === 'in_transit' && (
                      <button onClick={() => onMarkDelivered(req._id)} title="Mark Delivered" className="p-1.5 text-neutral-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"><PackageCheck className="w-4 h-4" /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr><td colSpan="6" className="p-8 text-center text-neutral-500 font-semibold text-sm">No supply requests found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

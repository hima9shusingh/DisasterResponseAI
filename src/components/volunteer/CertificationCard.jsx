import React from 'react';
import { Award, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

export default function CertificationCard({ cert }) {
  const isValid = cert.status === 'Valid';
  const isExpiring = cert.status === 'Expiring Soon';

  return (
    <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-neutral-900 mb-1">{cert.name}</h4>
          <p className="text-xs font-semibold text-neutral-500">{cert.issuedBy}</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
        <div className="flex gap-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Issued: {cert.issueDate}</span>
          <span className="flex items-center gap-1">Expires: {cert.expiry}</span>
        </div>
        
        <span className={clsx(
          "px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit",
          isValid ? "bg-green-100 text-green-700" : isExpiring ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
        )}>
          {isValid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
          {cert.status}
        </span>
      </div>
    </div>
  );
}

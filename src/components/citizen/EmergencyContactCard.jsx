import React from 'react';
import { Phone } from 'lucide-react';

export default function EmergencyContactCard({ contact }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex items-center justify-between hover:border-red-200 transition-colors group">
      <div>
        <h4 className="text-sm font-bold text-neutral-900">{contact.name}</h4>
        <p className="text-xs font-semibold text-neutral-500 mt-0.5">{contact.description}</p>
      </div>
      <a 
        href={`tel:${contact.number}`}
        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-sm font-bold transition-colors"
      >
        <Phone className="w-4 h-4" />
        {contact.number}
      </a>
    </div>
  );
}

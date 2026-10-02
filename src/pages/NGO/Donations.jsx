import React from 'react';
import { useNGO } from '../../context/NGOContext';
import DonationCard from '../../components/ngo/DonationCard';

export default function NGODonations() {
  const { donations, assignDonation, markDonationDistributed } = useNGO();

  const handleAssign = (id, isDistributed = false) => {
    if (isDistributed) {
      markDonationDistributed(id);
    } else {
      const camp = prompt("Enter camp to assign this donation to (e.g. RC-014):");
      if (camp) assignDonation(id, camp);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Donation Management</h1>
        <p className="text-sm text-neutral-500 mt-1 font-semibold">Track and assign financial and material donations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donations.map(donation => (
          <DonationCard 
            key={donation.id} 
            donation={donation} 
            onAssign={handleAssign} 
          />
        ))}
      </div>

    </div>
  );
}

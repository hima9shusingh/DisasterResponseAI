import React from 'react';

export default function DamageCategoryCard({ categories }) {
  // Mapping logic for standard string output
  const formatCategoryName = (cat) => {
    return cat.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getImpactData = (cat) => {
    // Basic heuristic to add color and percentages to string categories since backend only returns string list
    if (cat.includes('critical') || cat.includes('infrastructure')) return { impact: 'Severe Impact', color: 'bg-orange-500', pct: 85 };
    if (cat.includes('water') || cat.includes('fire')) return { impact: 'High Impact', color: 'bg-yellow-500', pct: 70 };
    return { impact: 'Moderate Impact', color: 'bg-blue-500', pct: 40 };
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm h-full">
      <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-6">Estimated Impact Analysis</h3>
      
      {(!categories || categories.length === 0) ? (
        <div className="text-center py-4 text-sm text-neutral-500">No damage categories identified.</div>
      ) : (
        <div className="space-y-5">
          {categories.map((cat, idx) => {
            const catName = formatCategoryName(cat);
            const data = getImpactData(cat);
            return (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-neutral-900">{catName}</span>
                  <span className="text-xs font-bold text-neutral-500">{data.impact}</span>
                </div>
                <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${data.color} rounded-full transition-all duration-1000`} 
                    style={{ width: `${data.pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

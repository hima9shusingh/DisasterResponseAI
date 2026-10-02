import React, { useState } from 'react';
import EmergencyBanner from '../../components/citizen/EmergencyBanner';
import EmergencyGuideCard from '../../components/citizen/EmergencyGuideCard';
import { emergencyGuides } from '../../data/mock/citizenHelpMockData';
import { Search, ChevronLeft, CheckCircle2, XCircle } from 'lucide-react';

export default function EmergencyGuide() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGuide, setActiveGuide] = useState(null);

  const filteredGuides = emergencyGuides.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <EmergencyBanner />

      {!activeGuide ? (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Emergency Guide</h1>
              <p className="text-sm text-neutral-500 mt-1 font-semibold">Learn how to prepare and respond to various disasters.</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search guides (e.g., Flood)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map(guide => (
              <EmergencyGuideCard key={guide.id} guide={guide} onClick={setActiveGuide} />
            ))}
            {filteredGuides.length === 0 && (
              <div className="col-span-full py-12 text-center text-neutral-500 font-semibold">
                No guides found matching "{searchQuery}"
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button 
            onClick={() => setActiveGuide(null)}
            className="flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-blue-600 transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Guides
          </button>
          
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="bg-blue-600 p-8 text-white">
              <h1 className="text-3xl font-black tracking-tight mb-2">{activeGuide.title} Guide</h1>
              <p className="text-blue-100 font-medium">Critical instructions for before, during, and after a {activeGuide.title.toLowerCase()}.</p>
            </div>

            <div className="p-8 space-y-10">
              
              <section>
                <h2 className="text-lg font-black text-neutral-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</span> 
                  Before {activeGuide.title}
                </h2>
                <ul className="space-y-3">
                  {activeGuide.sections.before.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-neutral-700 font-medium bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-black text-neutral-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs">2</span> 
                  During {activeGuide.title}
                </h2>
                <ul className="space-y-3">
                  {activeGuide.sections.during.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-neutral-700 font-medium bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                      <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-lg font-black text-neutral-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">3</span> 
                  After {activeGuide.title}
                </h2>
                <ul className="space-y-3">
                  {activeGuide.sections.after.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-neutral-700 font-medium bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="pt-6 border-t border-neutral-200">
                <h2 className="text-lg font-black text-red-600 uppercase tracking-wider mb-4">Strict Don'ts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeGuide.sections.donts.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-red-900 font-semibold bg-red-50 p-4 rounded-xl border border-red-100">
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

import React from 'react';
import { Image, Video, Maximize2 } from 'lucide-react';

export default function EvidenceGallery({ evidence }) {
  let items = [];
  
  if (Array.isArray(evidence)) {
    items = evidence;
  } else if (evidence && typeof evidence === 'object') {
    items = [
      ...(evidence.images || []).map(img => ({ ...img, type: 'image' })),
      ...(evidence.videos || []).map(vid => ({ ...vid, type: 'video' }))
    ];
  }

  if (items.length === 0) {
    return (
      <div className="p-8 border-2 border-dashed border-neutral-200 rounded-xl text-center">
        <Image className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
        <p className="text-sm font-medium text-neutral-500">No evidence uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item, idx) => (
        <div key={item.id || item._id || idx} className="relative group rounded-xl overflow-hidden border border-neutral-200 aspect-video bg-neutral-100 flex flex-col justify-end">
          {item.type === 'video' ? (
             <div className="absolute inset-0 flex items-center justify-center bg-neutral-200">
                <Video className="w-10 h-10 text-neutral-400" />
             </div>
          ) : (
            <img src={item.url} alt={item.originalName || 'Evidence'} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          )}
          
          <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-10">
            <button className="p-2 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur transition-colors text-white">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute top-2 right-2 px-2 py-1 bg-neutral-900/60 backdrop-blur rounded flex items-center gap-1.5 text-white text-[10px] font-bold uppercase tracking-wider z-10">
            {item.type === 'video' ? <Video className="w-3 h-3" /> : <Image className="w-3 h-3" />}
            {item.type}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white z-10">
            <p className="text-xs font-semibold truncate" title={item.originalName || item.filename || 'Unknown file'}>{item.originalName || item.filename || 'Unknown file'}</p>
            {item.uploadedAt && (
              <p className="text-[10px] text-neutral-300 font-medium">{new Date(item.uploadedAt).toLocaleString()}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

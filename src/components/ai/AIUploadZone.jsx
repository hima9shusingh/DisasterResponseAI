import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';

export default function AIUploadZone({ file, onFileSelect, onRemove }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (newFile) => {
    // Generate a mock object URL for preview
    const previewUrl = URL.createObjectURL(newFile);
    onFileSelect({ file: newFile, previewUrl, name: newFile.name, size: (newFile.size / 1024 / 1024).toFixed(2) + ' MB' });
  };

  if (file) {
    return (
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm relative overflow-hidden group">
        <button 
          onClick={onRemove}
          className="absolute top-4 right-4 bg-white/80 backdrop-blur p-2 rounded-full text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-colors z-10 opacity-0 group-hover:opacity-100 shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>
        <img src={file.previewUrl} alt="Preview" className="w-full h-64 object-cover rounded-xl mb-4" />
        <div className="flex items-center gap-3 px-2 pb-2">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-bold text-neutral-900 truncate">{file.name}</p>
            <p className="text-xs font-semibold text-neutral-500">{file.size}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative w-full border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-neutral-300 hover:border-blue-400 hover:bg-neutral-50 bg-white'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        accept="image/jpeg, image/png, image/webp" 
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
        <UploadCloud className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-black text-neutral-900 mb-2">Drag & drop visual evidence</h3>
      <p className="text-sm font-semibold text-neutral-500 mb-6">Supports JPG, PNG, WEBP (Max 10MB)</p>
      <button className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-sm font-bold transition-colors shadow-sm pointer-events-none">
        Browse Files
      </button>
    </div>
  );
}

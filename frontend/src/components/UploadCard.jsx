import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Image as ImageIcon, FileText } from 'lucide-react';

const UploadCard = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`relative w-full h-[320px] rounded-card overflow-hidden transition-all duration-300 ${isDragging ? 'bg-primary-500/10' : 'bg-card hover:bg-hover'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Animated Dashed Border */}
        <div className={`absolute inset-0 border-2 border-dashed rounded-card transition-colors duration-300 pointer-events-none ${isDragging ? 'border-primary-500' : 'border-border'}`}></div>
        
        <label htmlFor="dashboard-file-upload" className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-8 z-10">
          <input id="dashboard-file-upload" type="file" className="hidden" accept="image/jpeg,image/png,image/jpg" onChange={handleChange} />
          
          <motion.div 
            animate={isDragging ? { y: -10, scale: 1.1 } : { y: 0, scale: 1 }}
            className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-blue/20 flex items-center justify-center border border-primary-500/30 shadow-[0_0_30px_rgba(124,58,237,0.15)] relative"
          >
            <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full"></div>
            <UploadCloud className="w-10 h-10 text-primary-400 relative z-10" />
          </motion.div>

          <h3 className="text-xl font-semibold text-white mb-2 font-['Outfit']">
            {isDragging ? 'Drop your image here' : 'Drag & drop your image'}
          </h3>
          <p className="text-muted text-sm text-center mb-6 max-w-sm">
            Or click to browse from your computer. You can also paste an image directly from your clipboard (Ctrl+V).
          </p>

          <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
            <div className="flex items-center gap-1.5 bg-background border border-border px-3 py-1.5 rounded-lg">
              <ImageIcon className="w-3.5 h-3.5" /> PNG, JPG
            </div>
            <div className="flex items-center gap-1.5 bg-background border border-border px-3 py-1.5 rounded-lg">
              <FileText className="w-3.5 h-3.5" /> PDF
            </div>
            <span className="text-muted border-l border-border pl-4">Max 5MB</span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default UploadCard;

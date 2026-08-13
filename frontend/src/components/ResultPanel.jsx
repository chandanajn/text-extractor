import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, FileText, Share2, Maximize2, ZoomIn, RotateCcw, CheckCircle2 } from 'lucide-react';

const ResultPanel = ({ previewUrl, text, metadata }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-md h-full min-h-[600px]">
      
      {/* Left Panel: Image Preview */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-panel rounded-card flex flex-col overflow-hidden relative group"
      >
        <div className="p-4 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur-md z-10">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-primary-400" /> Source Image
          </h3>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-hover transition-colors" title="Zoom">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-hover transition-colors" title="Rotate">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-hover transition-colors" title="Fullscreen">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 bg-background/50 p-6 flex items-center justify-center relative overflow-hidden">
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt="Uploaded Preview" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full animate-pulse bg-hover rounded-lg"></div>
          )}
        </div>
      </motion.div>

      {/* Right Panel: Extracted Text */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-panel rounded-card flex flex-col overflow-hidden"
      >
        <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between bg-card/50 backdrop-blur-md gap-4">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent-blue" /> Extracted Text
            </h3>
            {metadata && (
              <span className="text-xs font-medium px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {metadata.confidence}% Confidence
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button onClick={handleCopy} className="p-2 rounded-btn bg-background border border-border text-gray-300 hover:text-white hover:border-primary-500/50 hover:bg-primary-500/10 transition-all flex items-center gap-1.5 text-xs font-medium">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
            <div className="h-4 w-px bg-border mx-1"></div>
            <button className="p-2 rounded-btn bg-background border border-border text-gray-300 hover:text-white hover:bg-hover transition-all" title="Download TXT">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-btn bg-background border border-border text-gray-300 hover:text-white hover:bg-hover transition-all" title="Share">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-0 relative group">
          <textarea
            className="w-full h-full p-6 bg-transparent text-gray-200 resize-none focus:outline-none custom-scrollbar font-sans leading-relaxed"
            value={text || ''}
            readOnly
            placeholder="Extracted text will appear here..."
          />
        </div>
        
        {metadata && (
          <div className="p-3 border-t border-border bg-background/50 flex items-center justify-between text-xs font-medium text-muted">
            <div className="flex gap-4">
              <span>{metadata.language || 'English'}</span>
              <span>{metadata.words || 0} words</span>
              <span>{metadata.characters || 0} characters</span>
            </div>
            <span>{metadata.lines || 0} lines</span>
          </div>
        )}
      </motion.div>

    </div>
  );
};

// Internal icon for consistency
const ImageIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
  </svg>
);

export default ResultPanel;

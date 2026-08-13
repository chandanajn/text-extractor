import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, X, AlertCircle } from 'lucide-react';

const UrlUploadDialog = ({ onClose, onUpload, selectedLanguage }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      if (!blob.type.startsWith('image/')) {
        throw new Error('URL does not point to a valid image.');
      }
      
      // Determine extension based on type
      let ext = '.jpg';
      if (blob.type === 'image/png') ext = '.png';
      else if (blob.type === 'image/webp') ext = '.webp';
      else if (blob.type === 'image/gif') ext = '.gif';
      
      const file = new File([blob], `url_image${ext}`, { type: blob.type });
      onUpload(file);
    } catch (err) {
      setError('Failed to load image from URL. It might be blocked by CORS or invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-panel w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-white/10"
      >
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Link2 className="w-5 h-5 text-accent-blue" />
            Upload from URL
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Image URL</label>
          <input 
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
          />
          
          {error && (
            <div className="mt-3 text-sm text-red-400 flex items-center gap-1.5 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-white/10 bg-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-400">
            Processing in: <span className="text-white font-medium bg-black/30 px-2 py-1 rounded border border-white/10">{selectedLanguage || 'Auto'}</span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto justify-end">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleFetch}
              disabled={!url || loading}
              className="px-6 py-2.5 bg-accent-blue hover:bg-blue-400 text-white font-semibold rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Import Image'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UrlUploadDialog;

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Trash2, Heart, ExternalLink, Clock, FileText } from 'lucide-react';

const HistoryCard = ({ history }) => {
  if (!history || history.length === 0) return null;

  return (
    <div className="glass-panel rounded-card overflow-hidden">
      <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-['Outfit']">Recent Extractions</h2>
          <p className="text-sm text-muted mt-1">Your document processing history</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search history..." 
              className="bg-background border border-border rounded-btn pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all w-full sm:w-48"
            />
          </div>
          <button className="p-2 bg-background border border-border rounded-btn text-gray-300 hover:text-white hover:bg-hover transition-colors flex items-center gap-2 text-sm font-medium">
            <Filter className="w-4 h-4" /> <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-background/50 border-b border-border uppercase text-xs font-semibold text-muted">
            <tr>
              <th className="px-6 py-4">Document</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Confidence</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <motion.tr 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border-b border-border/50 hover:bg-hover/50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="thumb" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <FileText className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white truncate max-w-[200px]">{item.filename}</p>
                      <p className="text-xs text-muted truncate max-w-[200px]">{item.snippet || "Processing text..."}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                    Success
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-300">
                  {item.confidence ? `${item.confidence}%` : 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-muted">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-pink-400 hover:bg-pink-500/10 rounded-md transition-colors" title="Favorite">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-white hover:bg-hover rounded-md transition-colors" title="Open">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryCard;

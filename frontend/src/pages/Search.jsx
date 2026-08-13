import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Search as SearchIcon, FileText, Calendar, Filter, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Search = () => {
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState('');
  
  const { data, isLoading } = useQuery({
    queryKey: ['ocrSearch', searchTerm, language],
    queryFn: async () => {
      let url = `/ocr/search?page=1&limit=50`;
      if (searchTerm) url += `&q=${encodeURIComponent(searchTerm)}`;
      if (language) url += `&language=${language}`;
      const res = await api.get(url);
      return res.data;
    },
    // Only run when we have a search term or a filter
    enabled: true
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(query);
  };

  const clearFilters = () => {
    setQuery('');
    setSearchTerm('');
    setLanguage('');
  };

  return (
    <div className="space-y-8 relative min-h-[80vh]">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[10%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-primary-500/10 blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 font-['Outfit']">
          Deep Search
        </h1>
        <p className="text-gray-400 mt-2 flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-emerald-400" />
          Semantic search through your entire OCR knowledge base
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-primary-500/5 pointer-events-none" />
        
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 relative z-10">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400 group-focus-within:text-primary-400 transition-colors" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search by filename or extracted text content..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-gray-500 shadow-inner"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300"
              >
                ✕
              </button>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-8 py-4 bg-gradient-to-r from-primary-500 to-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all border border-white/10 whitespace-nowrap"
          >
            Search DB
          </motion.button>
        </form>

        <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-5 mt-5 relative z-10">
          <div className="flex items-center space-x-2 text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            <Filter size={16} />
            <span className="text-sm font-medium">Refine</span>
          </div>
          
          <div className="relative">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none bg-black/40 border border-white/10 text-gray-300 text-sm rounded-xl py-2 pl-4 pr-10 outline-none hover:border-white/20 focus:border-primary-500 transition-colors cursor-pointer"
            >
              <option value="">All Languages</option>
              <option value="eng">English</option>
              <option value="hin">Hindi</option>
              <option value="fra">French</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          
          <AnimatePresence>
            {(searchTerm || language) && (
              <motion.button 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={clearFilters} 
                className="text-sm text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-400/10 transition-colors flex items-center"
              >
                Clear Filters
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="space-y-4 min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-primary-500">
            <Loader2 size={40} className="animate-spin mb-4" />
            <span className="text-gray-400 font-medium">Searching database...</span>
          </div>
        ) : data?.data.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-64 glass-panel rounded-3xl border border-white/10 border-dashed"
          >
            <SearchIcon size={48} className="text-gray-600 mb-4" />
            <p className="text-gray-400 font-medium text-lg">No records matched your criteria</p>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search terms or filters</p>
          </motion.div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.05 }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {data?.data.map((record) => (
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                key={record.id} 
                className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-primary-500/50 hover:bg-white/[0.04] transition-all group relative overflow-hidden flex flex-col h-[280px]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-transparent rounded-bl-full pointer-events-none" />
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center space-x-3 text-primary-400 max-w-[70%]">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20 flex-shrink-0">
                      <FileText size={20} className="text-primary-400" />
                    </div>
                    <span className="font-bold truncate text-white font-['Outfit']" title={record.filename}>{record.filename}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${record.confidence > 80 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                    {record.confidence.toFixed(0)}% Match
                  </span>
                </div>
                
                <div className="flex-1 bg-black/40 rounded-xl p-4 border border-white/5 overflow-hidden relative group-hover:bg-black/60 transition-colors">
                  <p className="text-sm text-gray-300 font-sans whitespace-pre-wrap line-clamp-5">
                    {record.text}
                  </p>
                  <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
                </div>
                
                <div className="flex justify-between items-center text-xs text-gray-500 pt-4 mt-4 border-t border-white/5 relative z-10">
                  <div className="flex items-center space-x-1.5">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{new Date(record.created_at).toLocaleDateString()}</span>
                  </div>
                  <span className="bg-white/5 px-2 py-1 rounded border border-white/5 uppercase font-medium">
                    {record.language}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Search;

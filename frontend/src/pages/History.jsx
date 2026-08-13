import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { FileText, Download, Trash2, Eye, Calendar, Clock, Activity, ChevronLeft, ChevronRight, X, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const History = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sort, setSort] = useState('latest');
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  const queryClient = useQueryClient();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const q = searchParams.get('q') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['ocrHistory', page, rowsPerPage, sort, q],
    queryFn: async () => {
      const endpoint = q 
        ? `/ocr/search?q=${encodeURIComponent(q)}&page=${page + 1}&limit=${rowsPerPage}`
        : `/ocr/history?page=${page + 1}&limit=${rowsPerPage}&sort=${sort}`;
      const res = await api.get(endpoint);
      return res.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/ocr/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['ocrHistory']);
      queryClient.invalidateQueries(['dashboardStats']);
    }
  });

  const downloadPDF = async (id) => {
    try {
      const response = await api.get(`/ocr/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ocr_result_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Failed to download PDF", err);
    }
  };

  const totalPages = data ? Math.ceil(data.total / rowsPerPage) : 0;

  return (
    <div className="space-y-6 relative min-h-[80vh]">
      {/* Background Element */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[30%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 font-['Outfit']">
            Extraction History
          </h1>
          <p className="text-gray-400 mt-2">Review your past extractions and exports</p>
        </div>
        
        <div className="relative">
          <select 
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none bg-black/40 border border-white/10 text-white rounded-xl py-2.5 pl-4 pr-10 outline-none backdrop-blur-md focus:border-primary-500 transition-colors shadow-lg cursor-pointer"
          >
            <option value="latest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest_confidence">Highest Confidence</option>
            <option value="lowest_confidence">Lowest Confidence</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel rounded-2xl overflow-hidden shadow-2xl border border-white/10"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                <th className="px-6 py-4">Document</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Confidence</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <span className="text-gray-400">Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    No records found
                  </td>
                </tr>
              ) : (
                data?.data?.map((row, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={row.id} 
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/5 group-hover:border-primary-500/30 transition-colors">
                          <FileText className="text-primary-400" size={18} />
                        </div>
                        <div>
                          <p className="text-white font-medium truncate max-w-[200px] sm:max-w-[300px]" title={row.filename}>{row.filename}</p>
                          <p className="text-xs text-gray-500 mt-1">ID: {row.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      <div className="flex items-center text-sm">
                        <Calendar size={14} className="mr-2 text-gray-500" />
                        {new Date(row.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1 text-xs">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-gray-800 text-gray-300 border border-gray-700 w-fit uppercase">
                          {row.language}
                        </span>
                        <span className="flex items-center text-gray-500">
                          <Clock size={12} className="mr-1" />
                          {row.processing_time.toFixed(2)}s
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Activity size={16} className={row.confidence > 80 ? 'text-green-400' : row.confidence > 50 ? 'text-yellow-400' : 'text-red-400'} />
                        <span className={`font-semibold ${row.confidence > 80 ? 'text-green-400' : row.confidence > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {row.confidence.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setSelectedRecord(row)} 
                          className="p-2 rounded-lg hover:bg-primary-500/20 text-gray-400 hover:text-primary-400 transition-colors"
                          title="View Data"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => downloadPDF(row.id)} 
                          className="p-2 rounded-lg hover:bg-green-500/20 text-gray-400 hover:text-green-400 transition-colors"
                          title="Download PDF"
                        >
                          <Download size={18} />
                        </button>
                        <button 
                          onClick={() => deleteMutation.mutate(row.id)} 
                          className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {data?.total > 0 && (
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-black/20">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Show</span>
              <select 
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(0);
                }}
                className="bg-black/50 border border-white/10 rounded-lg px-2 py-1 outline-none focus:border-primary-500 cursor-pointer text-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span>entries</span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>
                {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, data.total)} of {data.total}
              </span>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRecord && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedRecord(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="glass-panel max-w-2xl w-full max-h-[85vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-[#0a0a0f]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h3 className="text-xl font-bold text-white font-['Outfit'] flex items-center">
                  <FileText className="mr-2 text-primary-400" size={20} />
                  Extracted Data
                </h3>
                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="p-2 rounded-full hover:bg-white/10 text-gray-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                <div className="mb-4 flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    File: {selectedRecord.filename}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                    Conf: {selectedRecord.confidence.toFixed(1)}%
                  </span>
                </div>
                <div className="bg-black/50 border border-white/5 p-4 rounded-xl shadow-inner relative group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-pink-500 opacity-50 rounded-t-xl"></div>
                  <pre className="whitespace-pre-wrap font-sans text-gray-300 text-[15px] leading-relaxed selection:bg-primary-500/30 font-medium">
                    {selectedRecord.text}
                  </pre>
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex justify-end space-x-3">
                <button 
                  onClick={() => setSelectedRecord(null)}
                  className="px-5 py-2.5 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(selectedRecord.text);
                  }}
                  className="px-5 py-2.5 rounded-xl font-semibold bg-primary-500 hover:bg-primary-400 text-white shadow-lg shadow-primary-500/25 transition-all flex items-center"
                >
                  <Copy size={16} className="mr-2" />
                  Copy Text
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default History;

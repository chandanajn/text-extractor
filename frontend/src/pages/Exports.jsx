import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { FileText, Download, Calendar, ChevronLeft, ChevronRight, FileJson } from 'lucide-react';
import { motion } from 'framer-motion';

const Exports = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const { data, isLoading } = useQuery({
    queryKey: ['ocrExports', page, rowsPerPage],
    queryFn: async () => {
      const res = await api.get(`/ocr/history?page=${page + 1}&limit=${rowsPerPage}&sort=latest`);
      return res.data;
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

  const downloadTXT = async (id, text, filename) => {
    try {
      const blob = new Blob([text], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ocr_result_${id}_${filename}.txt`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Failed to download TXT", err);
    }
  };

  const totalPages = data ? Math.ceil(data.total / rowsPerPage) : 0;

  return (
    <div className="space-y-6 relative min-h-[80vh]">
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
            Data Exports
          </h1>
          <p className="text-gray-400 mt-2">Download your extracted data in multiple formats</p>
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
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Format</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <span className="text-gray-400">Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                    No exports available
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
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center border border-white/5 group-hover:border-primary-500/30 transition-colors">
                          <FileText className="text-indigo-400" size={18} />
                        </div>
                        <div>
                          <p className="text-white font-medium truncate max-w-[200px] sm:max-w-[300px]">{row.filename}</p>
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
                      <div className="flex space-x-2">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium">
                          PDF
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium">
                          TXT
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => downloadTXT(row.id, row.text, row.filename)} 
                          className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors flex items-center gap-1.5 text-sm font-medium"
                        >
                          <FileJson size={14} /> TXT
                        </button>
                        <button 
                          onClick={() => downloadPDF(row.id)} 
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors flex items-center gap-1.5 text-sm font-medium"
                        >
                          <Download size={14} /> PDF
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
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
    </div>
  );
};

export default Exports;

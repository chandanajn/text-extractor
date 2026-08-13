import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload as UploadIcon, FileImage, Settings2, Loader2, Download, Copy, Scan, Sparkles } from 'lucide-react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [language, setLanguage] = useState('eng');
  const [mode, setMode] = useState('auto');
  const [applyPreprocessing, setApplyPreprocessing] = useState(true);
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post('/ocr/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    },
    onSuccess: (data) => {
      setResult(data);
      queryClient.invalidateQueries(['dashboardStats']);
      queryClient.invalidateQueries(['ocrHistory']);
    }
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null); // Reset previous result
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setResult(null);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);
    formData.append('mode', mode);
    formData.append('apply_preprocessing', applyPreprocessing);
    
    uploadMutation.mutate(formData);
  };

  const downloadPDF = async () => {
    if (!result?.id) return;
    try {
      const response = await api.get(`/ocr/${result.id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ocr_result_${result.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Failed to download PDF", err);
    }
  };

  return (
    <div className="space-y-8 relative min-h-[80vh]">
      {/* Background Orbs specific to upload */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[20%] right-[15%] w-[40vw] h-[40vw] rounded-full bg-pink-500/10 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 font-['Outfit']">
            Extract Text
          </h1>
          <p className="text-gray-400 mt-2 flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-pink-400" />
            Powered by advanced AI & Computer Vision
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Upload & Settings */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="xl:col-span-4 space-y-6"
        >
          <div 
            className={`glass-panel p-8 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group relative overflow-hidden text-center ${isDragging ? 'border-primary-500 bg-primary-500/10 scale-105' : 'border-white/20 hover:border-primary-400 hover:bg-white/5'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
            
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <motion.div
              animate={{ y: isDragging ? -10 : 0 }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center mb-4 shadow-xl border border-white/10 group-hover:border-primary-500/50 transition-colors">
                <UploadIcon className={`transition-colors ${isDragging ? 'text-primary-400' : 'text-gray-400 group-hover:text-primary-400'}`} size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-['Outfit']">Drag & Drop Image</h3>
              <p className="text-sm text-gray-400 mb-6">or click to browse from your computer</p>
              
              <AnimatePresence>
                {file && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-xl flex items-center justify-center space-x-3 text-sm text-primary-300 backdrop-blur-md shadow-inner"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FileImage size={18} className="flex-shrink-0" />
                    <span className="truncate max-w-[200px] font-medium">{file.name}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
            
            <div className="flex items-center space-x-2 text-white font-bold pb-4 mb-4 border-b border-white/10 font-['Outfit'] text-lg relative z-10">
              <Settings2 size={20} className="text-primary-400" />
              <span>Configuration</span>
            </div>
            
            <div className="space-y-5 relative z-10">
              <div>
                <label className="block text-sm text-gray-400 mb-2 font-medium">Target Language</label>
                <div className="relative">
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3 appearance-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all cursor-pointer hover:bg-black/60"
                  >
                    <option value="eng">English (Fastest)</option>
                    <option value="hin">Hindi (हिन्दी)</option>
                    <option value="fra">French (Français)</option>
                    <option value="deu">German (Deutsch)</option>
                    <option value="spa">Spanish (Español)</option>
                    <option value="chi_sim">Chinese (Simplified)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2 font-medium">Processing Engine Mode</label>
                <div className="relative">
                  <select 
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 text-white rounded-xl p-3 appearance-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all cursor-pointer hover:bg-black/60"
                  >
                    <option value="auto">Auto-detect Content</option>
                    <option value="printed">Printed Document (High Acc)</option>
                    <option value="handwritten">Handwritten Notes</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="pt-2 bg-black/20 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-white cursor-pointer select-none" htmlFor="preprocess">
                    OpenCV Enhancement
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">Improves blurry/dark images</p>
                </div>
                <div className="relative inline-block w-12 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="preprocess"
                    checked={applyPreprocessing}
                    onChange={(e) => setApplyPreprocessing(e.target.checked)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-700 appearance-none cursor-pointer transition-transform duration-300 ease-in-out checked:translate-x-6 checked:border-primary-500"
                  />
                  <label htmlFor="preprocess" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-700 cursor-pointer transition-colors duration-300 ease-in-out peer-checked:bg-primary-500"></label>
                </div>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: file && !uploadMutation.isPending ? 1.02 : 1 }}
            whileTap={{ scale: file && !uploadMutation.isPending ? 0.98 : 1 }}
            onClick={handleUpload}
            disabled={!file || uploadMutation.isPending}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-3 transition-all duration-300 shadow-xl overflow-hidden relative ${
              !file || uploadMutation.isPending
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5'
                : 'bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 text-white shadow-primary-500/25 hover:shadow-primary-500/40 border border-white/10'
            }`}
          >
            {/* Shimmer effect for active button */}
            {file && !uploadMutation.isPending && (
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent hover:animate-[shimmer_1.5s_infinite]" />
            )}
            
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="animate-spin" size={22} />
                <span className="tracking-wide">AI Processing...</span>
              </>
            ) : (
              <>
                <Scan size={22} />
                <span className="tracking-wide">Extract Text Magic</span>
              </>
            )}
          </motion.button>
          
          <AnimatePresence>
            {uploadMutation.isError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium flex items-center space-x-2 backdrop-blur-md"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                <span>Failed to process image. Please try again.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right Column: Preview & Result */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-8 space-y-6"
        >
          {!preview && !result && !uploadMutation.isPending && (
            <div className="glass-panel border-dashed border-white/10 h-[650px] flex flex-col items-center justify-center opacity-60">
              <Scan className="w-20 h-20 text-gray-600 mb-6" />
              <h3 className="text-xl font-bold text-gray-500 font-['Outfit']">Awaiting Image</h3>
              <p className="text-gray-600 mt-2">Upload an image to see the magic happen</p>
            </div>
          )}
          
          {preview && !result && !uploadMutation.isPending && (
            <div className="glass-panel p-4 rounded-2xl h-[650px] flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-end justify-center pb-8">
                <span className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white text-sm font-medium">Ready to extract</span>
              </div>
              <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain rounded-xl relative z-0 shadow-2xl" />
            </div>
          )}

          {uploadMutation.isPending && (
            <div className="glass-panel p-4 rounded-2xl h-[650px] flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-purple-500/5 animate-pulse"></div>
              
              <div className="relative">
                <div className="w-32 h-32 border-2 border-white/5 rounded-full"></div>
                <div className="w-32 h-32 border-2 border-primary-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0" style={{ animationDuration: '1.5s' }}></div>
                <div className="w-32 h-32 border-2 border-pink-500/50 rounded-full border-b-transparent animate-spin absolute top-0 left-0" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Scan size={40} className="text-white drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
                  </motion.div>
                </div>
              </div>
              
              <div className="text-center relative z-10">
                <h3 className="text-2xl font-bold text-white mb-2 font-['Outfit'] tracking-wide">Vision AI Active</h3>
                <p className="text-primary-400 font-medium tracking-widest text-sm uppercase">Analyzing geometric structures...</p>
              </div>
            </div>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel rounded-2xl overflow-hidden flex flex-col h-[650px]"
            >
              <div className="bg-black/40 p-5 border-b border-white/10 flex items-center justify-between backdrop-blur-xl">
                <div className="flex space-x-6 text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Confidence</span>
                    <span className="flex items-center text-white font-medium">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                      {result.confidence.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Speed</span>
                    <span className="text-white font-medium">{result.processing_time.toFixed(2)}s</span>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div className="flex flex-col">
                    <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Lang</span>
                    <span className="text-white font-medium uppercase">{result.language}</span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigator.clipboard.writeText(result.text)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-colors text-sm font-medium"
                  >
                    <Copy size={16} />
                    <span>Copy</span>
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadPDF}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-400 text-white rounded-xl shadow-lg shadow-primary-500/20 transition-colors text-sm font-medium border border-primary-400/50"
                  >
                    <Download size={16} />
                    <span>Export PDF</span>
                  </motion.button>
                </div>
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto bg-black/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                  <div className="h-full border border-white/10 rounded-xl overflow-hidden bg-black/40 shadow-inner relative group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-end p-4">
                      <span className="text-white/80 text-xs font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">Original Document</span>
                    </div>
                    <img src={preview} alt="Processed" className="w-full h-full object-contain" />
                  </div>
                  <div className="h-full bg-[#0d0d12] p-6 rounded-xl border border-white/10 overflow-y-auto custom-scrollbar shadow-inner relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-pink-500"></div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Extracted Text Result</h4>
                    <pre className="text-gray-200 font-sans whitespace-pre-wrap text-[15px] leading-relaxed selection:bg-primary-500/30">
                      {result.text}
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Upload;

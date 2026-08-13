import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, Globe, HardDrive, CheckCircle, FileText, Target } from 'lucide-react';

import PageContainer from '../components/PageContainer';
import StatCard from '../components/StatCard';
import QuickActions from '../components/QuickActions';
import UploadCard from '../components/UploadCard';
import ResultPanel from '../components/ResultPanel';
import HistoryCard from '../components/HistoryCard';
import EmptyState from '../components/EmptyState';
import CameraCapture from '../components/CameraCapture';
import UrlUploadDialog from '../components/UrlUploadDialog';
import { useNavigate } from 'react-router-dom';

const LANGUAGE_OPTIONS = [
  { group: "Common Mixed", options: [
      { value: "eng", label: "English" },
      { value: "eng+tel", label: "English + Telugu" },
      { value: "eng+hin", label: "English + Hindi" },
  ]},
  { group: "Indian Languages", options: [
      { value: "hin", label: "Hindi" },
      { value: "tel", label: "Telugu" },
      { value: "kan", label: "Kannada" },
      { value: "mal", label: "Malayalam" },
      { value: "tam", label: "Tamil" },
      { value: "ben", label: "Bengali" },
      { value: "guj", label: "Gujarati" },
      { value: "mar", label: "Marathi" },
      { value: "pan", label: "Punjabi" }
  ]},
  { group: "Global Languages", options: [
      { value: "spa", label: "Spanish" },
      { value: "fra", label: "French" },
      { value: "deu", label: "German" },
      { value: "ita", label: "Italian" },
      { value: "por", label: "Portuguese" },
      { value: "rus", label: "Russian" },
      { value: "jpn", label: "Japanese" },
      { value: "kor", label: "Korean" },
      { value: "chi_sim", label: "Chinese (Simplified)" },
      { value: "chi_tra", label: "Chinese (Traditional)" },
      { value: "ara", label: "Arabic" }
  ]}
];

const Dashboard = () => {
  const [_file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isUrlOpen, setIsUrlOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(() => localStorage.getItem('visionocr_lang') || 'eng');
  
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    localStorage.setItem('visionocr_lang', newLang);
  };

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch History
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['ocrHistoryRecent'],
    queryFn: async () => {
      const res = await api.get('/ocr/history?page=1&limit=10&sort=latest');
      return res.data;
    }
  });

  // Mock dashboard stats since the backend may not have all of them
  const mockStats = [
    { title: "Today's OCR", value: "24", icon: Zap, trend: { isPositive: true, value: 12 } },
    { title: "Success Rate", value: "99.8", icon: CheckCircle, suffix: "%", trend: { isPositive: true, value: 0.2 } },
    { title: "Average Time", value: "1.2", icon: Clock, suffix: "s", trend: { isPositive: false, value: 5 } },
    { title: "Storage Used", value: "4.2", icon: HardDrive, suffix: "MB" },
    { title: "Total Files", value: "1,248", icon: FileText },
    { title: "Avg Confidence", value: "96", icon: Target, suffix: "%" }
  ];

  // Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post('/ocr/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    },
    onSuccess: (data) => {
      setResult(data);
      queryClient.invalidateQueries(['ocrHistoryRecent']);
    }
  });

  const processFile = (selectedFile) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('language', selectedLanguage);
    formData.append('mode', 'auto');
    formData.append('apply_preprocessing', true);
    
    uploadMutation.mutate(formData);
  };

  const handleQuickAction = async (actionId) => {
    switch(actionId) {
      case 'upload':
        document.getElementById('dashboard-file-upload')?.click();
        break;
      case 'camera':
        setIsCameraOpen(true);
        break;
      case 'paste':
        try {
          const clipboardItems = await navigator.clipboard.read();
          for (const clipboardItem of clipboardItems) {
            const imageTypes = clipboardItem.types.filter(type => type.startsWith('image/'));
            for (const imageType of imageTypes) {
              const blob = await clipboardItem.getType(imageType);
              const file = new File([blob], "clipboard_image.png", { type: imageType });
              processFile(file);
              return;
            }
          }
          alert("No image found in clipboard.");
        } catch (err) {
          console.error(err);
          alert("Failed to read clipboard. Please allow clipboard permissions.");
        }
        break;
      case 'url':
        setIsUrlOpen(true);
        break;
      case 'history':
        navigate('/history');
        break;
      case 'exports':
        navigate('/exports');
        break;
      default:
        break;
    }
  };

  const handleCameraCapture = (capturedFile) => {
    setIsCameraOpen(false);
    processFile(capturedFile);
  };

  const handleUrlUpload = (fetchedFile) => {
    setIsUrlOpen(false);
    processFile(fetchedFile);
  };

  const hasActivity = preview || result || uploadMutation.isPending || (historyData?.data && historyData.data.length > 0);

  return (
    <PageContainer>
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold font-['Outfit'] tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-muted text-sm max-w-2xl">
            Welcome back. Here's an overview of your text extraction metrics and recent activity.
          </p>
        </div>
        
        {/* Global Language Selector */}
        <div className="flex items-center gap-3 bg-card border border-border px-4 py-2 rounded-xl shadow-sm hover:border-primary-500/50 transition-colors">
          <Globe className="w-5 h-5 text-primary-400" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">Processing Language</span>
            <select 
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="bg-transparent text-white text-sm font-medium focus:outline-none focus:ring-0 cursor-pointer w-48"
            >
              {LANGUAGE_OPTIONS.map((group) => (
                <optgroup key={group.group} label={group.group} className="bg-card text-gray-400">
                  {group.options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="text-white bg-card">{opt.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-sm">
        {mockStats.map((stat, i) => (
          <StatCard key={stat.title} {...stat} delay={i * 0.05} />
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActions onAction={handleQuickAction} />

      {/* Main Content Area (Upload & Processing & Results) */}
      <div className="flex flex-col gap-lg">
        {/* If not processing and no result, show the Upload Card */}
        {!uploadMutation.isPending && !result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <UploadCard onFileSelect={processFile} />
          </motion.div>
        )}

        {/* Processing State */}
        {uploadMutation.isPending && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="w-full h-[320px] glass-panel rounded-card flex flex-col items-center justify-center p-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-primary-500/5 animate-pulse"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-blue p-[2px] mb-6 shadow-[0_0_40px_rgba(124,58,237,0.3)] animate-pulse">
                <div className="w-full h-full bg-card rounded-2xl flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-['Outfit']">Processing Document...</h3>
              <p className="text-muted text-sm text-center max-w-md mb-8">
                Our AI is currently preprocessing the image and extracting text. This usually takes a few seconds.
              </p>
              
              {/* Stepper */}
              <div className="flex items-center gap-2">
                {['Uploading', 'Preprocessing', 'Extracting', 'Finalizing'].map((step, i) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${i === 2 ? 'bg-primary-500 shadow-[0_0_10px_#7C3AED] animate-pulse' : i < 2 ? 'bg-accent-blue' : 'bg-border'}`}></div>
                      <span className={`text-[10px] font-medium ${i <= 2 ? 'text-gray-300' : 'text-gray-600'}`}>{step}</span>
                    </div>
                    {i < 3 && <div className={`w-12 h-[2px] rounded-full mb-5 ${i < 2 ? 'bg-accent-blue' : 'bg-border'}`}></div>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Panel */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}>
              <ResultPanel 
                previewUrl={preview} 
                text={result.text} 
                metadata={{
                  language: selectedLanguage,
                  confidence: result.confidence ? Math.round(result.confidence) : 0,
                  words: result.text?.split(/\s+/).filter(Boolean).length || 0,
                  characters: result.text?.length || 0,
                  lines: result.text?.split('\n').filter(Boolean).length || 0
                }}
              />
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={() => { setResult(null); setPreview(null); }}
                  className="px-6 py-2.5 bg-background border border-border text-white font-medium rounded-btn hover:bg-hover transition-colors"
                >
                  Extract Another Image
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* History or Empty State */}
      <div className="mt-4">
        {!hasActivity && !historyLoading ? (
          <EmptyState />
        ) : (
          <HistoryCard history={historyData?.data || []} />
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isCameraOpen && (
          <CameraCapture 
            onClose={() => setIsCameraOpen(false)} 
            onCapture={handleCameraCapture} 
            selectedLanguage={selectedLanguage}
          />
        )}
        {isUrlOpen && (
          <UrlUploadDialog 
            onClose={() => setIsUrlOpen(false)} 
            onUpload={handleUrlUpload} 
            selectedLanguage={selectedLanguage}
          />
        )}
      </AnimatePresence>

    </PageContainer>
  );
};

export default Dashboard;

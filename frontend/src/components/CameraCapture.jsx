import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, RefreshCw } from 'lucide-react';

const CameraCapture = ({ onClose, onCapture, selectedLanguage }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setError('Camera access denied or unavailable.');
      }
    };
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
          onCapture(file);
        }
      }, 'image/jpeg', 0.9);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-panel w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-white/10"
      >
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary-400" />
            Scan Document
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 relative bg-black/50">
          {error ? (
            <div className="h-64 flex items-center justify-center text-red-400">
              {error}
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
              {!stream && <RefreshCw className="w-8 h-8 text-primary-500 animate-spin absolute" />}
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              
              {/* Camera Guide Overlay */}
              <div className="absolute inset-0 pointer-events-none border-[2px] border-white/20 m-8 rounded-xl border-dashed">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-500 -mt-1 -ml-1"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-500 -mt-1 -mr-1"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-500 -mb-1 -ml-1"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-500 -mb-1 -mr-1"></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-white/10 bg-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-400">
            Scanning in: <span className="text-white font-medium bg-black/30 px-2 py-1 rounded border border-white/10">{selectedLanguage || 'Auto'}</span>
          </div>
          <button 
            onClick={handleCapture}
            disabled={!!error || !stream}
            className="px-8 py-3 bg-primary-500 hover:bg-primary-400 text-white font-bold rounded-full shadow-[0_0_20px_rgba(124,58,237,0.4)] disabled:opacity-50 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Camera className="w-5 h-5" />
            Capture Image
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CameraCapture;

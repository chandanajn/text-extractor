import React from 'react';
import { motion } from 'framer-motion';
import { ImageOff, Sparkles, ArrowRight } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-32 h-32 mb-8 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-accent-blue/20 rounded-full blur-2xl"></div>
        <div className="w-full h-full bg-card border border-border rounded-full flex items-center justify-center relative z-10 shadow-xl">
          <ImageOff className="w-12 h-12 text-gray-400" />
        </div>
        <div className="absolute -top-2 -right-2 bg-primary-500 text-white p-2 rounded-full shadow-lg z-20">
          <Sparkles className="w-5 h-5" />
        </div>
      </motion.div>

      <motion.h3 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-2xl font-bold text-white mb-3 font-['Outfit'] tracking-tight"
      >
        No images processed yet
      </motion.h3>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-muted max-w-md mb-8"
      >
        Upload your first image to experience our enterprise-grade OCR extraction powered by advanced AI models.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <button className="px-6 py-2.5 bg-white text-black font-semibold rounded-btn hover:bg-gray-200 transition-colors flex items-center gap-2">
          View Example <ArrowRight className="w-4 h-4" />
        </button>
        <a href="#" className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors">
          Read Documentation
        </a>
      </motion.div>
    </div>
  );
};

export default EmptyState;

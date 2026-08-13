import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Camera, Clipboard, Link2, Clock, Download } from 'lucide-react';

const QuickActions = ({ onAction }) => {
  const actions = [
    { id: 'upload', icon: UploadCloud, label: "Upload Image", color: "from-blue-500 to-cyan-400" },
    { id: 'camera', icon: Camera, label: "Scan Camera", color: "from-purple-500 to-pink-500" },
    { id: 'paste', icon: Clipboard, label: "Paste Clip", color: "from-green-500 to-emerald-400" },
    { id: 'url', icon: Link2, label: "URL Upload", color: "from-orange-500 to-yellow-400" },
    { id: 'history', icon: Clock, label: "History", color: "from-gray-500 to-gray-400" },
    { id: 'exports', icon: Download, label: "Exports", color: "from-indigo-500 to-blue-500" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-sm">
      {actions.map((action, index) => (
        <motion.button
          key={action.id}
          onClick={() => onAction && onAction(action.id)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 + (index * 0.05) }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-panel p-4 rounded-card flex flex-col items-center justify-center gap-3 hover:bg-hover transition-colors group relative overflow-hidden"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
          <div className="p-3 bg-background border border-border rounded-xl group-hover:border-primary-500/30 transition-colors z-10">
            <action.icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
          </div>
          <span className="text-xs font-medium text-gray-400 group-hover:text-white z-10">{action.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default QuickActions;

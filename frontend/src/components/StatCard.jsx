import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, prefix = "", suffix = "", delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-panel rounded-card p-6 relative overflow-hidden group cursor-pointer"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-[40px] -mr-10 -mt-10 transition-all duration-500 group-hover:bg-primary-500/10"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-sm font-medium text-muted">{title}</h3>
        <div className="p-2 bg-background border border-border rounded-xl text-primary-400 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-baseline gap-1">
          {prefix && <span className="text-xl font-semibold text-gray-400">{prefix}</span>}
          <h2 className="text-3xl font-bold text-white font-['Outfit'] tracking-tight">
            {value}
          </h2>
          {suffix && <span className="text-xl font-semibold text-gray-400">{suffix}</span>}
        </div>
        
        {trend && (
          <div className="mt-2 flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend.isPositive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </span>
            <span className="text-xs text-muted">vs last week</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;

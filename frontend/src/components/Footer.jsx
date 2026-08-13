import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border bg-background py-8">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary-500 to-accent-blue flex items-center justify-center">
              <span className="text-white font-bold text-[10px] font-['Outfit']">V</span>
            </div>
            <span className="text-sm font-medium text-gray-300">
              Powered by VisionOCR
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted">
            <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms</Link>
            <Link to="#" className="hover:text-white transition-colors">Documentation</Link>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="text-muted hover:text-white transition-colors">
              <Globe className="w-4 h-4" />
            </a>
            <a href="#" className="text-muted hover:text-white transition-colors">
              <MessageCircle className="w-4 h-4" />
            </a>
            <div className="h-4 w-px bg-border"></div>
            <span className="text-xs font-mono text-muted">v2.0.0</span>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;

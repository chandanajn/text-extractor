import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { NotificationContext } from '../context/NotificationContext';
import { Search, Bell, Settings, Moon, Sun, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { notifications, unreadCount, markAllRead } = useContext(NotificationContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const searchInputRef = React.useRef(null);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/history?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      searchInputRef.current?.blur();
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'History', path: '/history' },
    { name: 'Exports', path: '/exports' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-[1280px] mx-auto px-8 h-16 flex items-center justify-between">
        
        {/* Left Section: Logo & Nav */}
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-blue flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.3)] group-hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] transition-shadow duration-300">
              <span className="text-white font-bold text-lg font-['Outfit']">V</span>
            </div>
            <span className="font-['Outfit'] font-bold text-lg tracking-tight text-white hidden sm:block">
              VisionOCR
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-btn text-sm font-medium transition-colors relative ${
                    isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-hover'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-hover rounded-btn -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
            <input 
              ref={searchInputRef}
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search..." 
              className="bg-card border border-border rounded-full pl-9 pr-14 py-1.5 text-sm text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 w-56 transition-all"
            />
            <div className="absolute right-2 flex gap-1">
              <kbd className="hidden sm:inline-flex items-center justify-center rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted">Ctrl</kbd>
              <kbd className="hidden sm:inline-flex items-center justify-center rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted">K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-2 border-l border-border pl-4">
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications && unreadCount > 0) markAllRead();
                }}
                className="p-2 text-gray-400 hover:text-white hover:bg-hover rounded-full transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-3 border-b border-border bg-background flex justify-between items-center">
                      <h4 className="text-sm font-semibold text-white">Notifications</h4>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(n => (
                          <div key={n.id} className={`p-3 border-b border-border/50 hover:bg-hover transition-colors ${n.unread ? 'bg-primary-500/5' : ''}`}>
                            <p className="text-sm text-white font-medium">{n.title}</p>
                            <p className="text-xs text-muted mt-1">{n.message}</p>
                            <p className="text-[10px] text-gray-500 mt-2">{new Date(n.date).toLocaleString()}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-muted">No notifications</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-white hover:bg-hover rounded-full transition-colors hidden sm:block"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <div className="relative ml-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-pink-500 p-[1.5px]">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
              </div>
              
              {/* Dropdown Menu (Hover for now, could be click-based) */}
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100 z-50">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted truncate">{user?.email}</p>
                </div>
                <div className="p-1">
                  <Link to="/settings" className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-hover rounded-lg">
                    Account Settings
                  </Link>
                  <button 
                    onClick={logout}
                    className="w-full flex items-center px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg mt-1 transition-colors"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </div>

            <button className="md:hidden p-2 text-gray-400 hover:text-white ml-1">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;

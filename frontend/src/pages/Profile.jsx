import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { User as UserIcon, Mail, Lock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const { user } = useContext(AuthContext);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    const updateData = { name, email };
    if (password) {
      updateData.password = password;
    }
    
    try {
      await api.put('/users/profile', updateData);
      setSuccess('Profile updated successfully!');
      setPassword(''); // clear password field
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 relative min-h-[80vh]">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[40vw] h-[40vw] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center sm:text-left"
      >
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 font-['Outfit']">
          Profile Settings
        </h1>
        <p className="text-gray-400 mt-2 flex items-center justify-center sm:justify-start">
          <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
          Manage your identity and preferences
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/10 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8 mb-10 pb-10 border-b border-white/10 relative z-10">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative w-28 h-28 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center border-2 border-white/10 shadow-2xl">
              <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary-400 to-pink-400 font-['Outfit'] uppercase">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="absolute bottom-0 right-0 bg-primary-500 w-8 h-8 rounded-full border-4 border-[#0a0a0f] flex items-center justify-center shadow-lg">
              <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="text-center sm:text-left flex flex-col justify-center h-28">
            <h2 className="text-3xl font-bold text-white font-['Outfit']">{user?.name}</h2>
            <div className="flex items-center justify-center sm:justify-start mt-2 space-x-2">
              <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${user?.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'}`}>
                {user?.role === 'admin' ? 'Administrator' : 'Standard User'}
              </span>
              <span className="text-gray-500 text-sm">{user?.email}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-8 relative z-10">
          <AnimatePresence>
            {success && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl flex items-center text-green-400 overflow-hidden"
              >
                <CheckCircle2 className="mr-3 flex-shrink-0" size={20} />
                <span className="font-medium">{success}</span>
              </motion.div>
            )}
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center text-red-400 overflow-hidden"
              >
                <AlertCircle className="mr-3 flex-shrink-0" size={20} />
                <span className="font-medium">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserIcon className="text-gray-500 group-focus-within:text-primary-400 transition-colors" size={18} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-gray-600 hover:bg-black/60"
                  placeholder="Enter your full name"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="text-gray-500 group-focus-within:text-primary-400 transition-colors" size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-gray-600 hover:bg-black/60"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-white/10">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white font-['Outfit']">Security</h3>
              <p className="text-sm text-gray-500 mt-1">Update your password to keep your account secure</p>
            </div>
            
            <div className="space-y-2 max-w-md">
              <label className="text-sm font-medium text-gray-400 ml-1">New Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="text-gray-500 group-focus-within:text-primary-400 transition-colors" size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 text-white rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-gray-600 hover:bg-black/60"
                  placeholder="Leave blank to keep current"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`px-8 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all border ${
                loading 
                  ? 'bg-gray-800 border-white/10 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-primary-500 to-blue-500 border-white/10 shadow-primary-500/25 hover:shadow-primary-500/40'
              }`}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                'Save Changes'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;

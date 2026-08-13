import React, { useState, useContext, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import api from '../services/api';
import { User as UserIcon, Sun, Save, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('profile');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, name: user.name || '', email: user.email || '' }));
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const payload = { name: data.name, email: data.email };
      if (data.password) {
        payload.password = data.password;
      }
      const res = await api.put('/users/profile', payload);
      return res.data;
    },
    onSuccess: () => {
      setSuccess(true);
      setError('');
      queryClient.invalidateQueries(['user']);
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (err) => {
      setError(err.response?.data?.detail || 'Failed to update profile');
      setSuccess(false);
    }
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    updateProfileMutation.mutate(formData);
  };

  return (
    <div className="space-y-6 relative min-h-[80vh]">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 font-['Outfit']">
          Settings
        </h1>
        <p className="text-gray-400 mt-2">Manage your account preferences and application settings</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-64 glass-panel rounded-2xl p-2 flex flex-col gap-1 border border-white/10 h-fit"
        >
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'profile' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <UserIcon size={18} /> Profile
          </button>
          <button 
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'appearance' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Sun size={18} /> Appearance
          </button>
        </motion.div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 glass-panel rounded-2xl border border-white/10 p-6 md:p-8"
        >
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white font-['Outfit']">Profile Information</h2>
              
              {success && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center gap-2">
                  <CheckCircle size={18} /> Profile updated successfully.
                </div>
              )}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
                  {error}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                  />
                </div>
                
                <hr className="border-white/10 my-6" />
                <h3 className="text-lg font-bold text-white font-['Outfit']">Change Password</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">New Password (leave blank to keep current)</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={updateProfileMutation.isPending}
                    className="px-6 py-3 bg-primary-500 hover:bg-primary-400 text-white font-semibold rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {updateProfileMutation.isPending ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white font-['Outfit']">Appearance Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/40 border border-white/10 rounded-xl">
                  <div>
                    <h4 className="text-white font-medium">Dark Mode</h4>
                    <p className="text-sm text-gray-400">Toggle dark/light theme for the application</p>
                  </div>
                  <button 
                    onClick={toggleTheme}
                    className={`w-14 h-7 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-primary-500' : 'bg-gray-600'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'}`}></div>
                  </button>
                </div>
                
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                  <p className="text-sm text-blue-400 font-medium flex items-center gap-2">
                    <CheckCircle size={16} /> Theme settings are saved locally to this browser.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;

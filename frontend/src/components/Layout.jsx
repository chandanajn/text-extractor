import React, { useContext } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-background text-gray-200 flex flex-col relative overflow-hidden">
      {/* Global Background Effects */}
      <div className="noise-bg"></div>
      <div className="blob bg-primary-500 w-[600px] h-[600px] -top-64 -left-64"></div>
      <div className="blob bg-accent-blue w-[500px] h-[500px] top-96 -right-32" style={{ animationDelay: '2s' }}></div>
      
      <Header />
      
      <main className="flex-grow z-10">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;

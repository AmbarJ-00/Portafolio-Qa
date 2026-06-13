import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Navigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { Palette, Terminal } from 'lucide-react';
import ErrorScreen from './ErrorScreen.jsx';

const Layout = ({ children }) => {
  const { theme } = useTheme();
  const { store, loading, dbError } = usePortfolio();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white select-none">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#09D8C7] mb-3" />
        <span className="text-xs font-mono text-brand-ash-300">Cargando portafolio...</span>
      </div>
    );
  }

  if (dbError) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <ErrorScreen code={dbError} />
        </div>
        <Footer />
      </div>
    );
  }

  const colors = store.settings?.appearance?.colors || {};
  const currentColors = theme === 'dark' ? (colors.dark || {}) : (colors.light || {});

  useEffect(() => {
    const root = document.documentElement;
    // Set custom properties dynamically on document root
    root.style.setProperty('--bg-global', currentColors.background || (theme === 'dark' ? '#020617' : '#f8fafc'));
    root.style.setProperty('--bg-card', currentColors.card || (theme === 'dark' ? '#111827' : '#ffffff'));
    root.style.setProperty('--color-button', currentColors.button || (theme === 'dark' ? '#a78bfa' : '#7c3aed'));
    root.style.setProperty('--color-text', currentColors.text || (theme === 'dark' ? '#f8fafc' : '#0f172a'));
    root.style.setProperty('--color-border', currentColors.border || (theme === 'dark' ? '#1e293b' : '#cbd5e1'));
    root.style.setProperty('--color-shadow', currentColors.shadow || (theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.05)'));
    root.style.setProperty('--color-gradient', currentColors.gradient || (theme === 'dark' ? '#a78bfa' : '#7c3aed'));
    root.style.setProperty('--color-navbar', currentColors.navbar || (theme === 'dark' ? '#111827' : '#ffffff'));
    root.style.setProperty('--color-footer', currentColors.footer || (theme === 'dark' ? '#020617' : '#f8fafc'));
    
    // Apply body style background color dynamically
    document.body.style.backgroundColor = currentColors.background || (theme === 'dark' ? '#020617' : '#f8fafc');
    document.body.style.color = currentColors.text || (theme === 'dark' ? '#f8fafc' : '#0f172a');
  }, [theme, currentColors]);

  // Find if this path corresponds to any of our registered pages
  const navItems = store.settings?.navbar?.items || [];
  const currentNav = navItems.find(item => item.path === location.pathname);

  // Centralized Status System checks
  if (currentNav) {
    const status = currentNav.status || (currentNav.active ? 'active' : 'inactive');
    
    if (status === 'inactive' || status === 'maintenance') {
      return <Navigate to="/404" replace />;
    }
    
    if (status === 'creative' || status === 'creative-process') {
      const creativeMsg = currentNav.creativeMessage || 'Sección en proceso creativo. ¡Vuelve pronto!';
      return (
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <motion.main 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center"
          >
            <div className="glass-card rounded-[2rem] border border-brand-electric-500/20 bg-brand-electric-500/5 p-8 max-w-2xl text-center space-y-6 shadow-xl">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-electric-500/10 text-brand-electric-500 animate-pulse">
                <Palette className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-extrabold text-brand-navy-900 dark:text-white">Proceso Creativo</h1>
              <p className="text-lg text-brand-navy-600 dark:text-brand-ash-300 font-medium leading-relaxed">
                {creativeMsg}
              </p>
              <div className="text-xs text-brand-electric-500 font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 pt-2">
                <Terminal className="w-4 h-4" />
                <span>Diseñando la mejor experiencia</span>
              </div>
            </div>
          </motion.main>
          <Footer />
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Main Content Area with elegant fade and slide motion */}
      <motion.main 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4, cubicBezier: [0.16, 1, 0.3, 1] }}
        className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {children}
      </motion.main>

      <Footer />
    </div>
  );
};

export default Layout;

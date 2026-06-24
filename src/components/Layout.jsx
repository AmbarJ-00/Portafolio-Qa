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
  const { store, loading, dbError, actions } = usePortfolio();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-white select-none">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#09D8C7] mb-3" />
        <span className="text-xs font-mono text-brand-ash-300">Cargando portafolio...</span>
      </div>
    );
  }

  const colors = store.settings?.appearance?.colors || {};
  const currentColors = theme === 'dark' ? (colors.dark || {}) : (colors.light || {});

  useEffect(() => {
    const root = document.documentElement;
    // Set custom properties dynamically on document root using original brand palette colors
    root.style.setProperty('--bg-global', currentColors.background || (theme === 'dark' ? '#030d16' : '#f8fafc'));
    root.style.setProperty('--bg-card', currentColors.card || (theme === 'dark' ? '#091c2c' : '#ffffff'));
    root.style.setProperty('--color-button', currentColors.button || (theme === 'dark' ? '#a78bfa' : '#7c3aed'));
    root.style.setProperty('--color-text', currentColors.text || (theme === 'dark' ? '#f8fafc' : '#0f172a'));
    root.style.setProperty('--color-border', currentColors.border || (theme === 'dark' ? '#1e293b' : '#cbd5e1'));
    root.style.setProperty('--color-shadow', currentColors.shadow || (theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.05)'));
    root.style.setProperty('--color-gradient', currentColors.gradient || (theme === 'dark' ? '#a78bfa' : '#7c3aed'));
    root.style.setProperty('--color-navbar', currentColors.navbar || (theme === 'dark' ? 'rgba(3, 13, 22, 0.8)' : 'rgba(255, 255, 255, 0.8)'));
    root.style.setProperty('--color-footer', currentColors.footer || (theme === 'dark' ? '#030d16' : '#ffffff'));
    
    // Apply body style background color dynamically
    document.body.style.backgroundColor = currentColors.background || (theme === 'dark' ? '#030d16' : '#f8fafc');
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
            className="flex-grow max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-14 py-16 flex items-center justify-center"
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
      
      {/* If database is down, show a user-friendly error banner with retry option */}
      {dbError && (
        <div className="mt-4 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-600 dark:text-red-400 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-bold text-sm">
                  Error de conexión ({dbError === 'DB-500' ? 'Error #DB-500' : 'Error #Server-500'})
                </p>
                <p className="text-xs opacity-90">
                  No se pudo establecer comunicación con el servidor de base de datos. Se están mostrando datos locales de respaldo.
                </p>
              </div>
            </div>
            <button 
              onClick={() => actions?.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap shadow-md"
            >
              Reintentar conexión
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area with elegant fade and slide motion */}
      <motion.main 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4, cubicBezier: [0.16, 1, 0.3, 1] }}
        className="flex-grow max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-14 py-10"
      >
        {children}
      </motion.main>

      <Footer />
    </div>
  );
};

export default Layout;

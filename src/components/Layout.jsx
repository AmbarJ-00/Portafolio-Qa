import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Navigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { Palette, Terminal } from 'lucide-react';

const Layout = ({ children }) => {
  const { theme } = useTheme();
  const { store, loading, dbError, actions } = usePortfolio();
  const location = useLocation();

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col justify-center items-center select-none"
        style={{ background: 'var(--bg-global)' }}
      >
        <div
          className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 mb-3"
          style={{ borderColor: 'var(--color-button)' }}
        />
        <span className="text-xs font-mono" style={{ color: 'var(--color-muted)' }}>
          Cargando portafolio...
        </span>
      </div>
    );
  }

  const colors = store.settings?.appearance?.colors || {};
  const currentColors = theme === 'dark' ? (colors.dark || {}) : (colors.light || {});

  // Default fallback palettes (new premium system)
  const darkDefaults = {
    background: '#231537', card: '#4F3179', button: '#CAA46E',
    text: '#ffffff', border: '#966D33', shadow: 'rgba(0,0,0,0.5)',
    gradient: '#CAA46E', navbar: 'rgba(35,21,55,0.88)', footer: '#1a0e29',
    muted: '#ADB0BC'
  };
  const lightDefaults = {
    background: '#FAF9F6', card: 'rgba(66,91,111,0.07)', button: '#D68880',
    text: '#182A3A', border: '#A08348', shadow: 'rgba(24,42,58,0.08)',
    gradient: '#D68880', navbar: 'rgba(250,249,246,0.85)', footer: '#FAF9F6',
    muted: '#7A7E74'
  };
  const defaults = theme === 'dark' ? darkDefaults : lightDefaults;

  useEffect(() => {
    const root = document.documentElement;
<<<<<<< HEAD
    // Set custom properties dynamically on document root using original brand palette colors
    root.style.setProperty('--bg-global', currentColors.background || (theme === 'dark' ? '#231537' : '#E8ECEF'));
    root.style.setProperty('--bg-card', currentColors.card || (theme === 'dark' ? '#4F3179' : '#A7C7E7'));
    root.style.setProperty('--color-button', currentColors.button || (theme === 'dark' ? '#CAA46E' : '#09D8C7'));
    root.style.setProperty('--color-text', currentColors.text || (theme === 'dark' ? '#ffffff' : '#1C2B48'));
    root.style.setProperty('--color-border', currentColors.border || (theme === 'dark' ? '#966D33' : '#1C2B48'));
    root.style.setProperty('--color-shadow', currentColors.shadow || (theme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.05)'));
    root.style.setProperty('--color-gradient', currentColors.gradient || (theme === 'dark' ? '#CAA46E' : '#09D8C7'));
    root.style.setProperty('--color-navbar', currentColors.navbar || (theme === 'dark' ? 'rgba(35, 21, 55, 0.8)' : 'rgba(232, 236, 239, 0.8)'));
    root.style.setProperty('--color-footer', currentColors.footer || (theme === 'dark' ? '#231537' : '#E8ECEF'));
    
    // Apply body style background color dynamically
    document.body.style.backgroundColor = currentColors.background || (theme === 'dark' ? '#231537' : '#E8ECEF');
    document.body.style.color = currentColors.text || (theme === 'dark' ? '#ffffff' : '#1C2B48');
=======
    root.style.setProperty('--bg-global',      currentColors.background || defaults.background);
    root.style.setProperty('--bg-card',        currentColors.card       || defaults.card);
    root.style.setProperty('--color-button',   currentColors.button     || defaults.button);
    root.style.setProperty('--color-accent',   currentColors.accent     || currentColors.button || defaults.button);
    root.style.setProperty('--color-text',     currentColors.text       || defaults.text);
    root.style.setProperty('--color-border',   currentColors.border     || defaults.border);
    root.style.setProperty('--color-shadow',   currentColors.shadow     || defaults.shadow);
    root.style.setProperty('--color-gradient', currentColors.gradient   || defaults.gradient);
    root.style.setProperty('--color-navbar',   currentColors.navbar     || defaults.navbar);
    root.style.setProperty('--color-footer',   currentColors.footer     || defaults.footer);
    root.style.setProperty('--color-muted',    currentColors.muted      || defaults.muted);
    root.style.setProperty('--color-button-glow',
      theme === 'dark' ? 'rgba(202,164,110,0.25)' : 'rgba(214,136,128,0.25)'
    );
    document.body.style.backgroundColor = currentColors.background || defaults.background;
    document.body.style.color           = currentColors.text       || defaults.text;
>>>>>>> 02d962fc1d76a170f1cebcdb14f6f7ba1c61aa6b
  }, [theme, currentColors]);

  // Status routing
  const navItems = store.settings?.navbar?.items || [];
  const currentNav = navItems.find(item => item.path === location.pathname);

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
            <div
              className="glass-card rounded-[2rem] p-8 max-w-2xl text-center space-y-6 shadow-xl"
              style={{ border: '1px solid var(--color-border)' }}
            >
              <div
                className="inline-flex h-16 w-16 items-center justify-center rounded-3xl animate-pulse"
                style={{ background: 'rgba(214,136,128,0.1)', color: 'var(--color-button)' }}
              >
                <Palette className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-extrabold" style={{ color: 'var(--color-text)' }}>
                Proceso Creativo
              </h1>
              <p className="text-lg font-medium leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                {creativeMsg}
              </p>
              <div
                className="text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 pt-2"
                style={{ color: 'var(--color-button)' }}
              >
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

      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
<<<<<<< HEAD
        transition={{ duration: 0.4, cubicBezier: [0.16, 1, 0.3, 1] }}
        className="flex-grow max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-14 py-10"
=======
        transition={{ duration: 0.4 }}
        className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8"
>>>>>>> 02d962fc1d76a170f1cebcdb14f6f7ba1c61aa6b
      >
        {children}
      </motion.main>

      <Footer />
    </div>
  );
};

export default Layout;

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO.jsx';

const NotFound = () => {
  return (
    <>
      <SEO 
        title="404 - Recurso No Encontrado" 
        description="La página que estás buscando no existe o ha sido trasladada a otro directorio."
        path="/404"
      />

      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 select-none relative overflow-hidden">
        {/* Glowing gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-electric-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse-subtle" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md text-center space-y-8 relative z-10"
        >
          {/* Main Visual */}
          <div className="inline-flex p-4 rounded-3xl bg-brand-electric-500/10 dark:bg-brand-lilac-500/10 border border-brand-electric-500/20 dark:border-brand-lilac-500/20 text-brand-electric-500 dark:text-brand-lilac-400 shadow-xl">
            <FileQuestion className="w-16 h-16 animate-bounce" />
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-5xl font-extrabold tracking-tight text-brand-navy-950 dark:text-white font-display">
              404
            </h1>
            <p className="text-xl font-bold text-brand-navy-800 dark:text-slate-200">
              Recurso No Encontrado
            </p>
            <p className="text-sm text-brand-navy-600 dark:text-brand-ash-400 leading-relaxed max-w-xs mx-auto">
              La dirección especificada no existe en el ecosistema actual de pruebas o no posees los permisos necesarios.
            </p>
          </div>

          <div className="h-0.5 bg-brand-ash-200 dark:bg-brand-navy-800 w-24 mx-auto rounded-full" />

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-navy-800 dark:bg-brand-lilac-600 hover:opacity-90 text-white font-semibold rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Home className="w-4 h-4" />
              <span>Ir al Inicio</span>
            </Link>
            <Link
              to="/backoffice"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 glass-card glass-card-hover text-brand-navy-800 dark:text-brand-ash-200 font-semibold rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Panel</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFound;

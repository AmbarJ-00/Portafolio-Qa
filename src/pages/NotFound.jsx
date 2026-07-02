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
        {/* Ambient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none animate-pulse-subtle"
          style={{ background: 'rgba(214,136,128,0.06)' }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md text-center space-y-8 relative z-10"
        >
          {/* Icon */}
          <div
            className="inline-flex p-4 rounded-3xl shadow-xl"
            style={{
              background: 'rgba(214,136,128,0.1)',
              border: '1px solid rgba(214,136,128,0.2)',
              color: 'var(--color-button)'
            }}
          >
            <FileQuestion className="w-16 h-16 animate-bounce" />
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-5xl font-extrabold tracking-tight font-display" style={{ color: 'var(--color-text)' }}>
              404
            </h1>
            <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
              Recurso No Encontrado
            </p>
            <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: 'var(--color-muted)' }}>
              La dirección especificada no existe en el ecosistema actual de pruebas o no posees los permisos necesarios.
            </p>
          </div>

          <div className="h-0.5 w-24 mx-auto rounded-full" style={{ background: 'var(--color-border)' }} />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-[0.98] hover:opacity-90"
              style={{ background: 'var(--color-button)', color: '#fff' }}
            >
              <Home className="w-4 h-4" />
              <span>Ir al Inicio</span>
            </Link>
            <Link
              to="/backoffice"
              className="glass-card glass-card-hover inline-flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ color: 'var(--color-text)' }}
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

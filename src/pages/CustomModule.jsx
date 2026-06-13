import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Activity, X } from 'lucide-react';
import SEO from '../components/SEO.jsx';
import StatusCard from '../components/StatusCard.jsx';
import ErrorScreen from '../components/ErrorScreen.jsx';

const CustomModule = () => {
  const { moduleId } = useParams();
  const { store } = usePortfolio();
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const module = store.settings.modules.find((item) => item.id === moduleId);

  if (!module) {
    return <Navigate to="/" replace />;
  }

  if (!module.configurado) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <ErrorScreen 
          code="Config-001" 
          customMessage={`Este es un módulo nuevo.\n\nDebe configurarse un mensaje personalizado antes de publicarse.\n\nReferencia:\nError #Config-001`} 
        />
      </div>
    );
  }

  const elements = module.elements || [];
  const type = module.elementsType || 'cards';

  // Carousel handlers
  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % elements.length);
  };
  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + elements.length) % elements.length);
  };

  return (
    <>
      <SEO title={module.name} description={module.description} path={`/modules/${module.id}`} />
      
      <div className="space-y-12">
        {/* Title block */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-display font-extrabold text-brand-navy-900 dark:text-white">
            {module.name}
          </h1>
          <p className="text-lg text-brand-navy-600 dark:text-brand-ash-400 leading-relaxed">
            {module.description}
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-brand-electric-500 to-brand-lilac-500 rounded" />
        </div>

        {/* 1. CARDS element type */}
        {type === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elements.map((item, idx) => (
              <StatusCard key={idx} status={item.status || 'active'} type="project">
                <div className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between h-full relative group">
                  <div className="space-y-4">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt="Element visual" 
                        className="w-full h-44 object-cover rounded-xl border border-brand-ash-200/50 dark:border-brand-navy-800/40"
                      />
                    )}
                    <p className="text-sm text-brand-navy-700 dark:text-brand-ash-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  {item.url && (
                    <div className="mt-6 pt-4 border-t border-brand-ash-200/30 dark:border-brand-navy-800/20">
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-electric-500 hover:opacity-85"
                      >
                        <span>Visitar recurso</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </StatusCard>
            ))}
          </div>
        )}

        {/* 2. MODALS element type */}
        {type === 'modales' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {elements.map((item, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveModalItem(item)}
                  className="glass-card glass-card-hover p-6 rounded-2xl text-left flex flex-col justify-between h-full group cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-electric-500 outline-none"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-brand-electric-500 uppercase tracking-wider">Ver Detalles</span>
                    <p className="text-sm text-brand-navy-700 dark:text-brand-ash-300 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-brand-navy-400 group-hover:text-brand-electric-500 transition-colors mt-4 block">
                    Ampliar información
                  </span>
                </button>
              ))}
            </div>

            <AnimatePresence>
              {activeModalItem && (
                <div 
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy-950/80 backdrop-blur-sm" 
                  role="dialog"
                  aria-modal="true"
                >
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 15 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.95, y: 15 }} 
                    className="w-full max-w-lg glass-card rounded-3xl p-6 bg-white dark:bg-brand-navy-950 border border-brand-ash-200 dark:border-brand-navy-800 shadow-2xl space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-brand-ash-200 dark:border-brand-navy-800 pb-3">
                      <h3 className="text-lg font-bold text-brand-navy-900 dark:text-white">Detalle</h3>
                      <button 
                        onClick={() => setActiveModalItem(null)} 
                        className="p-1.5 hover:bg-brand-ash-100 dark:hover:bg-brand-navy-900 rounded-lg"
                      >
                        <X className="w-5 h-5 text-brand-navy-500" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm text-brand-navy-700 dark:text-brand-ash-300 leading-relaxed">
                        {activeModalItem.content}
                      </p>
                      <p className="text-xs text-brand-navy-500">{activeModalItem.description}</p>
                      {activeModalItem.url && (
                        <a 
                          href={activeModalItem.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-electric-500 hover:opacity-85"
                        >
                          <span>Visitar enlace oficial</span>
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* 3. METRICS element type */}
        {type === 'métricas' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {elements.map((item, idx) => (
              <div 
                key={idx} 
                className="glass-card p-6 rounded-2xl flex items-center gap-4 border-l-4 border-l-brand-electric-500"
              >
                <div className="p-3 rounded-xl bg-brand-electric-500/10 text-brand-electric-500">
                  <Activity className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-display font-extrabold text-brand-navy-900 dark:text-white">
                    {item.value || '0'}
                    {item.percentage ? '%' : ''}
                  </div>
                  <div className="text-xs font-semibold text-brand-navy-500 dark:text-brand-ash-400 uppercase tracking-wider">
                    {item.indicator}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. CAROUSELS element type */}
        {type === 'carruseles' && elements.length > 0 && (
          <div className="relative glass-card rounded-[2rem] p-8 max-w-3xl mx-auto overflow-hidden">
            <div className="min-h-[240px] flex flex-col justify-between space-y-6">
              {elements[carouselIndex].image && (
                <img 
                  src={elements[carouselIndex].image} 
                  alt="Slide visual" 
                  className="w-full h-64 object-cover rounded-xl"
                />
              )}
              <p className="text-lg text-brand-navy-700 dark:text-brand-ash-300 leading-relaxed italic text-center">
                "{elements[carouselIndex].text}"
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-brand-ash-200/50 dark:border-brand-navy-800/40">
                <button 
                  onClick={prevSlide} 
                  className="p-2 rounded-xl border border-brand-ash-200 dark:border-brand-navy-800 hover:bg-brand-ash-100 dark:hover:bg-brand-navy-900 transition"
                  aria-label="Diapositiva anterior"
                >
                  <ChevronLeft className="w-5 h-5 text-brand-navy-500" />
                </button>
                <span className="text-xs font-bold text-brand-navy-450">
                  {carouselIndex + 1} / {elements.length}
                </span>
                <button 
                  onClick={nextSlide} 
                  className="p-2 rounded-xl border border-brand-ash-200 dark:border-brand-navy-800 hover:bg-brand-ash-100 dark:hover:bg-brand-navy-900 transition"
                  aria-label="Siguiente diapositiva"
                >
                  <ChevronRight className="w-5 h-5 text-brand-navy-500" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomModule;

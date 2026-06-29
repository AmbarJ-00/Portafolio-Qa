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

  if (!module) return <Navigate to="/" replace />;

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
  const type     = module.elementsType || 'cards';

  const nextSlide = () => setCarouselIndex((prev) => (prev + 1) % elements.length);
  const prevSlide = () => setCarouselIndex((prev) => (prev - 1 + elements.length) % elements.length);

  const navBtnStyle = {
    padding: '0.5rem', borderRadius: '0.75rem',
    border: '1px solid var(--color-border)',
    color: 'var(--color-muted)', background: 'transparent', cursor: 'pointer',
    transition: 'all 0.2s'
  };

  return (
    <>
      <SEO title={module.name} description={module.description} path={`/modules/${module.id}`} />

      <div className="space-y-12">
        {/* Title */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-display font-extrabold" style={{ color: 'var(--color-text)' }}>
            {module.name}
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--color-muted)' }}>
            {module.description}
          </p>
          <div className="h-1 w-20 rounded" style={{ background: 'linear-gradient(to right, var(--color-button), var(--color-accent))' }} />
        </div>

        {/* 1. CARDS */}
        {type === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elements.map((item, idx) => (
              <StatusCard key={idx} status={item.status || 'active'} type="project">
                <div className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between h-full relative group" style={{ border: '1px solid var(--color-border)' }}>
                  <div className="space-y-4">
                    {item.image && (
                      <img src={item.image} alt="Element visual"
                        className="w-full h-44 object-cover rounded-xl"
                        style={{ border: '1px solid var(--color-border)' }}
                      />
                    )}
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{item.description}</p>
                  </div>
                  {item.url && (
                    <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                      <a href={item.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold hover:opacity-80"
                        style={{ color: 'var(--color-button)' }}
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

        {/* 2. MODALS */}
        {type === 'modales' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {elements.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveModalItem(item)}
                  className="glass-card glass-card-hover p-6 rounded-2xl text-left flex flex-col justify-between h-full group cursor-pointer outline-none"
                  style={{ border: '1px solid var(--color-border)' }}
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-button)' }}>Ver Detalles</span>
                    <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--color-muted)' }}>{item.description}</p>
                  </div>
                  <span className="text-xs font-bold mt-4 block transition-colors group-hover:opacity-75" style={{ color: 'var(--color-muted)' }}>
                    Ampliar información
                  </span>
                </button>
              ))}
            </div>

            <AnimatePresence>
              {activeModalItem && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                  style={{ background: 'rgba(0,0,0,0.75)' }}
                  role="dialog" aria-modal="true"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="w-full max-w-lg glass-card rounded-3xl p-6 shadow-2xl space-y-4"
                    style={{ background: 'var(--bg-global)', border: '1px solid var(--color-border)' }}
                  >
                    <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>Detalle</h3>
                      <button onClick={() => setActiveModalItem(null)} className="p-1.5 rounded-lg hover:opacity-70">
                        <X className="w-5 h-5" style={{ color: 'var(--color-muted)' }} />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted)' }}>{activeModalItem.content}</p>
                      <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{activeModalItem.description}</p>
                      {activeModalItem.url && (
                        <a href={activeModalItem.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-bold hover:opacity-80"
                          style={{ color: 'var(--color-button)' }}
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

        {/* 3. METRICS */}
        {type === 'métricas' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {elements.map((item, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl flex items-center gap-4" style={{ borderLeft: '4px solid var(--color-button)' }}>
                <div className="p-3 rounded-xl" style={{ background: 'rgba(214,136,128,0.1)', color: 'var(--color-button)' }}>
                  <Activity className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-display font-extrabold" style={{ color: 'var(--color-text)' }}>
                    {item.value || '0'}{item.percentage ? '%' : ''}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted)' }}>
                    {item.indicator}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. CAROUSEL */}
        {type === 'carruseles' && elements.length > 0 && (
          <div className="relative glass-card rounded-[2rem] p-8 max-w-3xl mx-auto overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
            <div className="min-h-[240px] flex flex-col justify-between space-y-6">
              {elements[carouselIndex].image && (
                <img src={elements[carouselIndex].image} alt="Slide visual" className="w-full h-64 object-cover rounded-xl" />
              )}
              <p className="text-lg leading-relaxed italic text-center" style={{ color: 'var(--color-muted)' }}>
                "{elements[carouselIndex].text}"
              </p>
              <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                <button onClick={prevSlide} style={navBtnStyle} aria-label="Diapositiva anterior">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-bold" style={{ color: 'var(--color-muted)' }}>
                  {carouselIndex + 1} / {elements.length}
                </span>
                <button onClick={nextSlide} style={navBtnStyle} aria-label="Siguiente diapositiva">
                  <ChevronRight className="w-5 h-5" />
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

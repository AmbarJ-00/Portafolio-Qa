import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Activity, X } from 'lucide-react';

const Portfolio = () => {
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const elements = [
  {
    "description": "Republica dominicana, Santo domingo",
    "image": "",
    "url": "",
    "status": "active"
  },
  {
    "description": "Republica dominicana, Santo domingo",
    "image": "",
    "url": "",
    "status": "active"
  },
  {
    "description": "Añadir Nuevo Elemento",
    "image": "",
    "url": "",
    "status": "active"
  }
];
  const accentColor = "#38bdf8";
  const surfaceColor = "#0f172a";

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % elements.length);
  };
  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + elements.length) % elements.length);
  };

  return (
    <div className="space-y-8 p-6 rounded-3xl" style={{ backgroundColor: surfaceColor }}>
      <div className="space-y-2">
        <h2 className="text-3xl font-display font-extrabold text-brand-navy-900 dark:text-white">Portfolio</h2>
        <div className="h-1 w-20 rounded" style={{ backgroundColor: accentColor }} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {elements.map((item, idx) => (
          <div 
            key={idx} 
            className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between h-full relative group border-t-4"
            style={{ borderTopColor: accentColor }}
          >
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
        ))}
      </div>
    </div>
  );
};

export default Portfolio;

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import {
  HelpCircle, X,
  Layers, Database, Server, HardDrive, GitBranch, Trello, Cloud,
  Code, FileCode, Users, Activity, TrendingUp, ShieldAlert, FileCheck,
  FileSpreadsheet, Cpu, Terminal, ShieldCheck, Award, BookOpen,
  Wrench, AlertTriangle, BarChart2, Zap, Globe, Lock, Search,
  CheckCircle, Star, Settings, Monitor, Smartphone, Bug, Clipboard,
  FileText, Package, Box, Link, Eye, PlayCircle, PauseCircle,
} from 'lucide-react';
import SEO from '../components/SEO.jsx';

// Icon lookup map
const ICON_MAP = {
  Layers, Database, Server, HardDrive, GitBranch, Trello, Cloud,
  Code, FileCode, Users, Activity, TrendingUp, ShieldAlert, FileCheck,
  FileSpreadsheet, Cpu, Terminal, ShieldCheck, Award, BookOpen,
  Wrench, AlertTriangle, BarChart2, Zap, Globe, Lock, Search,
  CheckCircle, Star, Settings, Monitor, Smartphone, Bug, Clipboard,
  FileText, Package, Box, Link, Eye, PlayCircle, PauseCircle, HelpCircle,
};

const Skills = () => {
  const { t } = useTranslation();
  const { store } = usePortfolio();
  const [selectedSkill, setSelectedSkill] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 8 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 14 } }
  };

  const renderIcon = (iconName, className) => {
    const IconComponent = ICON_MAP[iconName] || HelpCircle;
    return <IconComponent className={className} />;
  };

  const visibleSkills = store.skills.filter(
    (skill) => skill.status !== 'inactive' && skill.status !== 'Inactivo'
  );

  // Badge for special statuses
  const getStatusBadge = (status) => {
    if (status === 'learning') {
      return (
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-400" title="En proceso de adquisición" />
      );
    }
    if (status === 'maintenance') {
      return (
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" title="En mantenimiento" />
      );
    }
    return null;
  };

  return (
    <>
      <SEO
        title={t('nav.skills')}
        description={t('skills.subtitle')}
        path="/skills"
      />

      <div className="space-y-10">
        {/* Title Block */}
        <div className="space-y-3 max-w-3xl">
          <h1 className="text-3xl font-sans font-extrabold" style={{ color: 'var(--color-text)' }}>
            {t('skills.title')}
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
            {t('skills.subtitle')}
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-brand-electric-500 to-brand-lilac-500 rounded" />
        </div>        {/* Skills Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {visibleSkills.map((skill) => (
            <StatusCard key={skill.id} status={skill.status} type="skill">
              <motion.button
                variants={itemVariants}
                onClick={() => setSelectedSkill(skill)}
                className="glass-card glass-card-hover p-4 rounded-xl flex flex-col items-center gap-3 text-center w-full focus-visible:ring-2 focus-visible:ring-brand-electric-500 cursor-pointer shadow-sm relative group overflow-hidden h-full"
                aria-haspopup="dialog"
                aria-label={`Show details for ${skill.name}`}
              >
                {/* Decorative side accent */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-electric-500 dark:bg-brand-electric-500/80 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                
                <div className="p-2 bg-brand-ash-100 dark:bg-brand-navy-800 rounded-lg group-hover:bg-brand-electric-500/10 group-hover:text-brand-electric-500 transition-colors">
                  {renderIcon(skill.icon, "w-5 h-5 text-brand-navy-800 dark:text-brand-ash-200 group-hover:text-brand-electric-500 transition-colors")}
                </div>
                
                <div className="w-full">
                  <span className="font-bold text-brand-navy-900 dark:text-white text-xs block truncate">
                    {skill.name}
                  </span>
                </div>
              </motion.button>
            </StatusCard>
          ))}
        </motion.div>

        {/* Details Modal */}
        <AnimatePresence mode="wait">
          {selectedSkill && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
              aria-label={`Detalles de ${selectedSkill.name}`}
              onClick={(e) => { if (e.target === e.currentTarget) setSelectedSkill(null); }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
                style={{
                  background: 'var(--bg-global)',
                  border: '1px solid var(--color-border)'
                }}
              >
                {/* Modal Header */}
                <div
                  className="p-5 flex items-center justify-between shrink-0"
                  style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--bg-card)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ background: 'var(--bg-global)', border: '1px solid var(--color-border)' }}
                    >
                      {renderIcon(selectedSkill.icon, 'w-5 h-5')}
                    </div>
                    <div>
                      <h2 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                        {selectedSkill.name}
                      </h2>
                      <span className="text-[10px] font-semibold uppercase tracking-widest block" style={{ color: 'var(--color-muted)' }}>
                        {selectedSkill.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: 'var(--color-muted)' }}
                    aria-label={t('cta.close')}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                  <div className="space-y-4 text-sm leading-relaxed">
                    {/* Desc */}
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-button)' }}>
                        {t('skills.details_exp')}
                      </h3>
                      <p style={{ color: 'var(--color-muted)' }}>
                        {selectedSkill.translationKey
                          ? t(`${selectedSkill.translationKey}.exp`)
                          : selectedSkill.experience}
                      </p>
                    </div>
                  )}

                  {/* Use Cases */}
                  {(selectedSkill.translationKey || selectedSkill.useCases) && (
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-button)' }}>
                        {t('skills.details_use_cases')}
                      </h3>
                      <p style={{ color: 'var(--color-muted)' }}>
                        {selectedSkill.translationKey
                          ? t(`${selectedSkill.translationKey}.use_cases`)
                          : selectedSkill.useCases}
                      </p>
                    </div>
                  )}

                  {/* Tools */}
                  {selectedSkill.tools && selectedSkill.tools.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-button)' }}>
                        {t('skills.details_tools')}
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedSkill.tools.map((tool, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 text-xs font-semibold rounded-full"
                            style={{
                              background: 'var(--bg-card)',
                              border: '1px solid var(--color-border)',
                              color: 'var(--color-text)'
                            }}
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div
                  className="p-4 flex justify-end shrink-0"
                  style={{ borderTop: '1px solid var(--color-border)', background: 'var(--bg-card)' }}
                >
                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="px-4 py-2 text-xs font-bold rounded-lg transition-opacity hover:opacity-80"
                    style={{ background: 'var(--color-button)', color: '#fff' }}
                  >
                    {t('cta.close')}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Skills;

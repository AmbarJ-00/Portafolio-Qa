import React, { useState, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import * as LucideIcons from 'lucide-react';
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
import StatusCard from '../components/StatusCard.jsx';

// Mapa de íconos para lookup eficiente — sin importar toda la librería
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
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } }
  };

  // Helper to dynamically render Lucide Icons by name using the predefined map
  const renderIcon = (iconName, className) => {
    const IconComponent = ICON_MAP[iconName] || HelpCircle;
    return <IconComponent className={className} />;
  };


  const visibleSkills = store.skills.filter(
    (skill) => skill.status !== 'inactive' && skill.status !== 'Inactivo'
  );

  return (
    <>
      <SEO 
        title={t('nav.skills')} 
        description={t('skills.subtitle')}
        path="/skills"
      />

      <div className="space-y-12">
        {/* Title Block */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-display font-extrabold text-brand-navy-900 dark:text-white">
            {t('skills.title')}
          </h1>
          <p className="text-lg text-brand-navy-600 dark:text-brand-ash-400">
            {t('skills.subtitle')}
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-brand-electric-500 to-brand-lilac-500 rounded" />
        </div>

        {/* Skills Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {visibleSkills.map((skill) => (
            <StatusCard key={skill.id} status={skill.status} type="skill">
              <motion.button
                variants={itemVariants}
                onClick={() => setSelectedSkill(skill)}
                className="glass-card glass-card-hover p-6 rounded-xl flex flex-col items-start gap-4 text-left w-full focus-visible:ring-2 focus-visible:ring-brand-electric-500 cursor-pointer shadow-sm relative group overflow-hidden h-full"
                aria-haspopup="dialog"
                aria-label={`Show details for ${skill.name}`}
              >
                {/* Decorative side accent */}
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-electric-500 dark:bg-brand-electric-500/80 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                
                <div className="p-2.5 bg-brand-ash-100 dark:bg-brand-navy-800 rounded-lg group-hover:bg-brand-electric-500/10 group-hover:text-brand-electric-500 transition-colors">
                  {renderIcon(skill.icon, "w-6 h-6 text-brand-navy-800 dark:text-brand-ash-200 group-hover:text-brand-electric-500 transition-colors")}
                </div>
                
                <div className="w-full space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-brand-navy-900 dark:text-white text-base">
                      {skill.name}
                    </span>
                    <span className="text-xs font-semibold text-brand-navy-500 dark:text-brand-ash-400">
                      {skill.level}%
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-brand-ash-200 dark:bg-brand-navy-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-brand-electric-500 to-brand-lilac-500 rounded-full transition-all duration-300"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              </motion.button>
            </StatusCard>
          ))}
        </motion.div>

        {/* Dynamic Details Modal Overlay */}
        <AnimatePresence mode="wait">
          {selectedSkill && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy-950/80 backdrop-blur-sm" role="dialog" aria-modal="true">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.45, cubicBezier: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-lg glass-card rounded-2xl shadow-2xl overflow-hidden border border-brand-ash-200 dark:border-brand-navy-800 bg-white dark:bg-brand-navy-950 flex flex-col  max-h-[85vh]"
              >
                {/* Modal Header */}
                <div className="p-6 bg-brand-ash-100/50 dark:bg-brand-navy-900/50 border-b border-brand-ash-200 dark:border-brand-navy-800 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-brand-navy-950 rounded-lg border border-brand-ash-200 dark:border-brand-navy-800 shadow-sm">
                      {renderIcon(selectedSkill.icon, "w-6 h-6 text-brand-electric-500")}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-brand-navy-900 dark:text-white">
                        {selectedSkill.name}
                      </h2>
                      <span className="text-xxs font-semibold text-brand-navy-500 dark:text-brand-ash-400 uppercase tracking-widest block mt-0.5">
                        {selectedSkill.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="p-1.5 hover:bg-brand-ash-200 dark:hover:bg-brand-navy-800 rounded-lg text-brand-navy-600 dark:text-brand-ash-400 focus-visible:ring-2 focus-visible:ring-brand-electric-500"
                    aria-label={t('cta.close')}
                  >
                    <LucideIcons.X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                  {/* Skill level indicator */}
                  <div className="flex justify-between items-center text-sm font-bold text-brand-navy-800 dark:text-brand-ash-200">
                    <span>{t('skills.modal_title')}</span>
                    <span className="text-brand-electric-500">{selectedSkill.level}%</span>
                  </div>

                  <div className="space-y-4 text-sm leading-relaxed">
                    {/* Desc */}
                    <div className="space-y-1">
                      <h3 className="font-semibold text-brand-navy-800 dark:text-brand-ash-200">
                        {t('skills.details_desc')}
                      </h3>
                      <p className="text-brand-navy-600 dark:text-brand-ash-400">
                        {selectedSkill.translationKey ? t(`${selectedSkill.translationKey}.desc`) : selectedSkill.description}
                      </p>
                    </div>

                    {/* Experience */}
                    {(selectedSkill.translationKey || selectedSkill.experience) && (
                      <div className="space-y-1">
                        <h3 className="font-semibold text-brand-navy-800 dark:text-brand-ash-200">
                          {t('skills.details_exp')}
                        </h3>
                        <p className="text-brand-navy-600 dark:text-brand-ash-400">
                          {selectedSkill.translationKey ? t(`${selectedSkill.translationKey}.exp`) : selectedSkill.experience}
                        </p>
                      </div>
                    )}

                    {/* Use Cases */}
                    {(selectedSkill.translationKey || selectedSkill.useCases) && (
                      <div className="space-y-1">
                        <h3 className="font-semibold text-brand-navy-800 dark:text-brand-ash-200">
                          {t('skills.details_use_cases')}
                        </h3>
                        <p className="text-brand-navy-600 dark:text-brand-ash-400">
                          {selectedSkill.translationKey ? t(`${selectedSkill.translationKey}.use_cases`) : selectedSkill.useCases}
                        </p>
                      </div>
                    )}

                    {/* Tech details */}
                    {selectedSkill.tools && selectedSkill.tools.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <h3 className="font-semibold text-brand-navy-800 dark:text-brand-ash-200">
                          {t('skills.details_tools')}
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedSkill.tools.map((tool, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-0.5 bg-brand-ash-100 dark:bg-brand-navy-900/60 text-brand-navy-700 dark:text-brand-ash-300 text-xs font-semibold rounded border border-brand-ash-200/50 dark:border-brand-navy-800/40"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer action */}
                <div className="p-4 bg-brand-ash-100/30 dark:bg-brand-navy-900/30 border-t border-brand-ash-200/50 dark:border-brand-navy-800/50 flex justify-end shrink-0">
                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="px-4 py-2 bg-brand-navy-800 dark:bg-brand-navy-900 text-white dark:text-brand-ash-100 hover:opacity-90 font-bold text-xs rounded-lg shadow transition-opacity"
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

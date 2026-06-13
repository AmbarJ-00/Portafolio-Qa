import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import Modal from '../../components/Modal.jsx';
import { Palette, Layers, HelpCircle, Eye, Sliders, Check, Settings, Sparkles } from 'lucide-react';

const appearanceSchema = z.object({
  homeGradient: z.string().optional(),
  homeParticles: z.boolean().optional(),
  homeHeroEffect: z.string().optional(),
  
  projectCardStyle: z.string().optional(),
  projectShadowStrength: z.string().optional(),
  projectHighlightColor: z.string().optional(),
  
  skillsModalStyle: z.string().optional(),
  skillsProgressStyle: z.string().optional(),
  skillsCardAnimation: z.string().optional(),
  
  certificationsCardStyle: z.string().optional(),
  certificationsBorderStyle: z.string().optional(),
  certificationsAnimation: z.string().optional(),
  
  // Custom theme overrides
  lightBackground: z.string().optional(),
  lightCard: z.string().optional(),
  lightButton: z.string().optional(),
  lightText: z.string().optional(),
  lightBorder: z.string().optional(),
  lightShadow: z.string().optional(),
  lightGradient: z.string().optional(),
  lightNavbar: z.string().optional(),
  lightFooter: z.string().optional(),
  
  darkBackground: z.string().optional(),
  darkCard: z.string().optional(),
  darkButton: z.string().optional(),
  darkText: z.string().optional(),
  darkBorder: z.string().optional(),
  darkShadow: z.string().optional(),
  darkGradient: z.string().optional(),
  darkNavbar: z.string().optional(),
  darkFooter: z.string().optional(),
  
  accentColor: z.string().min(3, 'El color de acento es obligatorio'),
  surfaceColor: z.string().min(3, 'El color de superficie es obligatorio'),
  hoverColor: z.string().min(3, 'El color de hover es obligatorio'),
  
  navbarType: z.string().optional(),
  navbarLayout: z.string().optional(),
  navbarBehavior: z.string().optional()
});

const presets = {
  saas: {
    homeGradient: 'from-slate-900 via-brand-navy-900 to-slate-950',
    homeParticles: true,
    homeHeroEffect: 'glow',
    projectCardStyle: 'glass',
    projectShadowStrength: 'medium',
    projectHighlightColor: '#09D8C7',
    skillsModalStyle: 'card',
    skillsProgressStyle: 'gradient',
    skillsCardAnimation: 'float',
    certificationsCardStyle: 'image-frame',
    certificationsBorderStyle: 'rounded',
    certificationsAnimation: 'fade',
    accentColor: '#09D8C7',
    surfaceColor: '#0F223B',
    hoverColor: '#38bdf8',
    navbarType: 'horizontal',
    navbarLayout: 'wrap',
    navbarBehavior: 'grid',
    lightBackground: '#f8fafc',
    lightCard: '#ffffff',
    lightButton: '#7c3aed',
    lightText: '#0f172a',
    lightBorder: '#cbd5e1',
    lightShadow: 'rgba(0,0,0,0.05)',
    lightGradient: '#7c3aed',
    lightNavbar: '#ffffff',
    lightFooter: '#f8fafc',
    darkBackground: '#020617',
    darkCard: '#111827',
    darkButton: '#a78bfa',
    darkText: '#f8fafc',
    darkBorder: '#1e293b',
    darkShadow: 'rgba(0,0,0,0.5)',
    darkGradient: '#a78bfa',
    darkNavbar: '#111827',
    darkFooter: '#020617'
  },
  corporate: {
    homeGradient: 'from-slate-800 via-slate-900 to-slate-950',
    homeParticles: false,
    homeHeroEffect: 'none',
    projectCardStyle: 'flat',
    projectShadowStrength: 'light',
    projectHighlightColor: '#2563EB',
    skillsModalStyle: 'flat',
    skillsProgressStyle: 'solid',
    skillsCardAnimation: 'none',
    certificationsCardStyle: 'flat',
    certificationsBorderStyle: 'square',
    certificationsAnimation: 'none',
    accentColor: '#2563EB',
    surfaceColor: '#1E293B',
    hoverColor: '#1D4ED8',
    navbarType: 'horizontal',
    navbarLayout: 'fixed',
    navbarBehavior: 'list',
    lightBackground: '#f8fafc',
    lightCard: '#ffffff',
    lightButton: '#2563EB',
    lightText: '#0f172a',
    lightBorder: '#cbd5e1',
    lightShadow: 'rgba(0,0,0,0.05)',
    lightGradient: '#2563EB',
    lightNavbar: '#ffffff',
    lightFooter: '#f8fafc',
    darkBackground: '#020617',
    darkCard: '#1e293b',
    darkButton: '#3b82f6',
    darkText: '#f8fafc',
    darkBorder: '#334155',
    darkShadow: 'rgba(0,0,0,0.5)',
    darkGradient: '#3b82f6',
    darkNavbar: '#1e293b',
    darkFooter: '#020617'
  },
  glassmorphism: {
    homeGradient: 'from-violet-950/80 via-slate-950 to-fuchsia-950/80',
    homeParticles: true,
    homeHeroEffect: 'glowing-orb',
    projectCardStyle: 'glass-ultra',
    projectShadowStrength: 'strong',
    projectHighlightColor: '#A78BFA',
    skillsModalStyle: 'glass',
    skillsProgressStyle: 'glass-gradient',
    skillsCardAnimation: 'float-slow',
    certificationsCardStyle: 'glass',
    certificationsBorderStyle: 'rounded-xl',
    certificationsAnimation: 'scale',
    accentColor: '#C084FC',
    surfaceColor: '#1E1B4B',
    hoverColor: '#F472B6',
    navbarType: 'floating',
    navbarLayout: 'centered',
    navbarBehavior: 'grid',
    lightBackground: '#faf5ff',
    lightCard: 'rgba(255,255,255,0.7)',
    lightButton: '#a855f7',
    lightText: '#1e1b4b',
    lightBorder: 'rgba(168,85,247,0.2)',
    lightShadow: 'rgba(168,85,247,0.05)',
    lightGradient: '#a855f7',
    lightNavbar: 'rgba(255,255,255,0.8)',
    lightFooter: '#faf5ff',
    darkBackground: '#090514',
    darkCard: 'rgba(30,27,75,0.6)',
    darkButton: '#c084fc',
    darkText: '#f3e8ff',
    darkBorder: 'rgba(192,132,252,0.2)',
    darkShadow: 'rgba(0,0,0,0.6)',
    darkGradient: '#c084fc',
    darkNavbar: 'rgba(30,27,75,0.8)',
    darkFooter: '#090514'
  },
  softui: {
    homeGradient: 'from-slate-100 via-slate-50 to-white',
    homeParticles: false,
    homeHeroEffect: 'soft-glow',
    projectCardStyle: 'neumorphic',
    projectShadowStrength: 'light',
    projectHighlightColor: '#6366F1',
    skillsModalStyle: 'neumorphic',
    skillsProgressStyle: 'soft',
    skillsCardAnimation: 'pop',
    certificationsCardStyle: 'neumorphic',
    certificationsBorderStyle: 'rounded-2xl',
    certificationsAnimation: 'fade',
    accentColor: '#4F46E5',
    surfaceColor: '#F1F5F9',
    hoverColor: '#818CF8',
    navbarType: 'horizontal',
    navbarLayout: 'wrap',
    navbarBehavior: 'grid',
    lightBackground: '#f1f5f9',
    lightCard: '#e2e8f0',
    lightButton: '#4F46E5',
    lightText: '#1e293b',
    lightBorder: '#cbd5e1',
    lightShadow: 'rgba(0,0,0,0.05)',
    lightGradient: '#4F46E5',
    lightNavbar: '#f1f5f9',
    lightFooter: '#e2e8f0',
    darkBackground: '#0f172a',
    darkCard: '#1e293b',
    darkButton: '#818cf8',
    darkText: '#f1f5f9',
    darkBorder: '#334155',
    darkShadow: 'rgba(0,0,0,0.5)',
    darkGradient: '#818cf8',
    darkNavbar: '#0f172a',
    darkFooter: '#1e293b'
  },
  minimalista: {
    homeGradient: 'from-black via-zinc-950 to-black',
    homeParticles: false,
    homeHeroEffect: 'none',
    projectCardStyle: 'flat-border',
    projectShadowStrength: 'none',
    projectHighlightColor: '#FFFFFF',
    skillsModalStyle: 'flat-border',
    skillsProgressStyle: 'mono',
    skillsCardAnimation: 'none',
    certificationsCardStyle: 'flat-border',
    certificationsBorderStyle: 'square',
    certificationsAnimation: 'none',
    accentColor: '#F4F4F5',
    surfaceColor: '#09090B',
    hoverColor: '#A1A1AA',
    navbarType: 'horizontal',
    navbarLayout: 'wrap',
    navbarBehavior: 'list',
    lightBackground: '#ffffff',
    lightCard: '#ffffff',
    lightButton: '#000000',
    lightText: '#000000',
    lightBorder: '#000000',
    lightShadow: 'none',
    lightGradient: '#000000',
    lightNavbar: '#ffffff',
    lightFooter: '#ffffff',
    darkBackground: '#000000',
    darkCard: '#000000',
    darkButton: '#ffffff',
    darkText: '#ffffff',
    darkBorder: '#ffffff',
    darkShadow: 'none',
    darkGradient: '#ffffff',
    darkNavbar: '#000000',
    darkFooter: '#000000'
  },
  futurista: {
    homeGradient: 'from-zinc-950 via-slate-900 to-black',
    homeParticles: true,
    homeHeroEffect: 'matrix-rain',
    projectCardStyle: 'cyber',
    projectShadowStrength: 'strong',
    projectHighlightColor: '#10B981',
    skillsModalStyle: 'cyber',
    skillsProgressStyle: 'neon',
    skillsCardAnimation: 'glitch',
    certificationsCardStyle: 'cyber',
    certificationsBorderStyle: 'cut-corners',
    certificationsAnimation: 'glitch',
    accentColor: '#10B981',
    surfaceColor: '#022C22',
    hoverColor: '#34D399',
    navbarType: 'vertical-side',
    navbarLayout: 'compact',
    navbarBehavior: 'list',
    lightBackground: '#f0fdf4',
    lightCard: '#e6f4ea',
    lightButton: '#10b981',
    lightText: '#022c22',
    lightBorder: '#a7f3d0',
    lightShadow: 'rgba(16,185,129,0.05)',
    lightGradient: '#10b981',
    lightNavbar: '#e6f4ea',
    lightFooter: '#f0fdf4',
    darkBackground: '#022c22',
    darkCard: '#064e3b',
    darkButton: '#34d399',
    darkText: '#ecfdf5',
    darkBorder: '#065f46',
    darkShadow: 'rgba(0,0,0,0.6)',
    darkGradient: '#34d399',
    darkNavbar: '#022c22',
    darkFooter: '#064e3b'
  },
  tecnologico: {
    homeGradient: 'from-[#030712] via-[#0b1528] to-[#020617]',
    homeParticles: true,
    homeHeroEffect: 'scanline',
    projectCardStyle: 'tech-border',
    projectShadowStrength: 'medium',
    projectHighlightColor: '#00F2FE',
    skillsModalStyle: 'tech',
    skillsProgressStyle: 'cyber-pulse',
    skillsCardAnimation: 'float',
    certificationsCardStyle: 'tech-frame',
    certificationsBorderStyle: 'chamfered',
    certificationsAnimation: 'scale-fade',
    accentColor: '#00F2FE',
    surfaceColor: '#0b1329',
    hoverColor: '#4FACFE',
    navbarType: 'horizontal',
    navbarLayout: 'wrap',
    navbarBehavior: 'grid',
    lightBackground: '#ecfeff',
    lightCard: '#cffafe',
    lightButton: '#0891b2',
    lightText: '#083344',
    lightBorder: '#a5f3fc',
    lightShadow: 'rgba(8,145,178,0.05)',
    lightGradient: '#0891b2',
    lightNavbar: '#cffafe',
    lightFooter: '#ecfeff',
    darkBackground: '#020617',
    darkCard: '#0f172a',
    darkButton: '#38bdf8',
    darkText: '#f8fafc',
    darkBorder: '#1e293b',
    darkShadow: 'rgba(0,0,0,0.5)',
    darkGradient: '#38bdf8',
    darkNavbar: '#020617',
    darkFooter: '#0f172a'
  }
};

const AppearanceManager = () => {
  const { store, actions } = usePortfolio();
  const { appearance } = store.settings;
  const { toast } = useToast();
  
  const [helpOpen, setHelpOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('global');

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      homeGradient: appearance.home?.gradient || 'from-slate-900 via-brand-navy-900 to-slate-950',
      homeParticles: appearance.home?.particles !== false,
      homeHeroEffect: appearance.home?.heroEffect || 'glow',
      
      projectCardStyle: appearance.projects?.cardStyle || 'glass',
      projectShadowStrength: appearance.projects?.shadowStrength || 'medium',
      projectHighlightColor: appearance.projects?.highlightColor || '#09D8C7',
      
      skillsModalStyle: appearance.skills?.modalStyle || 'card',
      skillsProgressStyle: appearance.skills?.progressStyle || 'gradient',
      skillsCardAnimation: appearance.skills?.cardAnimation || 'float',
      
      certificationsCardStyle: appearance.certifications?.cardStyle || 'image-frame',
      certificationsBorderStyle: appearance.certifications?.borderStyle || 'rounded',
      certificationsAnimation: appearance.certifications?.animation || 'fade',
      
      accentColor: appearance.colors?.accent || '#09D8C7',
      surfaceColor: appearance.colors?.surface || '#0F223B',
      hoverColor: appearance.colors?.hover || '#38bdf8',
      
      lightBackground: appearance.colors?.light?.background || '#f8fafc',
      lightCard: appearance.colors?.light?.card || '#ffffff',
      lightButton: appearance.colors?.light?.button || '#7c3aed',
      lightText: appearance.colors?.light?.text || '#0f172a',
      lightBorder: appearance.colors?.light?.border || '#cbd5e1',
      lightShadow: appearance.colors?.light?.shadow || 'rgba(0,0,0,0.05)',
      lightGradient: appearance.colors?.light?.gradient || '#7c3aed',
      lightNavbar: appearance.colors?.light?.navbar || '#ffffff',
      lightFooter: appearance.colors?.light?.footer || '#f8fafc',
      
      darkBackground: appearance.colors?.dark?.background || '#020617',
      darkCard: appearance.colors?.dark?.card || '#111827',
      darkButton: appearance.colors?.dark?.button || '#a78bfa',
      darkText: appearance.colors?.dark?.text || '#f8fafc',
      darkBorder: appearance.colors?.dark?.border || '#1e293b',
      darkShadow: appearance.colors?.dark?.shadow || 'rgba(0,0,0,0.5)',
      darkGradient: appearance.colors?.dark?.gradient || '#a78bfa',
      darkNavbar: appearance.colors?.dark?.navbar || '#111827',
      darkFooter: appearance.colors?.dark?.footer || '#020617',
      
      navbarType: appearance.navbar?.type || 'horizontal',
      navbarLayout: appearance.navbar?.layout || 'wrap',
      navbarBehavior: appearance.navbar?.behavior || 'grid'
    }
  });

  const watchedValues = watch();

  const applyPreset = (presetKey) => {
    const preset = presets[presetKey];
    if (!preset) return;
    Object.keys(preset).forEach((key) => {
      setValue(key, preset[key]);
    });
    toast.success(`Preset "${presetKey.toUpperCase()}" aplicado en el formulario`);
  };

  const onSubmit = (data) => {
    try {
      actions.updateAppearance({
        home: {
          gradient: data.homeGradient,
          particles: data.homeParticles,
          heroEffect: data.homeHeroEffect
        },
        projects: {
          cardStyle: data.projectCardStyle,
          shadowStrength: data.projectShadowStrength,
          highlightColor: data.projectHighlightColor
        },
        skills: {
          modalStyle: data.skillsModalStyle,
          progressStyle: data.skillsProgressStyle,
          cardAnimation: data.skillsCardAnimation
        },
        certifications: {
          cardStyle: data.certificationsCardStyle,
          borderStyle: data.certificationsBorderStyle,
          animation: data.certificationsAnimation
        },
        colors: {
          ...appearance.colors,
          light: {
            ...appearance.colors?.light,
            background: data.lightBackground,
            card: data.lightCard,
            button: data.lightButton,
            text: data.lightText,
            border: data.lightBorder,
            shadow: data.lightShadow,
            gradient: data.lightGradient,
            navbar: data.lightNavbar,
            footer: data.lightFooter
          },
          dark: {
            ...appearance.colors?.dark,
            background: data.darkBackground,
            card: data.darkCard,
            button: data.darkButton,
            text: data.darkText,
            border: data.darkBorder,
            shadow: data.darkShadow,
            gradient: data.darkGradient,
            navbar: data.darkNavbar,
            footer: data.darkFooter
          },
          accent: data.accentColor,
          surface: data.surfaceColor,
          hover: data.hoverColor
        },
        navbar: {
          type: data.navbarType,
          layout: data.navbarLayout,
          behavior: styleBehavior(data)
        }
      });
      toast.success('Apariencia del portafolio guardada correctamente');
    } catch (e) {
      toast.error('Error al guardar la apariencia');
    }
  };

  const styleBehavior = (data) => {
    return data.navbarBehavior;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-[2rem] border border-[#17364F] bg-[#0D1A2F] p-6 text-white shadow-[0_20px_60px_-35px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#09D8C7]/80">Configuración visual</p>
            <h1 className="mt-3 text-3xl font-semibold">Apariencia</h1>
            <p className="mt-2 text-sm leading-relaxed text-[#C9F7EE]/85">
              Personaliza el diseño, gradientes, sombras y animaciones del portafolio público con presets de un clic.
            </p>
          </div>
          <button
            onClick={() => setHelpOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#09D8C7] bg-[#09D8C7]/10 px-4 py-3 text-sm font-semibold text-[#09D8C7] hover:bg-[#09D8C7]/20 transition duration-200 shrink-0"
          >
            <HelpCircle className="w-4 h-4" /> Ayuda
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <section className="rounded-[1.75rem] border border-[#17364F] bg-[#0D1A2F]/80 p-6 text-white space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-[#09D8C7]">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span>Presets de Diseño</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {Object.keys(presets).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(key)}
              className="px-4 py-3 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-[#C9F7EE] hover:bg-[#09D8C7]/15 hover:border-[#09D8C7] transition duration-200 capitalize text-center"
            >
              {key}
            </button>
          ))}
        </div>
      </section>

      {/* Main Container */}
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        
        {/* Editor Form */}
        <section className="rounded-[2rem] border border-[#17364F] bg-[#0D1A2F]/80 p-6 text-white space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex border-b border-slate-800">
              {[
                { id: 'global', label: 'Color Global', icon: Palette },
                { id: 'home', label: 'Home / Hero', icon: Settings },
                { id: 'modules', label: 'Proyectos & Cards', icon: Layers },
                { id: 'custom', label: 'Otros Componentes', icon: Sliders }
              ].map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
                      activeTab === tab.id
                        ? 'border-[#09D8C7] text-[#09D8C7]'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <form id="appearance-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Tab 1: Global Colors */}
              {activeTab === 'global' && (
                <div className="space-y-6">
                  {/* General settings */}
                  <div className="grid gap-5 md:grid-cols-3 pb-4 border-b border-slate-800">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white">Color de acento general</label>
                      <input
                        type="color"
                        {...register('accentColor')}
                        className="h-12 w-full rounded-2xl border border-slate-700 bg-slate-800 p-2 outline-none cursor-pointer"
                      />
                      <p className="text-[10px] text-slate-500">Color primario de la app.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white">Color de superficie general</label>
                      <input
                        type="color"
                        {...register('surfaceColor')}
                        className="h-12 w-full rounded-2xl border border-slate-700 bg-slate-800 p-2 outline-none cursor-pointer"
                      />
                      <p className="text-[10px] text-slate-500">Fondo de paneles y modales.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white">Color de hover general</label>
                      <input
                        type="color"
                        {...register('hoverColor')}
                        className="h-12 w-full rounded-2xl border border-slate-700 bg-slate-800 p-2 outline-none cursor-pointer"
                      />
                      <p className="text-[10px] text-slate-500">Color interactivo al posar el cursor.</p>
                    </div>
                  </div>

                  {/* Dual-column for Light and Dark theme configs */}
                  <div className="grid gap-8 md:grid-cols-2">
                    {/* Light theme */}
                    <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/40 p-5">
                      <h3 className="text-md font-bold text-[#09D8C7] border-b border-slate-800 pb-2">Configuración del Tema Claro</h3>
                      
                      <div className="space-y-4">
                        {[
                          { name: 'lightBackground', label: 'Background Global (Aplicar al tema claro)' },
                          { name: 'lightCard', label: 'Tarjetas / Cards (Aplicar al tema claro)' },
                          { name: 'lightButton', label: 'Botones (Aplicar al tema claro)' },
                          { name: 'lightText', label: 'Textos (Aplicar al tema claro)' },
                          { name: 'lightBorder', label: 'Bordes (Aplicar al tema claro)' },
                          { name: 'lightShadow', label: 'Sombras (Aplicar al tema claro)', isShadow: true },
                          { name: 'lightGradient', label: 'Gradientes (Aplicar al tema claro)' },
                          { name: 'lightNavbar', label: 'Navbar (Aplicar al tema claro)' },
                          { name: 'lightFooter', label: 'Footer (Aplicar al tema claro)' }
                        ].map((field) => (
                          <div key={field.name} className="flex items-center justify-between gap-4">
                            <label className="text-xs font-semibold text-slate-300">{field.label}</label>
                            {field.isShadow ? (
                              <input
                                type="text"
                                {...register(field.name)}
                                className="h-10 w-40 rounded-xl border border-slate-700 bg-slate-850 px-3 text-xs text-white outline-none focus:border-[#09D8C7]"
                              />
                            ) : (
                              <input
                                type="color"
                                {...register(field.name)}
                                className="h-10 w-16 rounded-xl border border-slate-700 bg-slate-850 p-1 outline-none cursor-pointer"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dark theme */}
                    <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/40 p-5">
                      <h3 className="text-md font-bold text-[#a78bfa] border-b border-slate-800 pb-2">Configuración del Tema Oscuro</h3>
                      
                      <div className="space-y-4">
                        {[
                          { name: 'darkBackground', label: 'Background Global (Aplicar al tema oscuro)' },
                          { name: 'darkCard', label: 'Tarjetas / Cards (Aplicar al tema oscuro)' },
                          { name: 'darkButton', label: 'Botones (Aplicar al tema oscuro)' },
                          { name: 'darkText', label: 'Textos (Aplicar al tema oscuro)' },
                          { name: 'darkBorder', label: 'Bordes (Aplicar al tema oscuro)' },
                          { name: 'darkShadow', label: 'Sombras (Aplicar al tema oscuro)', isShadow: true },
                          { name: 'darkGradient', label: 'Gradientes (Aplicar al tema oscuro)' },
                          { name: 'darkNavbar', label: 'Navbar (Aplicar al tema oscuro)' },
                          { name: 'darkFooter', label: 'Footer (Aplicar al tema oscuro)' }
                        ].map((field) => (
                          <div key={field.name} className="flex items-center justify-between gap-4">
                            <label className="text-xs font-semibold text-slate-300">{field.label}</label>
                            {field.isShadow ? (
                              <input
                                type="text"
                                {...register(field.name)}
                                className="h-10 w-40 rounded-xl border border-slate-700 bg-slate-850 px-3 text-xs text-white outline-none focus:border-[#a78bfa]"
                              />
                            ) : (
                              <input
                                type="color"
                                {...register(field.name)}
                                className="h-10 w-16 rounded-xl border border-slate-700 bg-slate-850 p-1 outline-none cursor-pointer"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Home Config */}
              {activeTab === 'home' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white">Gradiente de fondo del Hero</label>
                    <input
                      type="text"
                      {...register('homeGradient')}
                      placeholder="from-slate-900 via-brand-navy-900 to-slate-950"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-[#09D8C7] transition text-sm"
                    />
                    <p className="text-[10px] text-slate-400">Tokens Tailwind para fondos en gradiente.</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white">Efecto del Hero</label>
                      <select
                        {...register('homeHeroEffect')}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-[#09D8C7]"
                      >
                        <option value="glow">Glow (Brillo de fondo)</option>
                        <option value="matrix-rain">Matriz (Tecnológico)</option>
                        <option value="scanline">Scanline (Líneas de monitor)</option>
                        <option value="none">Ninguno</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-3 pt-8">
                      <input
                        id="homeParticles"
                        type="checkbox"
                        {...register('homeParticles')}
                        className="h-5 w-5 rounded border-[#09D8C7] text-[#09D8C7] focus:ring-[#09D8C7]"
                      />
                      <label htmlFor="homeParticles" className="text-sm font-semibold text-white">Partículas interactivas</label>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Projects & Card styles */}
              {activeTab === 'modules' && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white">Estilo tarjetas proyectos</label>
                      <select
                        {...register('projectCardStyle')}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-[#09D8C7]"
                      >
                        <option value="glass">Glassmorphism clásico</option>
                        <option value="flat">Plano simple</option>
                        <option value="flat-border">Líneas negras gruesas</option>
                        <option value="neumorphic">Soft UI (Neumorfismo)</option>
                        <option value="cyber">Cyberpunk Neon</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white">Intensidad de sombra</label>
                      <select
                        {...register('projectShadowStrength')}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-[#09D8C7]"
                      >
                        <option value="none">Sin sombra</option>
                        <option value="light">Suave</option>
                        <option value="medium">Mediana</option>
                        <option value="strong">Intensa</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white">Color de realce</label>
                    <input
                      type="text"
                      {...register('projectHighlightColor')}
                      placeholder="#09D8C7"
                      className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-[#09D8C7] transition text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Tab 4: Other Components */}
              {activeTab === 'custom' && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white">Estilo de progreso (Skills)</label>
                      <select
                        {...register('skillsProgressStyle')}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-[#09D8C7]"
                      >
                        <option value="gradient">Gradiente dinámico</option>
                        <option value="solid">Sólido</option>
                        <option value="neon">Neon Brillante</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white">Comportamiento Navbar</label>
                      <select
                        {...register('navbarType')}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-[#09D8C7]"
                      >
                        <option value="horizontal">Horizontal clásico</option>
                        <option value="floating">Flotante moderno</option>
                        <option value="vertical-side">Barra lateral fija</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white">Animación Certificaciones</label>
                      <select
                        {...register('certificationsAnimation')}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-[#09D8C7]"
                      >
                        <option value="fade">Disolución suave</option>
                        <option value="scale">Escalar al entrar</option>
                        <option value="none">Sin animación</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white">Comportamiento visual menú</label>
                      <select
                        {...register('navbarBehavior')}
                        className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-[#09D8C7]"
                      >
                        <option value="grid">Grilla interactiva</option>
                        <option value="list">Lista plana</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

            </form>
          </div>

          <div className="flex justify-end pt-6 border-t border-slate-850">
            <button
              form="appearance-form"
              type="submit"
              className="rounded-2xl bg-[#09D8C7] px-6 py-4 text-sm font-bold text-[#0D1A2F] hover:bg-[#08c1b6] transition duration-200 shadow-lg shadow-[#09D8C7]/15"
            >
              Guardar apariencia
            </button>
          </div>
        </section>

        {/* Live Preview Column */}
        <section className="rounded-[2rem] border border-[#17364F] bg-[#11243B] p-6 shadow-lg shadow-[#0D1A2F]/10 text-white space-y-6">
          <div className="pb-4 border-b border-[#09D8C7]/10 flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#09D8C7]" />
            <div>
              <h2 className="text-xl font-semibold text-white">Vista Previa Real</h2>
              <p className="text-xs text-[#B8EDE6]">Simulación en tiempo real de los componentes en base a tus selecciones.</p>
            </div>
          </div>

          <div className="space-y-6">
            
            {/* Nav preview */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-[#09D8C7]">Navbar & Enlaces</p>
              <div 
                className={`p-3 rounded-xl border flex items-center justify-between transition-colors duration-300`}
                style={{ 
                  backgroundColor: watchedValues.surfaceColor, 
                  borderColor: watchedValues.accentColor + '40'
                }}
              >
                <span className="text-xs font-bold">Logo QA</span>
                <div className="flex items-center gap-3">
                  <span 
                    className="text-xs px-2 py-1 rounded transition-colors"
                    style={{ color: watchedValues.accentColor }}
                  >
                    Home
                  </span>
                  <span className="text-xs text-slate-400">Proyectos</span>
                </div>
              </div>
            </div>

            {/* Project Card preview */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-[#09D8C7]">Ficha de Proyectos</p>
              <div 
                className={`p-5 rounded-2xl border transition-all duration-300 ${
                  watchedValues.projectCardStyle === 'glass' || watchedValues.projectCardStyle === 'glass-ultra'
                    ? 'backdrop-blur-md bg-white/5' 
                    : watchedValues.projectCardStyle === 'flat-border'
                    ? 'bg-[#0D1A2F] border-2' 
                    : watchedValues.projectCardStyle === 'neumorphic'
                    ? 'bg-[#1e293b] border-slate-700/30'
                    : 'bg-[#0F223B]'
                }`}
                style={{ 
                  borderColor: watchedValues.projectCardStyle === 'flat-border' ? '#ffffff' : watchedValues.accentColor + '30',
                  boxShadow: watchedValues.projectShadowStrength === 'strong' 
                    ? '0 25px 50px -12px rgba(0,0,0,0.5)' 
                    : watchedValues.projectShadowStrength === 'medium'
                    ? '0 10px 15px -3px rgba(0,0,0,0.3)' 
                    : 'none'
                }}
              >
                <div 
                  className="h-1.5 w-full -mt-5 -mx-5 rounded-t-2xl mb-4"
                  style={{ backgroundColor: watchedValues.accentColor }}
                />
                <span className="text-[10px] font-bold" style={{ color: watchedValues.accentColor }}>AUTOMATIZACIÓN</span>
                <h4 className="font-bold text-sm mt-1">E-Commerce Test Pipeline</h4>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">Ejemplo de tarjeta pública interactiva.</p>
                <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-slate-800">
                  <span className="text-[10px]" style={{ color: watchedValues.hoverColor }}>Ver detalles</span>
                  <span className="text-[10px] text-slate-500">Playwright</span>
                </div>
              </div>
            </div>

            {/* Skills preview */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-[#09D8C7]">Barra de Progreso (Skills)</p>
              <div 
                className="p-4 rounded-xl border"
                style={{ 
                  backgroundColor: watchedValues.surfaceColor,
                  borderColor: watchedValues.accentColor + '20' 
                }}
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <span>Cypress E2E</span>
                  <span style={{ color: watchedValues.accentColor }}>85%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: '85%',
                      background: watchedValues.skillsProgressStyle === 'gradient'
                        ? `linear-gradient(to right, ${watchedValues.accentColor}, ${watchedValues.hoverColor})`
                        : watchedValues.accentColor
                    }}
                  />
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>

      {helpOpen && (
        <Modal
          isOpen={helpOpen}
          onClose={() => setHelpOpen(false)}
          title="Manual de Configuración de Apariencia"
          subtitle="Guía detallada para asegurar consistencia visual y accesibilidad."
          footer={
            <button
              type="button"
              onClick={() => setHelpOpen(false)}
              className="rounded-2xl bg-[#09D8C7] px-5 py-3 text-sm font-semibold text-[#0D1A2F] hover:bg-[#08c1b6]"
            >
              Entendido
            </button>
          }
        >
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 text-xs text-[#C9F7EE] leading-relaxed">
            <div className="rounded-2xl border border-[#17364F] bg-[#0D1A2F]/80 p-4 space-y-2">
              <h3 className="font-bold text-white text-sm">🎨 ¿Qué modifica cada opción?</h3>
              <p>Las propiedades de color configuradas se aplican dinámicamente a toda la web a través de variables CSS globales:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Background Global:</strong> Color base de la página (afecta a <code className="bg-[#11243B] px-1 rounded text-[#09D8C7]">body</code>).</li>
                <li><strong>Tarjetas / Cards:</strong> Fondo de las cajas de contenido de Skills, Proyectos y Certificaciones.</li>
                <li><strong>Botones:</strong> Color de los botones y elementos clicables primarios.</li>
                <li><strong>Textos:</strong> Color de los textos principales (títulos, párrafos, subtítulos).</li>
                <li><strong>Bordes:</strong> Grosor y tono de las líneas delimitadoras en tarjetas y modales.</li>
                <li><strong>Sombras:</strong> Profundidad 3D de tarjetas en flotación (soporta valores CSS como <code className="bg-[#11243B] px-1 rounded text-[#09D8C7]">rgba(...)</code> o <code className="bg-[#11243B] px-1 rounded text-[#09D8C7]">none</code>).</li>
                <li><strong>Gradientes:</strong> Fondos con transiciones de color en banners y barras de carga.</li>
                <li><strong>Navbar & Footer:</strong> Fondo de la barra de navegación superior y el pie de página inferior.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#17364F] bg-[#0D1A2F]/80 p-4 space-y-2">
              <h3 className="font-bold text-white text-sm">📌 Componentes Afectados y Dependencias</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Dependencia del Tema Activo:</strong> Las configuraciones del Modo Claro se aplican únicamente cuando el usuario tiene activado el tema claro; lo mismo aplica para el Modo Oscuro. Esto garantiza transiciones fluidas.</li>
                <li><strong>Dependencia de Presets:</strong> Si aplicas un preset de la barra superior, todos los campos se sobrescribirán temporalmente en el formulario para coordinar un estilo conjunto (ej: Neumorfismo o Cyberpunk).</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#17364F] bg-[#0D1A2F]/80 p-4 space-y-2">
              <h3 className="font-bold text-white text-sm">💡 Ejemplos de Uso y Recomendaciones</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Tema Claro Premium:</strong> Fondo Global: <code className="text-[#09D8C7]">#F8FAFC</code> | Cards: <code className="text-[#09D8C7]">#FFFFFF</code> | Texto: <code className="text-[#09D8C7]">#0F172A</code>. Aporta una lectura relajante y limpia.</li>
                <li><strong>Tema Oscuro Espacial:</strong> Fondo Global: <code className="text-[#09D8C7]">#020617</code> | Cards: <code className="text-[#09D8C7]">#0F172A</code> | Texto: <code className="text-[#09D8C7]">#F8FAFC</code>.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#BD0927] bg-[#BD0927]/10 p-4 space-y-2">
              <h3 className="font-bold text-[#FF7E8B] text-sm">⚠️ Riesgos de Configuración</h3>
              <p>Evita configurar el color de texto idéntico al color de fondo global o de las tarjetas. Esto anularía el contraste mínimo exigido por las normas de accesibilidad <strong>WCAG 2.1 (A11Y)</strong>, impidiendo leer el portafolio.</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AppearanceManager;

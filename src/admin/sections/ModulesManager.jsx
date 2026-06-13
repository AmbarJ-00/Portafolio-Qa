import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { ConfirmDialog } from '../../components/ConfirmDialog.jsx';
import { 
  Plus, GripVertical, Info, ArrowUpDown, X, Edit, Trash2, 
  HelpCircle, ChevronLeft, ChevronRight, Activity, Check, 
  Settings, AlertTriangle, Layers, Eye 
} from 'lucide-react';
import Modal from '../../components/Modal.jsx';

// Sortable Item Component
const SortableModuleItem = ({ module, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: module.id });
  
  const statusLabels = {
    active: 'Activo',
    inactive: 'Inactivo',
    maintenance: 'Mantenimiento',
    creative: 'En proceso creativo'
  };

  const statusColors = {
    active: 'bg-[#10b981]/15 text-[#10b981]',
    inactive: 'bg-[#ef4444]/15 text-[#ef4444]',
    maintenance: 'bg-[#f59e0b]/15 text-[#f59e0b]',
    creative: 'bg-[#a78bfa]/15 text-[#a78bfa]'
  };

  const layoutLabels = {
    cards: 'Tarjetas',
    modales: 'Modales',
    métricas: 'Métricas',
    carruseles: 'Carruseles'
  };

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#17364F] bg-[#11243B] p-5 shadow-lg shadow-[#0D1A2F]/20 focus-within:ring-2 focus-within:ring-[#09D8C7] transition duration-200"
    >
      <div className="flex items-start gap-3 flex-1">
        <div className="rounded-2xl bg-[#0D1A2F] p-3 text-[#09D8C7] flex items-center justify-center shrink-0">
          <GripVertical className="w-5 h-5 cursor-grab" {...listeners} {...attributes} />
        </div>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-white text-lg">{module.name}</p>
            <span className={`px-2 py-0.5 rounded-full text-xxs font-semibold uppercase tracking-wider ${statusColors[module.status] || 'bg-[#09D8C7]/15 text-[#09D8C7]'}`}>
              {statusLabels[module.status] || 'Activo'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xxs font-semibold uppercase tracking-wider bg-brand-navy-900 text-brand-ash-300">
              {layoutLabels[module.elementsType] || 'Tarjetas'}
            </span>
            {!module.configurado && (
              <span className="px-2 py-0.5 rounded-full text-xxs font-semibold uppercase tracking-wider bg-red-500/15 text-red-500 border border-red-500/30">
                Pendiente de Configuración
              </span>
            )}
          </div>
          <p className="text-sm text-[#C9F7EE]/90 line-clamp-2">{module.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        <button 
          onClick={() => onEdit(module)} 
          className="rounded-2xl border border-[#09D8C7] px-4 py-2 text-sm font-semibold text-[#09D8C7] hover:bg-[#09D8C7]/10 focus:outline-none focus:ring-2 focus:ring-[#09D8C7] transition"
        >
          Editar
        </button>
        <button 
          onClick={() => onDelete(module)} 
          className="rounded-2xl border border-[#BD0927] bg-[#BD0927]/10 px-4 py-2 text-sm font-semibold text-[#BD0927] hover:bg-[#BD0927]/20 focus:outline-none focus:ring-2 focus:ring-[#BD0927] transition"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

const ModulesManager = () => {
  const { store, actions } = usePortfolio();
  const { toast } = useToast();
  
  // Wizard States
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [wizardStep, setWizardStep] = useState(1);
  const [showInstructions, setShowInstructions] = useState(true);

  // Form Fields States
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Layers');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [creativeMessage, setCreativeMessage] = useState('');
  const [elementsType, setElementsType] = useState('cards');
  const [accentColor, setAccentColor] = useState('#09D8C7');
  const [surfaceColor, setSurfaceColor] = useState('#0D1A2F');
  const [animation, setAnimation] = useState('fade-in');
  const [elements, setElements] = useState([]);

  // Element Builder Temporary States
  const [tempDescription, setTempDescription] = useState('');
  const [tempImage, setTempImage] = useState('');
  const [tempUrl, setTempUrl] = useState('');
  const [tempStatus, setTempStatus] = useState('active');
  const [tempContent, setTempContent] = useState('');
  const [tempValue, setTempValue] = useState('');
  const [tempPercentage, setTempPercentage] = useState(false);
  const [tempIndicator, setTempIndicator] = useState('');
  const [tempText, setTempText] = useState('');
  const [editingElementIndex, setEditingElementIndex] = useState(null);

  // Deletion confirm states
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);

  const resetForm = () => {
    setName('');
    setIcon('Layers');
    setDescription('');
    setStatus('active');
    setCreativeMessage('');
    setElementsType('cards');
    setAccentColor('#09D8C7');
    setSurfaceColor('#0D1A2F');
    setAnimation('fade-in');
    setElements([]);
    setWizardStep(1);
    setIsEditing(false);
    setEditingModuleId(null);
    clearTempInputs();
  };

  const clearTempInputs = () => {
    setTempDescription('');
    setTempImage('');
    setTempUrl('');
    setTempStatus('active');
    setTempContent('');
    setTempValue('');
    setTempPercentage(false);
    setTempIndicator('');
    setTempText('');
    setEditingElementIndex(null);
  };

  const openNewModuleWizard = () => {
    resetForm();
    setIsWizardOpen(true);
  };

  const openEditModuleWizard = (module) => {
    resetForm();
    setIsEditing(true);
    setEditingModuleId(module.id);
    setName(module.name || '');
    setIcon(module.icon || 'Layers');
    setDescription(module.description || '');
    setStatus(module.status || 'active');
    setCreativeMessage(module.creativeMessage || '');
    setElementsType(module.elementsType || 'cards');
    setAccentColor(module.colors?.accent || '#09D8C7');
    setSurfaceColor(module.colors?.surface || '#0D1A2F');
    setAnimation(module.animation || 'fade-in');
    setElements(module.elements || []);
    setIsWizardOpen(true);
  };

  // Step Validation
  const isStepValid = () => {
    if (wizardStep === 1) {
      return name.trim().length >= 3 && description.trim().length >= 10 && icon.trim().length >= 2;
    }
    if (wizardStep === 2) {
      return elementsType && accentColor && surfaceColor && animation;
    }
    if (wizardStep === 3) {
      return elements.length > 0;
    }
    return true;
  };

  // Add Element to current list
  const handleAddElement = () => {
    let newItem = {};

    if (elementsType === 'cards') {
      if (!tempDescription.trim()) {
        toast.error('La descripción de la tarjeta es obligatoria');
        return;
      }
      newItem = {
        description: tempDescription,
        image: tempImage,
        url: tempUrl,
        status: tempStatus
      };
    } else if (elementsType === 'modales') {
      if (!tempDescription.trim() || !tempContent.trim()) {
        toast.error('La descripción y el contenido del modal son obligatorios');
        return;
      }
      newItem = {
        description: tempDescription,
        content: tempContent,
        url: tempUrl
      };
    } else if (elementsType === 'métricas') {
      if (!tempValue.trim() || !tempIndicator.trim()) {
        toast.error('El valor y el indicador de la métrica son obligatorios');
        return;
      }
      newItem = {
        value: tempValue,
        percentage: tempPercentage,
        indicator: tempIndicator
      };
    } else if (elementsType === 'carruseles') {
      if (!tempText.trim()) {
        toast.error('El texto de la diapositiva es obligatorio');
        return;
      }
      newItem = {
        text: tempText,
        image: tempImage
      };
    }

    if (editingElementIndex !== null) {
      // Update existing item
      const updatedElements = [...elements];
      updatedElements[editingElementIndex] = newItem;
      setElements(updatedElements);
      toast.success('Elemento actualizado');
    } else {
      // Add new item
      setElements([...elements, newItem]);
      toast.success('Elemento añadido');
    }

    clearTempInputs();
  };

  const handleEditElement = (index) => {
    const item = elements[index];
    setEditingElementIndex(index);

    if (elementsType === 'cards') {
      setTempDescription(item.description || '');
      setTempImage(item.image || '');
      setTempUrl(item.url || '');
      setTempStatus(item.status || 'active');
    } else if (elementsType === 'modales') {
      setTempDescription(item.description || '');
      setTempContent(item.content || '');
      setTempUrl(item.url || '');
    } else if (elementsType === 'métricas') {
      setTempValue(item.value || '');
      setTempPercentage(item.percentage || false);
      setTempIndicator(item.indicator || '');
    } else if (elementsType === 'carruseles') {
      setTempText(item.text || '');
      setTempImage(item.image || '');
    }
  };

  const handleDeleteElement = (index) => {
    setElements(elements.filter((_, idx) => idx !== index));
    toast.success('Elemento eliminado del listado');
    if (editingElementIndex === index) {
      clearTempInputs();
    }
  };

  // Helper to generate the React component physical template
  const generateComponentJSX = () => {
    const compName = name.replace(/[^a-zA-Z0-9]/g, '');

    let renderCode = '';
    if (elementsType === 'cards') {
      renderCode = `
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
      </div>`;
    } else if (elementsType === 'modales') {
      renderCode = `
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {elements.map((item, idx) => (
            <button 
              key={idx} 
              onClick={() => setActiveModalItem(item)}
              className="glass-card glass-card-hover p-6 rounded-2xl text-left flex flex-col justify-between h-full group cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-electric-500 outline-none border-l-4"
              style={{ borderLeftColor: accentColor }}
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: accentColor }}>Ver Detalles</span>
                <p className="text-sm text-brand-navy-700 dark:text-brand-ash-300 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>
              <span className="text-xs font-bold text-brand-navy-450 group-hover:text-brand-electric-500 transition-colors mt-4 block">
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
      </>`;
    } else if (elementsType === 'métricas') {
      renderCode = `
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {elements.map((item, idx) => (
          <div 
            key={idx} 
            className="glass-card p-6 rounded-2xl flex items-center gap-4 border-l-4"
            style={{ borderLeftColor: accentColor }}
          >
            <div className="p-3 rounded-xl bg-brand-electric-500/10 text-brand-electric-500" style={{ color: accentColor }}>
              <Activity className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-display font-extrabold text-brand-navy-900 dark:text-white">
                {item.value || '0'}
                {item.percentage ? '%' : ''}
              </div>
              <div className="text-xs font-semibold text-brand-navy-550 dark:text-brand-ash-400 uppercase tracking-wider">
                {item.indicator}
              </div>
            </div>
          </div>
        ))}
      </div>`;
    } else if (elementsType === 'carruseles') {
      renderCode = `
      <div className="relative glass-card rounded-[2rem] p-8 max-w-3xl mx-auto overflow-hidden">
        <div className="min-h-[240px] flex flex-col justify-between space-y-6">
          {elements[carouselIndex]?.image && (
            <img 
              src={elements[carouselIndex].image} 
              alt="Slide visual" 
              className="w-full h-64 object-cover rounded-xl"
            />
          )}
          <p className="text-lg text-brand-navy-700 dark:text-brand-ash-300 leading-relaxed italic text-center">
            "{elements[carouselIndex]?.text}"
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
      </div>`;
    }

    return `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Activity, X } from 'lucide-react';

const ${compName} = () => {
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const elements = ${JSON.stringify(elements, null, 2)};
  const accentColor = "${accentColor}";
  const surfaceColor = "${surfaceColor}";

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % elements.length);
  };
  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + elements.length) % elements.length);
  };

  return (
    <div className="space-y-8 p-6 rounded-3xl" style={{ backgroundColor: surfaceColor }}>
      <div className="space-y-2">
        <h2 className="text-3xl font-display font-extrabold text-brand-navy-900 dark:text-white">${name}</h2>
        <div className="h-1 w-20 rounded" style={{ backgroundColor: accentColor }} />
      </div>
      ${renderCode}
    </div>
  );
};

export default ${compName};
`;
  };

  // Submit and Persist to API
  const handleSaveModule = async () => {
    if (!isStepValid()) {
      toast.error('Por favor, completa correctamente los campos obligatorios.');
      return;
    }

    const payload = {
      name,
      icon,
      description,
      status,
      creativeMessage,
      elementsType,
      accentColor,
      surfaceColor,
      animation,
      elements
    };

    try {
      // 1. Save state in local Portfolio Store
      if (isEditing) {
        actions.updateModule(editingModuleId, { ...payload, configurado: true });
      } else {
        actions.addModule({ ...payload, configurado: false });
      }

      // 2. Generate content code for physical file
      const codeJSX = generateComponentJSX();

      // 3. Post file content to local API middleware
      const response = await fetch('/api/create-module', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          content: codeJSX
        })
      });

      if (!response.ok) {
        throw new Error('Error al guardar el componente en el sistema de archivos');
      }

      const resData = await response.json();

      toast.success(
        isEditing 
          ? `Módulo "${name}" actualizado y guardado en archivo físico.` 
          : `Módulo "${name}" creado con éxito y guardado en archivo físico.`
      );
      
      setIsWizardOpen(false);
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error(`Error: ${err.message || 'No se pudo guardar el módulo'}`);
    }
  };

  const handleDeleteClick = (module) => {
    setModuleToDelete(module);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (moduleToDelete) {
      try {
        actions.deleteModule(moduleToDelete.id);
        toast.success('Módulo eliminado correctamente');
      } catch (e) {
        toast.error('Error al eliminar el módulo');
      }
      setModuleToDelete(null);
    }
    setIsDeleteConfirmOpen(false);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = store.settings.modules.findIndex((item) => item.id === active.id);
      const newIndex = store.settings.modules.findIndex((item) => item.id === over?.id);
      const nextOrder = arrayMove(store.settings.modules, oldIndex, newIndex);
      actions.reorderModules(nextOrder);
      toast.success('Orden de módulos actualizado');
    }
  };

  return (
    <div className="space-y-8">
      {/* Title Header Card */}
      <div className="rounded-[2rem] border border-[#17364F] bg-[#0D1A2F] p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.5)] text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#09D8C7]/80">Panel administrativo</p>
            <h1 className="mt-4 text-4xl font-bold">Gestión de módulos</h1>
            <p className="mt-3 max-w-2xl text-sm text-[#C9F7EE]">Crea, edita y administra módulos interactivos basados en plantillas estructurales y físicas.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowInstructions((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#09D8C7] bg-[#09D8C7]/10 px-4 py-3 text-sm font-semibold text-[#09D8C7] hover:bg-[#09D8C7]/20 focus:outline-none focus:ring-2 focus:ring-[#09D8C7] transition"
            >
              <Info className="w-4 h-4" /> {showInstructions ? 'Ocultar' : 'Ver'} instrucciones
            </button>
            <button
              onClick={openNewModuleWizard}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#09D8C7] px-5 py-3 text-sm font-bold text-[#0D1A2F] hover:bg-[#08c1b6] focus:outline-none focus:ring-2 focus:ring-[#09D8C7] transition shadow-lg shadow-[#09D8C7]/10"
            >
              <Plus className="w-4 h-4" /> Nuevo módulo dinámico
            </button>
          </div>
        </div>
      </div>

      {/* Instructions Card */}
      {showInstructions && (
        <section className="rounded-[1.75rem] border border-[#17364F] bg-[#11243B] p-6 shadow-lg shadow-[#0D1A2F]/20 text-[#E2E8F0] space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#09D8C7]" /> Guía de Layouts y Estructuras
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[#17364F]/50 bg-[#0D1A2F]/60 p-4 space-y-2">
              <span className="text-xs font-bold text-[#09D8C7] uppercase tracking-wide">1. Tarjetas (Cards)</span>
              <p className="text-xs text-[#C9F7EE]/80">Grid dinámico ideal para enlaces externos, recursos visuales o listado de elementos con estatus individual.</p>
            </div>
            <div className="rounded-2xl border border-[#17364F]/50 bg-[#0D1A2F]/60 p-4 space-y-2">
              <span className="text-xs font-bold text-[#09D8C7] uppercase tracking-wide">2. Modales (Modales)</span>
              <p className="text-xs text-[#C9F7EE]/80">Permite listar items interactivos que abren ventanas modales con información detallada al hacer clic.</p>
            </div>
            <div className="rounded-2xl border border-[#17364F]/50 bg-[#0D1A2F]/60 p-4 space-y-2">
              <span className="text-xs font-bold text-[#09D8C7] uppercase tracking-wide">3. Métricas (Métricas)</span>
              <p className="text-xs text-[#C9F7EE]/80">Panel estadístico que renderiza valores numéricos, porcentajes e indicadores clave de rendimiento.</p>
            </div>
            <div className="rounded-2xl border border-[#17364F]/50 bg-[#0D1A2F]/60 p-4 space-y-2">
              <span className="text-xs font-bold text-[#09D8C7] uppercase tracking-wide">4. Carruseles (Carruseles)</span>
              <p className="text-xs text-[#C9F7EE]/80">Diapositivas deslizantes para testimoniales, citas célebres, galería de imágenes o hitos en secuencia.</p>
            </div>
          </div>
        </section>
      )}

      {/* Main Grid View */}
      <div className="space-y-4">
        <div className="rounded-[1.75rem] border border-[#17364F] bg-[#11243B]/90 p-6 shadow-lg shadow-[#0D1A2F]/20 text-[#E2E8F0]">
          <h2 className="text-xl font-semibold text-white">Módulos existentes</h2>
          <p className="mt-1 text-sm text-[#C9F7EE]">Arrastra los elementos por el control izquierdo para reordenar la disposición o edítalos para modificar sus contenidos.</p>
        </div>
        
        {store.settings.modules.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#17364F] p-12 text-center text-brand-ash-400">
            No hay módulos configurados. ¡Haz clic en "Nuevo módulo dinámico" para empezar!
          </div>
        ) : (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={store.settings.modules.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {store.settings.modules.map((module) => (
                  <SortableModuleItem 
                    key={module.id} 
                    module={module} 
                    onEdit={openEditModuleWizard} 
                    onDelete={handleDeleteClick} 
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Wizard Modal */}
      {isWizardOpen && (
        <Modal
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          title={isEditing ? `Editar módulo: ${name}` : 'Crear nuevo módulo dinámico'}
          subtitle={`Paso ${wizardStep} de 4: ${
            wizardStep === 1 ? 'Información General' : 
            wizardStep === 2 ? 'Estilo y Animación' : 
            wizardStep === 3 ? 'Construcción de Elementos' : 'Resumen y Confirmación'
          }`}
          footer={
            <div className="flex flex-wrap justify-between items-center w-full gap-3">
              <div>
                {wizardStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setWizardStep((prev) => prev - 1)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-[#17364F] px-5 py-3 text-sm font-semibold text-[#C9F7EE] hover:bg-[#17364F]/20 transition"
                  >
                    <ChevronLeft className="w-4 h-4" /> Atrás
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsWizardOpen(false)}
                  className="rounded-2xl border border-[#17364F] px-5 py-3 text-sm font-semibold text-[#C9F7EE] hover:bg-[#17364F]/10 transition"
                >
                  Cancelar
                </button>
                {wizardStep < 4 ? (
                  <button
                    type="button"
                    disabled={!isStepValid()}
                    onClick={() => setWizardStep((prev) => prev + 1)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#09D8C7] px-5 py-3 text-sm font-bold text-[#0D1A2F] hover:bg-[#08c1b6] disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Siguiente <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveModule}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#09D8C7] px-6 py-3 text-sm font-bold text-[#0D1A2F] hover:bg-[#08c1b6] transition"
                  >
                    <Check className="w-4 h-4" /> Confirmar y Guardar
                  </button>
                )}
              </div>
            </div>
          }
        >
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 text-white">
            
            {/* Step Progress Indicators */}
            <div className="flex items-center justify-between gap-2 border-b border-[#17364F] pb-4 mb-4">
              {[
                { step: 1, label: 'General' },
                { step: 2, label: 'Diseño' },
                { step: 3, label: 'Items' },
                { step: 4, label: 'Confirmación' }
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    wizardStep === s.step ? 'bg-[#09D8C7] text-[#0D1A2F]' : 
                    wizardStep > s.step ? 'bg-[#10b981] text-white' : 'bg-[#11243B] text-brand-ash-400 border border-[#17364F]'
                  }`}>
                    {wizardStep > s.step ? <Check className="w-4 h-4" /> : s.step}
                  </div>
                  <span className={`text-xs font-semibold hidden md:inline ${wizardStep === s.step ? 'text-[#09D8C7]' : 'text-brand-ash-400'}`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* PASO 1: INFORMACIÓN GENERAL */}
            {wizardStep === 1 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white">Nombre del módulo *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Métricas de Cobertura, Proyectos QA..."
                    className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
                  />
                  <p className="text-xs text-[#C9F7EE]">Mínimo 3 caracteres. Se utilizará para generar el archivo físico React.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white">Icono Lucide *</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="Ej. Layers, Activity, ShieldCheck, Terminal..."
                    className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
                  />
                  <p className="text-xs text-[#C9F7EE]">Especifica el nombre exacto de la clase del icono (Ej: Layers, Monitor, GitBranch, CPU).</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white">Descripción corta *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Escribe una descripción que presente este módulo dinámico..."
                    rows={3}
                    className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
                  />
                  <p className="text-xs text-[#C9F7EE]">Mínimo 10 caracteres.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white">Estado del módulo</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
                    >
                      <option value="active">Activo</option>
                      <option value="inactive">Inactivo</option>
                      <option value="maintenance">Mantenimiento</option>
                      <option value="creative">En proceso creativo</option>
                    </select>
                  </div>

                  {status === 'creative' && (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white">Mensaje de proceso creativo</label>
                      <input
                        type="text"
                        value={creativeMessage}
                        onChange={(e) => setCreativeMessage(e.target.value)}
                        placeholder="Ej. Diseñando métricas e indicadores de rendimiento..."
                        className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PASO 2: DISEÑO Y ESTILOS */}
            {wizardStep === 2 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white">Estructura / Tipo de Layout *</label>
                  <select
                    value={elementsType}
                    onChange={(e) => setElementsType(e.target.value)}
                    className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
                  >
                    <option value="cards">Tarjetas (Cards Grid)</option>
                    <option value="modales">Modales (Interactive Popups)</option>
                    <option value="métricas">Métricas (Stats & KPIs)</option>
                    <option value="carruseles">Carruseles (Slideshow Layout)</option>
                  </select>
                  <p className="text-xs text-[#C9F7EE]">Determina cómo se estructuran y presentan los elementos en la vista pública.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white">Color de Acento *</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="h-12 w-20 rounded-xl border border-[#17364F] bg-[#0D1A2F] p-1 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white">Color de Fondo / Superficie *</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={surfaceColor}
                        onChange={(e) => setSurfaceColor(e.target.value)}
                        className="h-12 w-20 rounded-xl border border-[#17364F] bg-[#0D1A2F] p-1 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={surfaceColor}
                        onChange={(e) => setSurfaceColor(e.target.value)}
                        className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white">Efecto / Animación de Entrada *</label>
                  <input
                    type="text"
                    value={animation}
                    onChange={(e) => setAnimation(e.target.value)}
                    placeholder="fade-in, slide-up, zoom-in, bounce..."
                    className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
                  />
                  <p className="text-xs text-[#C9F7EE]">Efecto de Framer Motion aplicado al renderizar el contenedor.</p>
                </div>
              </div>
            )}

            {/* PASO 3: CONSTRUCCIÓN DE ELEMENTOS */}
            {wizardStep === 3 && (
              <div className="space-y-6">
                
                {/* Visual reference warning */}
                <div className="rounded-2xl border border-[#09D8C7]/40 bg-[#09D8C7]/5 p-4 text-sm text-[#C9F7EE] space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-white">
                    <AlertTriangle className="w-4 h-4 text-[#09D8C7]" /> Referencia Estructural
                  </p>
                  <p className="text-xs">
                    Toma como referencia visual y estructural los módulos <strong className="text-[#09D8C7]">Skills</strong> y <strong className="text-[#09D8C7]">Projects</strong> existentes actualmente en el portafolio para organizar el contenido.
                  </p>
                </div>

                {/* Element builder inputs form */}
                <div className="rounded-2xl border border-[#17364F] bg-[#0D1A2F]/80 p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {editingElementIndex !== null ? 'Editar Elemento' : 'Añadir Nuevo Elemento'}
                  </h3>

                  {/* CARDS TYPE INPUTS */}
                  {elementsType === 'cards' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-brand-ash-300">Descripción de la tarjeta *</label>
                        <textarea
                          value={tempDescription}
                          onChange={(e) => setTempDescription(e.target.value)}
                          placeholder="Descripción breve..."
                          rows={2}
                          className="w-full rounded-xl border border-[#17364F] bg-[#11243B] px-3 py-2 text-white outline-none focus:border-[#09D8C7] text-sm"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-brand-ash-300">URL de Imagen (Opcional)</label>
                          <input
                            type="text"
                            value={tempImage}
                            onChange={(e) => setTempImage(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full rounded-xl border border-[#17364F] bg-[#11243B] px-3 py-2 text-white outline-none focus:border-[#09D8C7] text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-brand-ash-300">Enlace Recurso (Opcional)</label>
                          <input
                            type="text"
                            value={tempUrl}
                            onChange={(e) => setTempUrl(e.target.value)}
                            placeholder="https://github.com/..."
                            className="w-full rounded-xl border border-[#17364F] bg-[#11243B] px-3 py-2 text-white outline-none focus:border-[#09D8C7] text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-brand-ash-300">Estado de la tarjeta</label>
                        <select
                          value={tempStatus}
                          onChange={(e) => setTempStatus(e.target.value)}
                          className="w-full rounded-xl border border-[#17364F] bg-[#11243B] px-3 py-2 text-white outline-none focus:border-[#09D8C7] text-sm"
                        >
                          <option value="active">Activo</option>
                          <option value="inactive">Inactivo</option>
                          <option value="maintenance">Mantenimiento</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* MODALES TYPE INPUTS */}
                  {elementsType === 'modales' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-brand-ash-300">Descripción breve (En listado) *</label>
                        <input
                          type="text"
                          value={tempDescription}
                          onChange={(e) => setTempDescription(e.target.value)}
                          placeholder="Ej. Proceso de pruebas automatizadas..."
                          className="w-full rounded-xl border border-[#17364F] bg-[#11243B] px-3 py-2 text-white outline-none focus:border-[#09D8C7] text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-brand-ash-300">Contenido extendido (Detalle en Modal) *</label>
                        <textarea
                          value={tempContent}
                          onChange={(e) => setTempContent(e.target.value)}
                          placeholder="Escribe toda la información estructurada que aparecerá en el modal..."
                          rows={3}
                          className="w-full rounded-xl border border-[#17364F] bg-[#11243B] px-3 py-2 text-white outline-none focus:border-[#09D8C7] text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-brand-ash-300">Enlace Externo (Opcional)</label>
                        <input
                          type="text"
                          value={tempUrl}
                          onChange={(e) => setTempUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full rounded-xl border border-[#17364F] bg-[#11243B] px-3 py-2 text-white outline-none focus:border-[#09D8C7] text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* METRICAS TYPE INPUTS */}
                  {elementsType === 'métricas' && (
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-brand-ash-300">Valor de la Métrica *</label>
                          <input
                            type="text"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            placeholder="Ej: 99, 150, 4.5"
                            className="w-full rounded-xl border border-[#17364F] bg-[#11243B] px-3 py-2 text-white outline-none focus:border-[#09D8C7] text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-2 pt-8">
                          <input
                            type="checkbox"
                            id="percentage-metric"
                            checked={tempPercentage}
                            onChange={(e) => setTempPercentage(e.target.checked)}
                            className="w-4 h-4 rounded border-[#17364F] bg-[#11243B] accent-[#09D8C7]"
                          />
                          <label htmlFor="percentage-metric" className="text-xs font-semibold text-brand-ash-300 cursor-pointer">
                            Mostrar símbolo de porcentaje (%)
                          </label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-brand-ash-300">Indicador / Título de la métrica *</label>
                        <input
                          type="text"
                          value={tempIndicator}
                          onChange={(e) => setTempIndicator(e.target.value)}
                          placeholder="Ej: Cobertura de Código, Bugs Resueltos..."
                          className="w-full rounded-xl border border-[#17364F] bg-[#11243B] px-3 py-2 text-white outline-none focus:border-[#09D8C7] text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* CARRUSELES TYPE INPUTS */}
                  {elementsType === 'carruseles' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-brand-ash-300">Texto / Frase de la Diapositiva *</label>
                        <textarea
                          value={tempText}
                          onChange={(e) => setTempText(e.target.value)}
                          placeholder="Escribe una cita, frase o explicación..."
                          rows={2}
                          className="w-full rounded-xl border border-[#17364F] bg-[#11243B] px-3 py-2 text-white outline-none focus:border-[#09D8C7] text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-brand-ash-300">Imagen Slide (Opcional)</label>
                        <input
                          type="text"
                          value={tempImage}
                          onChange={(e) => setTempImage(e.target.value)}
                          placeholder="https://..."
                          className="w-full rounded-xl border border-[#17364F] bg-[#11243B] px-3 py-2 text-white outline-none focus:border-[#09D8C7] text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Build CTA buttons */}
                  <div className="flex justify-end gap-2 pt-2">
                    {editingElementIndex !== null && (
                      <button
                        type="button"
                        onClick={clearTempInputs}
                        className="rounded-xl border border-[#17364F] px-4 py-2 text-xs font-semibold text-[#C9F7EE] hover:bg-[#17364F]/20 transition"
                      >
                        Cancelar Edición
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleAddElement}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#09D8C7] px-4 py-2 text-xs font-bold text-[#0D1A2F] hover:bg-[#08c1b6] transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {editingElementIndex !== null ? 'Actualizar Elemento' : 'Añadir Elemento'}
                    </button>
                  </div>
                </div>

                {/* Added Elements list */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    Elementos agregados ({elements.length})
                  </h4>
                  
                  {elements.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#17364F] p-6 text-center text-xs text-brand-ash-400">
                      Debes agregar al menos un elemento para poder guardar el módulo.
                    </div>
                  ) : (
                    <div className="grid gap-2 max-h-[30vh] overflow-y-auto pr-1">
                      {elements.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center gap-4 bg-[#11243B] border border-[#17364F] p-3 rounded-xl text-xs">
                          <div className="flex-grow min-w-0">
                            <span className="font-bold text-[#09D8C7] block">Item #{idx + 1}</span>
                            <span className="text-white line-clamp-1 block">
                              {elementsType === 'cards' && item.description}
                              {elementsType === 'modales' && `${item.description} - ${item.content}`}
                              {elementsType === 'métricas' && `${item.indicator}: ${item.value}${item.percentage ? '%' : ''}`}
                              {elementsType === 'carruseles' && item.text}
                            </span>
                          </div>
                          <div className="flex shrink-0 gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleEditElement(idx)}
                              className="p-1.5 rounded bg-[#0D1A2F] text-[#09D8C7] hover:bg-[#09D8C7]/10 transition"
                              title="Editar item"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteElement(idx)}
                              className="p-1.5 rounded bg-[#BD0927]/10 text-[#BD0927] hover:bg-[#BD0927]/20 transition"
                              title="Eliminar item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* PASO 4: RESUMEN Y CONFIRMACIÓN */}
            {wizardStep === 4 && (
              <div className="space-y-6">
                
                {/* Dynamic File Persistence Warning */}
                <div className="rounded-2xl border border-[#f59e0b]/40 bg-[#f59e0b]/5 p-5 text-sm text-[#C9F7EE] space-y-2">
                  <p className="font-bold flex items-center gap-1.5 text-white">
                    <AlertTriangle className="w-5 h-5 text-[#f59e0b]" /> ADVERTENCIA DE PERSISTENCIA
                  </p>
                  <p className="text-xs leading-relaxed">
                    Al hacer clic en <strong>Confirmar y Guardar</strong>, el sistema persistirá la configuración del módulo de manera global y creará un archivo JSX React físico en el directorio:
                  </p>
                  <code className="block rounded bg-[#0D1A2F] p-2 text-xxs font-mono text-[#09D8C7] select-all">
                    src/admin/sections/New modules/{name.replace(/[^a-zA-Z0-9]/g, '')}.jsx
                  </code>
                  <p className="text-xs">
                    Esto asegura que los cambios estén listos para desarrollo y reflejados directamente en tu panel de control y vistas públicas.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#17364F] bg-[#0D1A2F]/60 p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-[#17364F] pb-2">
                    Resumen de Configuración
                  </h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2 text-xs">
                    <div className="space-y-1">
                      <span className="text-brand-ash-400 block font-semibold">Nombre del Módulo</span>
                      <span className="text-white text-sm font-bold">{name}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-brand-ash-400 block font-semibold">Icono Lucide</span>
                      <span className="text-white font-mono">{icon}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-brand-ash-400 block font-semibold">Estructura Layout</span>
                      <span className="text-white capitalize font-semibold">{elementsType}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-brand-ash-400 block font-semibold">Estado de Publicación</span>
                      <span className="text-white capitalize font-semibold">{status}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-brand-ash-400 block font-semibold">Color de Acento</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: accentColor }} />
                        <span className="text-white font-mono">{accentColor}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-brand-ash-400 block font-semibold">Color de Superficie</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: surfaceColor }} />
                        <span className="text-white font-mono">{surfaceColor}</span>
                      </div>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <span className="text-brand-ash-400 block font-semibold">Descripción del Módulo</span>
                      <span className="text-white leading-relaxed">{description}</span>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <span className="text-brand-ash-400 block font-semibold">Elementos Cargados ({elements.length})</span>
                      <div className="rounded-xl bg-[#11243B] p-3 text-xxs font-mono max-h-[150px] overflow-y-auto">
                        <pre className="text-brand-ash-300">{JSON.stringify(elements, null, 2)}</pre>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="Eliminar Módulo"
        description={`¿Estás seguro de que deseas eliminar el módulo "${moduleToDelete?.name || ''}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteConfirmOpen(false)}
      />
    </div>
  );
};

export default ModulesManager;

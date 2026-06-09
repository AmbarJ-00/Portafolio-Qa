import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { ConfirmDialog } from '../../components/ConfirmDialog.jsx';
import Modal from '../../components/Modal.jsx';
import { Plus, Trash2, Edit, HelpCircle, X, AlignLeft, Shield, Target, Zap, Terminal, MessageSquare } from 'lucide-react';

const aboutItemSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(5, 'La descripción debe ser descriptiva'),
  type: z.enum(['pilar', 'mision', 'filosofia', 'trayectoria', 'valor']),
  position: z.enum(['left', 'right', 'center']),
  behavior: z.enum(['card', 'block', 'badge']),
  priority: z.number().min(0),
  status: z.enum(['active', 'inactive'])
});

const defaultAboutItemValues = {
  title: '',
  description: '',
  type: 'pilar',
  position: 'center',
  behavior: 'card',
  priority: 0,
  status: 'active'
};

const AboutMeManager = () => {
  const { store, actions } = usePortfolio();
  const { aboutItems = [] } = store;
  const { toast } = useToast();

  const [activeItem, setActiveItem] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);

  // Deletion confirm states
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(aboutItemSchema),
    defaultValues: defaultAboutItemValues
  });

  const onSubmit = (data) => {
    try {
      if (activeItem) {
        actions.updateAboutItem(activeItem.id, data);
        toast.success('Elemento actualizado correctamente');
      } else {
        actions.addAboutItem(data);
        toast.success('Elemento creado con éxito');
      }
      setActiveItem(null);
      reset(defaultAboutItemValues);
    } catch (e) {
      toast.error('Error al guardar el elemento');
    }
  };

  const handleEdit = (item) => {
    setActiveItem(item);
    setValue('title', item.title);
    setValue('description', item.description);
    setValue('type', item.type);
    setValue('position', item.position);
    setValue('behavior', item.behavior);
    setValue('priority', item.priority || 0);
    setValue('status', item.status || 'active');
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      try {
        actions.deleteAboutItem(itemToDelete.id);
        toast.success('Elemento eliminado correctamente');
      } catch (e) {
        toast.error('Error al eliminar el elemento');
      }
      setItemToDelete(null);
    }
    setIsDeleteConfirmOpen(false);
  };

  const getIcon = (type) => {
    const icons = {
      pilar: Shield,
      mision: Target,
      filosofia: Zap,
      trayectoria: Terminal,
      valor: MessageSquare
    };
    const Comp = icons[type] || Terminal;
    return <Comp className="w-5 h-5 text-[#09D8C7]" />;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-[#17364F] bg-[#0D1A2F] p-6 text-white shadow-[0_20px_60px_-35px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#09D8C7]/80">Perfil público</p>
            <h1 className="mt-3 text-3xl font-semibold">Administrador de Sobre Mí</h1>
            <p className="mt-2 text-sm leading-relaxed text-[#C9F7EE]/85">
              Configura tus pilares, trayectoria y misión técnica expuestos en la página pública de Sobre Mí.
            </p>
          </div>
          <button
            onClick={() => setHelpOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#09D8C7] bg-[#09D8C7]/10 px-4 py-3 text-sm font-semibold text-[#09D8C7] hover:bg-[#09D8C7]/20 transition duration-200"
          >
            <HelpCircle className="w-4 h-4" /> Ayuda
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* List of items */}
        <section className="space-y-4">
          <div className="rounded-[1.75rem] border border-[#17364F] bg-[#0D1A2F] p-6 shadow-sm text-white">
            <h2 className="text-xl font-semibold">Elementos de Sobre Mí</h2>
            <p className="text-sm text-[#C9F7EE]/80 mt-1">Lista de elementos creados y su estado actual en la web pública.</p>
          </div>

          <div className="space-y-4">
            {aboutItems.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl border border-[#17364F] bg-[#0D1A2F]/80 flex items-start justify-between gap-4 text-white">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#09D8C7]/10 mt-1 shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <h3 className="font-bold flex items-center gap-2">
                      {item.title}
                      {item.status === 'inactive' && (
                        <span className="text-[9px] bg-red-950/80 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full uppercase">Inactivo</span>
                      )}
                    </h3>
                    <p className="text-xs text-[#C9F7EE]/70 mt-1 leading-relaxed">{item.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-[10px] bg-slate-800 text-slate-350 px-2.5 py-0.5 rounded-md">
                        Posición: {item.position}
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-350 px-2.5 py-0.5 rounded-md">
                        Comportamiento: {item.behavior}
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-350 px-2.5 py-0.5 rounded-md">
                        Prioridad: {item.priority || 0}
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-350 px-2.5 py-0.5 rounded-md capitalize">
                        Tipo: {item.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 text-[#C9F7EE]/85 hover:text-white hover:bg-slate-800 rounded-lg transition"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    className="p-2 text-red-450 hover:text-red-300 hover:bg-red-950/20 rounded-lg transition"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {aboutItems.length === 0 && (
              <p className="text-sm text-slate-400 py-6 text-center border border-dashed border-[#17364F] rounded-2xl">No hay elementos configurados. Crea uno nuevo en el panel lateral.</p>
            )}
          </div>
        </section>

        {/* Create/Edit Form */}
        <section className="rounded-[1.75rem] border border-[#17364F] bg-[#0D1A2F]/90 p-6 shadow-sm text-white">
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#09D8C7]/10">
            <div>
              <h2 className="text-xl font-semibold">
                {activeItem ? 'Editar elemento' : 'Crear elemento'}
              </h2>
              <p className="text-sm text-[#C9F7EE]/80">Completa los campos para configurar el bloque en la vista pública.</p>
            </div>
            {activeItem && (
              <button
                type="button"
                onClick={() => { setActiveItem(null); reset(defaultAboutItemValues); }}
                className="p-1 hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5 text-slate-450" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Título</label>
              <input
                type="text"
                {...register('title')}
                placeholder="Pilar de Automatización"
                className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] transition"
              />
              {errors.title && <p className="text-xs text-[#BD0927]">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Descripción / Contenido</label>
              <textarea
                {...register('description')}
                rows={4}
                placeholder="Garantizar que todo cambio pase por pruebas automatizadas..."
                className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] transition"
              />
              {errors.description && <p className="text-xs text-[#BD0927]">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Tipo de elemento</label>
                <select
                  {...register('type')}
                  className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7]"
                >
                  <option value="pilar">Pilar profesional</option>
                  <option value="mision">Misión técnica</option>
                  <option value="filosofia">Filosofía profesional</option>
                  <option value="trayectoria">Trayectoria</option>
                  <option value="valor">Valor</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Posición en layout</label>
                <select
                  {...register('position')}
                  className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7]"
                >
                  <option value="left">Izquierda (Columna Narrativa)</option>
                  <option value="right">Derecha (Columna Lateral)</option>
                  <option value="center">Central (Pie de página/Full Width)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Comportamiento visual</label>
                <select
                  {...register('behavior')}
                  className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7]"
                >
                  <option value="card">Tarjeta con borde lateral</option>
                  <option value="block">Bloque de color (Destacado)</option>
                  <option value="badge">Etiqueta pequeña (Badge)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Prioridad de orden</label>
                <input
                  type="number"
                  {...register('priority', { valueAsNumber: true })}
                  className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Estado</label>
              <select
                {...register('status')}
                className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7]"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo (Oculto)</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="submit"
                className="w-full rounded-2xl bg-[#09D8C7] px-5 py-3 text-sm font-bold text-[#0D1A2F] hover:bg-[#08c1b6] transition shadow-lg shadow-[#09D8C7]/15"
              >
                {activeItem ? 'Guardar Cambios' : 'Crear Elemento'}
              </button>
            </div>
          </form>
        </section>
      </div>

      {helpOpen && (
        <Modal
          isOpen={helpOpen}
          onClose={() => setHelpOpen(false)}
          title="Guía del Módulo Sobre Mí"
          subtitle="Consejos para maquetar tu perfil profesional de forma dinámica."
          footer={
            <button
              type="button"
              onClick={() => setHelpOpen(false)}
              className="rounded-2xl bg-[#09D8C7] px-5 py-3 text-sm font-semibold text-[#0D1A2F] hover:bg-[#08c1b6]"
            >
              Cerrar ayuda
            </button>
          }
        >
          <div className="space-y-4">
            <div className="rounded-3xl border border-[#17364F] bg-[#0D1A2F]/80 p-4">
              <p className="font-semibold text-white">Posiciones de Layout</p>
              <p className="mt-2 text-sm text-[#C9F7EE]">
                - **Izquierda**: Los bloques aparecen apilados bajo la narrativa de introducción principal.<br/>
                - **Derecha**: Los bloques se agregan en la barra lateral debajo de los pilares predeterminados.<br/>
                - **Central**: Se disponen en el pie de la página, agrupando badges y tarjetas a lo ancho.
              </p>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="Eliminar Elemento de Sobre Mí"
        description={`¿Estás seguro de que deseas eliminar el elemento "${itemToDelete?.title || ''}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteConfirmOpen(false)}
      />
    </div>
  );
};

export default AboutMeManager;

import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { Plus, GripVertical, Info, ArrowUpDown, X } from 'lucide-react';

const moduleSchema = z.object({
  name: z.string().min(3, 'El nombre es obligatorio'),
  icon: z.string().min(2, 'El icono es obligatorio'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  cards: z.string().optional(),
  accentColor: z.string().min(3, 'El color de acento es obligatorio'),
  surfaceColor: z.string().min(3, 'El color de superficie es obligatorio'),
  animation: z.string().optional()
});

const defaultModuleValues = {
  name: '',
  icon: 'Layers',
  description: '',
  cards: '',
  accentColor: '#09D8C7',
  surfaceColor: '#0D1A2F',
  animation: 'fade-in'
};

const SortableModuleItem = ({ module, onEdit, onDelete, listeners, attributes, setNodeRef, transform, transition }) => (
  <div
    ref={setNodeRef}
    style={{ transform: CSS.Transform.toString(transform), transition }}
    className="group flex items-center justify-between gap-3 rounded-3xl border border-[#17364F] bg-[#11243B] p-4 shadow-lg shadow-[#0D1A2F]/20 focus-within:ring-2 focus-within:ring-[#09D8C7]"
  >
    <div className="flex items-center gap-3">
      <div className="rounded-2xl bg-[#0D1A2F] p-2 text-[#09D8C7]">
        <GripVertical className="w-5 h-5" {...listeners} {...attributes} />
      </div>
      <div>
        <p className="font-semibold text-white">{module.name}</p>
        <p className="text-sm text-[#A5F5E0]">{module.description}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button onClick={() => onEdit(module)} className="rounded-2xl border border-[#09D8C7] px-3 py-2 text-sm text-[#09D8C7] hover:bg-[#09D8C7]/10 focus:outline-none focus:ring-2 focus:ring-[#09D8C7]">Editar</button>
      <button onClick={() => onDelete(module.id)} className="rounded-2xl border border-[#BD0927] bg-[#BD0927]/10 px-3 py-2 text-sm text-[#BD0927] hover:bg-[#BD0927]/20 focus:outline-none focus:ring-2 focus:ring-[#BD0927]">Eliminar</button>
    </div>
  </div>
);

const ModulesManager = () => {
  const { store, actions } = usePortfolio();
  const [activeModule, setActiveModule] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(moduleSchema),
    defaultValues: defaultModuleValues
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors }
  } = useForm({
    resolver: zodResolver(moduleSchema),
    defaultValues: defaultModuleValues
  });

  const openEditor = (module) => {
    setActiveModule(module);
    resetEdit({
      name: module.name,
      icon: module.icon,
      description: module.description,
      cards: module.cards.join(', '),
      accentColor: module.colors.accent,
      surfaceColor: module.colors.surface,
      animation: module.animation
    });
  };

  const closeEditor = () => {
    setActiveModule(null);
    resetEdit(defaultModuleValues);
  };

  const onCreateModule = (data) => {
    actions.addModule(data);
    reset(defaultModuleValues);
  };

  const onUpdateModule = (data) => {
    if (!activeModule) return;
    actions.updateModule(activeModule.id, data);
    closeEditor();
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = store.settings.modules.findIndex((item) => item.id === active.id);
      const newIndex = store.settings.modules.findIndex((item) => item.id === over?.id);
      const nextOrder = arrayMove(store.settings.modules, oldIndex, newIndex);
      actions.reorderModules(nextOrder);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-[#17364F] bg-[#0D1A2F] p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.5)] text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#09D8C7]/80">Panel administrativo</p>
            <h1 className="mt-4 text-4xl font-bold">Gestión de módulos</h1>
            <p className="mt-3 max-w-2xl text-sm text-[#C9F7EE]">Administra módulos reutilizables con sus tarjetas, colores y animaciones desde un solo panel.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowInstructions((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#09D8C7] bg-[#09D8C7]/10 px-4 py-3 text-sm font-semibold text-[#09D8C7] hover:bg-[#09D8C7]/20 focus:outline-none focus:ring-2 focus:ring-[#09D8C7]"
            >
              <Info className="w-4 h-4" /> {showInstructions ? 'Ocultar' : 'Ver'} instrucciones
            </button>
            <button
              onClick={() => reset(defaultModuleValues)}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#09D8C7] px-4 py-3 text-sm font-semibold text-[#0D1A2F] hover:bg-[#08c1b6] focus:outline-none focus:ring-2 focus:ring-[#09D8C7]"
            >
              <Plus className="w-4 h-4" /> Nuevo módulo
            </button>
          </div>
        </div>
      </div>

      {showInstructions && (
        <section className="rounded-[1.75rem] border border-[#17364F] bg-[#11243B] p-6 shadow-lg shadow-[#0D1A2F]/20 text-[#E2E8F0]">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-[#09D8C7] bg-[#0D1A2F]/80 p-5">
              <div className="flex items-center gap-3 text-[#09D8C7]">
                <ArrowUpDown className="h-5 w-5" />
                <h2 className="text-lg font-semibold">¿Qué es un módulo?</h2>
              </div>
              <p className="mt-3 text-sm text-[#C9F7EE]">Un módulo es una sección configurable que agrupa tarjetas, colores y animaciones para presentar contenido público de forma consistente.</p>
            </div>
            <div className="grid gap-4">
              <div className="rounded-3xl border border-[#17364F] bg-[#0D1A2F]/80 p-5">
                <p className="font-semibold text-white">Cómo crearlo</p>
                <p className="mt-2 text-sm text-[#C9F7EE]">Completa el formulario con nombre, icono, descripción y tarjetas separadas por comas.</p>
              </div>
              <div className="rounded-3xl border border-[#17364F] bg-[#0D1A2F]/80 p-5">
                <p className="font-semibold text-white">Cómo editarlo</p>
                <p className="mt-2 text-sm text-[#C9F7EE]">Pulsa editar para abrir un modal independiente, así separas creación y edición.</p>
              </div>
            </div>
            <div className="rounded-3xl border border-[#17364F] bg-[#0D1A2F]/80 p-5">
              <p className="font-semibold text-white">Cómo modificar su apariencia</p>
              <p className="mt-2 text-sm text-[#C9F7EE]">Ajusta los colores de acento y superficie para mantener la identidad visual del módulo.</p>
            </div>
            <div className="rounded-3xl border border-[#17364F] bg-[#0D1A2F]/80 p-5">
              <p className="font-semibold text-white">Cómo reordenarlo</p>
              <p className="mt-2 text-sm text-[#C9F7EE]">Arrastra los módulos en la lista para cambiar su prioridad y posición.</p>
            </div>
          </div>
        </section>
      )}

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-4">
          <div className="rounded-[1.75rem] border border-[#17364F] bg-[#11243B]/90 p-6 shadow-lg shadow-[#0D1A2F]/20 text-[#E2E8F0]">
            <h2 className="text-xl font-semibold text-white">Módulos existentes</h2>
            <p className="mt-1 text-sm text-[#C9F7EE]">Haz clic en editar para abrir la ventana de edición independiente.</p>
          </div>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={store.settings.modules.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              {store.settings.modules.map((module) => (
                <SortableModuleItem key={module.id} module={module} onEdit={openEditor} onDelete={actions.deleteModule} />
              ))}
            </SortableContext>
          </DndContext>
        </section>

        <section className="rounded-[2rem] border border-[#17364F] bg-[#11243B]/95 p-6 shadow-lg shadow-[#0D1A2F]/20 text-[#E2E8F0]">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold text-white">Crear un módulo</h2>
            <p className="text-sm text-[#C9F7EE]">Completa el formulario principal para añadir un módulo nuevo al sistema.</p>
          </div>
          <form onSubmit={handleSubmit(onCreateModule)} className="mt-6 space-y-5">
            {[
              { name: 'name', label: 'Nombre del módulo', hint: 'Mínimo 3 caracteres' },
              { name: 'icon', label: 'Icono Lucide', hint: 'Ej: Layers, Monitor, FileCode' },
              { name: 'animation', label: 'Animación', hint: 'P. ej. fade-in, slide-up' }
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-semibold text-white">{field.label}</label>
                <input
                  type="text"
                  {...register(field.name)}
                  className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
                />
                <p className="text-xs text-[#C9F7EE]">{field.hint}</p>
                {errors[field.name] && <p className="text-xs text-[#FCA5A5]">{errors[field.name].message}</p>}
              </div>
            ))}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Descripción</label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
              />
              <p className="text-xs text-[#C9F7EE]">Describe brevemente qué hace este módulo.</p>
              {errors.description && <p className="text-xs text-[#FCA5A5]">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Tarjetas</label>
              <textarea
                {...register('cards')}
                rows={3}
                className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
              />
              <p className="text-xs text-[#C9F7EE]">Formato esperado: Tarjeta A, Tarjeta B, Tarjeta C</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Color de acento</label>
                <input
                  type="color"
                  {...register('accentColor')}
                  className="h-12 w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] p-2 outline-none focus:ring-2 focus:ring-[#09D8C7]/30"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Color de superficie</label>
                <input
                  type="color"
                  {...register('surfaceColor')}
                  className="h-12 w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] p-2 outline-none focus:ring-2 focus:ring-[#09D8C7]/30"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-2">
              <button
                type="reset"
                onClick={() => reset(defaultModuleValues)}
                className="rounded-2xl border border-[#17364F] px-5 py-3 text-sm font-semibold text-[#17364F] hover:bg-[#17364F]/10 focus:outline-none focus:ring-2 focus:ring-[#09D8C7]/30"
              >
                Limpiar
              </button>
              <button
                type="submit"
                className="rounded-2xl bg-[#09D8C7] px-5 py-3 text-sm font-semibold text-[#0D1A2F] hover:bg-[#08c1b6] focus:outline-none focus:ring-2 focus:ring-[#09D8C7]"
              >
                Crear módulo
              </button>
            </div>
          </form>
        </section>
      </div>

      {activeModule && (
        <Modal
          isOpen={Boolean(activeModule)}
          onClose={closeEditor}
          title="Editar módulo"
          subtitle="Actualiza los detalles sin mezclar el flujo de creación."
          footer={
            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={closeEditor}
                className="rounded-2xl border border-[#17364F] px-5 py-3 text-sm font-semibold text-[#C9F7EE] hover:bg-[#17364F]/10"
              >
                Cancelar
              </button>
              <button
                form="edit-module-form"
                type="submit"
                className="rounded-2xl bg-[#09D8C7] px-5 py-3 text-sm font-semibold text-[#0D1A2F] hover:bg-[#08c1b6]"
              >
                Guardar cambios
              </button>
            </div>
          }
        >
          <form id="edit-module-form" onSubmit={handleSubmitEdit(onUpdateModule)} className="space-y-5">
            {[
              { name: 'name', label: 'Nombre del módulo', hint: 'Mínimo 3 caracteres' },
              { name: 'icon', label: 'Icono Lucide', hint: 'Ej: Layers, Monitor, FileCode' },
              { name: 'animation', label: 'Animación', hint: 'P. ej. fade-in, slide-up' }
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-semibold text-white">{field.label}</label>
                <input
                  type="text"
                  {...registerEdit(field.name)}
                  className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
                />
                <p className="text-xs text-[#C9F7EE]">{field.hint}</p>
                {editErrors[field.name] && <p className="text-xs text-[#FCA5A5]">{editErrors[field.name].message}</p>}
              </div>
            ))}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Descripción</label>
              <textarea
                {...registerEdit('description')}
                rows={4}
                className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
              />
              <p className="text-xs text-[#C9F7EE]">Describe qué controla este módulo.</p>
              {editErrors.description && <p className="text-xs text-[#FCA5A5]">{editErrors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Tarjetas</label>
              <textarea
                {...registerEdit('cards')}
                rows={3}
                className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
              />
              <p className="text-xs text-[#C9F7EE]">Formato esperado: Tarjeta A, Tarjeta B, Tarjeta C</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Color de acento</label>
                <input
                  type="color"
                  {...registerEdit('accentColor')}
                  className="h-12 w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] p-2 outline-none focus:ring-2 focus:ring-[#09D8C7]/30"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Color de superficie</label>
                <input
                  type="color"
                  {...registerEdit('surfaceColor')}
                  className="h-12 w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] p-2 outline-none focus:ring-2 focus:ring-[#09D8C7]/30"
                />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ModulesManager;

import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { ConfirmDialog } from '../../components/ConfirmDialog.jsx';
import Modal from '../../components/Modal.jsx';
import { Plus, Trash2, Edit, GripVertical, Link2, HelpCircle, X } from 'lucide-react';

const navSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  path: z.string().min(2, 'La ruta es obligatoria'),
  active: z.boolean().optional()
});

const SortableNavItem = ({ item, onToggle, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 0 }}
      className="group flex items-center justify-between gap-3 rounded-[1.75rem] border border-[#17364F] bg-[#0D1A2F] p-4 shadow-lg shadow-[#0D1A2F]/10"
      {...attributes}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[#09D8C7]/10 p-2 text-[#09D8C7]">
          <GripVertical className="w-5 h-5 cursor-grab" {...listeners} {...attributes} />
        </div>
        <div>
          <p className="font-semibold text-white">{item.name}</p>
          <p className="text-sm text-[#A5B4FC]">{item.path}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onToggle(item.id, !item.active)} className="rounded-2xl border border-[#09D8C7] px-3 py-2 text-sm text-[#09D8C7] hover:bg-[#09D8C7]/10 transition">
          {item.active ? 'Visible' : 'Oculto'}
        </button>
        <button onClick={() => onEdit(item)} className="rounded-2xl border border-[#09D8C7] px-3 py-2 text-sm text-[#09D8C7] hover:bg-[#09D8C7]/10 transition">
          <Edit className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(item)} className="rounded-2xl border border-[#BD0927] bg-[#BD0927]/10 px-3 py-2 text-sm text-[#BD0927] hover:bg-[#BD0927]/20 transition">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const NavbarManager = () => {
  const { store, actions } = usePortfolio();
  const { toast } = useToast();
  const [activeNav, setActiveNav] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);

  // Deletion confirm states
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [navToDelete, setNavToDelete] = useState(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(navSchema),
    defaultValues: {
      name: '',
      path: '/nuevo-enlace',
      active: true
    }
  });

  const onSubmit = (data) => {
    try {
      if (activeNav) {
        actions.updateNavbarItem(activeNav.id, data);
        toast.success('Enlace de navegación actualizado correctamente');
      } else {
        actions.addNavbarItem(data);
        toast.success('Enlace de navegación creado con éxito');
      }
      setActiveNav(null);
      reset({ name: '', path: '/nuevo-enlace', active: true });
    } catch (e) {
      toast.error('Error al guardar el enlace de navegación');
    }
  };

  const handleEdit = (item) => {
    setActiveNav(item);
    setValue('name', item.name);
    setValue('path', item.path);
    setValue('active', item.active);
  };

  const handleToggle = (id, newActive) => {
    try {
      actions.updateNavbarItem(id, { active: newActive });
      toast.success(newActive ? 'Enlace ahora es visible' : 'Enlace ahora está oculto');
    } catch (e) {
      toast.error('Error al cambiar la visibilidad');
    }
  };

  const handleDeleteClick = (item) => {
    setNavToDelete(item);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (navToDelete) {
      try {
        actions.deleteNavbarItem(navToDelete.id);
        toast.success('Enlace de navegación eliminado correctamente');
      } catch (e) {
        toast.error('Error al eliminar el enlace');
      }
      setNavToDelete(null);
    }
    setIsDeleteConfirmOpen(false);
  };

  const handleTransfer = (active, over) => {
    if (active.id !== over?.id) {
      const oldIndex = store.settings.navbar.items.findIndex((item) => item.id === active.id);
      const newIndex = store.settings.navbar.items.findIndex((item) => item.id === over?.id);
      const nextOrder = arrayMove(store.settings.navbar.items, oldIndex, newIndex);
      actions.reorderNavbarItems(nextOrder);
      toast.success('Orden del menú actualizado');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-[#17364F] bg-[#0D1A2F] p-6 text-white shadow-[0_20px_60px_-35px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-[#09D8C7]/80">Estructura de menú</p>
            <h1 className="mt-3 text-3xl font-semibold">Gestor de navegación</h1>
            <p className="mt-2 text-sm leading-relaxed text-[#C9F7EE]/85">
              Reordena, muestra u oculta enlaces de la navegación pública desde el admin.
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

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <DndContext collisionDetection={closestCenter} onDragEnd={(event) => handleTransfer(event.active, event.over)}>
            <SortableContext items={store.settings.navbar.items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              {store.settings.navbar.items.map((item) => (
                <SortableNavItem
                  key={item.id}
                  item={item}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <section className="rounded-[1.75rem] border border-[#17364F] bg-[#0D1A2F]/80 p-6 shadow-sm text-[#E2E8F0]">
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#09D8C7]/10">
            <div>
              <h2 className="text-xl font-semibold text-white">Elemento de navegación</h2>
              <p className="text-sm text-[#C9F7EE]/80">Agrega o edita enlaces visibles en el menú.</p>
            </div>
            {activeNav && (
              <button
                onClick={() => { setActiveNav(null); reset({ name: '', path: '/nuevo-enlace', active: true }); }}
                className="rounded-2xl border border-[#09D8C7] px-3 py-2 text-sm text-[#09D8C7] hover:bg-[#09D8C7]/10 transition"
              >
                <X className="w-4 h-4" /> Cancelar
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Nombre</label>
              <input
                {...register('name')}
                className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-[#09D8C7]/30"
              />
              {errors.name && <p className="text-xs text-[#BD0927]">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Ruta</label>
              <input
                {...register('path')}
                className="w-full rounded-2xl border border-[#09D8C7]/20 bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-[#09D8C7]/30"
              />
              {errors.path && <p className="text-xs text-[#BD0927]">{errors.path.message}</p>}
            </div>
            <div className="flex items-center gap-3">
              <input id="active" type="checkbox" {...register('active')} className="h-4 w-4 rounded border-[#09D8C7] text-[#09D8C7] focus:ring-[#09D8C7]" />
              <label htmlFor="active" className="text-sm text-white">Visible</label>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="submit" className="rounded-2xl bg-[#09D8C7] px-5 py-3 text-sm font-semibold text-[#0D1A2F] hover:bg-[#08c1b6] transition">
                {activeNav ? 'Actualizar enlace' : 'Agregar enlace'}
              </button>
            </div>
          </form>
        </section>
      </div>

      {helpOpen && (
        <Modal
          isOpen={helpOpen}
          onClose={() => setHelpOpen(false)}
          title="Ayuda de navegación"
          subtitle="Consejos breves para mantener el menú público consistente."
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
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-[#17364F] bg-[#0D1A2F]/80 p-4">
              <p className="font-semibold text-white">Ruta clara</p>
              <p className="mt-2 text-sm text-[#C9F7EE]">Usa rutas limpias: /projects, /skills, /contact.</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="Eliminar Enlace de Menú"
        description={`¿Estás seguro de que deseas eliminar el enlace de navegación "${navToDelete?.name || ''}"? Esta acción no se puede deshacer y puede afectar la navegación del usuario público.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteConfirmOpen(false)}
      />
    </div>
  );
};

export default NavbarManager;

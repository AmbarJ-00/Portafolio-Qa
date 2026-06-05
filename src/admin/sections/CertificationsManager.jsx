import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { Plus, Trash2, Edit, X, GripVertical, Link2, ImageIcon } from 'lucide-react';
import Modal from '../../components/Modal.jsx';

const certificationSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  authority: z.string().min(3, 'La institución es obligatoria'),
  imageUrl: z.string().url('La URL de imagen debe ser válida').optional(),
  date: z.string().min(8, 'La fecha es obligatoria'),
  url: z.string().url('La URL pública debe ser válida').optional(),
  badgeUrl: z.string().url('La URL de badge debe ser válida').optional(),
  status: z.enum(['Activo', 'Inactivo', 'Obsoleto', 'En proceso de certificación']),
  tools: z.string().optional(),
  integrations: z.string().optional(),
  summary: z.string().optional()
});

const defaultCertificationValues = {
  title: '',
  authority: '',
  imageUrl: '',
  date: '',
  tools: '',
  integrations: '',
  summary: '',
  url: '',
  badgeUrl: '',
  status: 'Activo'
};

const SortableCertItem = ({ cert, onEdit, onDelete, listeners, attributes, setNodeRef, transform, transition }) => (
  <div
    ref={setNodeRef}
    style={{ transform: CSS.Transform.toString(transform), transition }}
    className="group flex items-center justify-between gap-4 rounded-3xl border border-[#17364F] bg-[#11243B] p-4 shadow-lg shadow-[#0D1A2F]/20 focus-within:ring-2 focus-within:ring-[#09D8C7]"
  >
    <div className="flex items-center gap-3">
      <div className="rounded-2xl bg-[#0D1A2F] p-2 text-[#09D8C7]">
        <GripVertical className="w-5 h-5" {...listeners} {...attributes} />
      </div>
      <div>
        <h3 className="font-semibold text-[#E2E8F0]">{cert.title}</h3>
        <p className="text-sm text-[#A5B4FC]">{cert.authority}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={() => onEdit(cert)}
        className="rounded-2xl border border-[#17364F] px-3 py-2 text-sm text-[#C9F7EE] hover:bg-[#09D8C7]/10 focus:outline-none focus:ring-2 focus:ring-[#09D8C7]"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={() => onDelete(cert.id)}
        className="rounded-2xl border border-[#BD0927] bg-[#BD0927]/10 px-3 py-2 text-sm text-[#BD0927] hover:bg-[#BD0927]/20 focus:outline-none focus:ring-2 focus:ring-[#BD0927]"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const CertificationsManager = () => {
  const { store, actions } = usePortfolio();
  const [activeCert, setActiveCert] = useState(null);
  const [localImage, setLocalImage] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [imageError, setImageError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(certificationSchema),
    defaultValues: defaultCertificationValues
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors }
  } = useForm({
    resolver: zodResolver(certificationSchema),
    defaultValues: defaultCertificationValues
  });

  const handleImageFile = (event, editMode = false) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setImageError('Solo se permiten PNG, JPG, JPEG o WEBP.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLocalImage(reader.result.toString());
      setPreviewImage(reader.result.toString());
      setImageError('');
      if (editMode) {
        setActiveCert((current) => ({ ...current }));
      }
    };
    reader.readAsDataURL(file);
  };

  const resetImageFields = () => {
    setLocalImage('');
    setPreviewImage('');
    setImageError('');
  };

  const openEditor = (cert) => {
    setActiveCert(cert);
    resetEdit({
      title: cert.title,
      authority: cert.authority,
      imageUrl: cert.image.startsWith('data:') ? '' : cert.image,
      date: cert.date,
      tools: cert.tools.join(', '),
      integrations: cert.integrations.join(', '),
      summary: cert.summary,
      url: cert.url || '',
      badgeUrl: cert.badgeUrl || '',
      status: cert.status || 'Activo'
    });
    setPreviewImage(cert.image || '');
    setLocalImage('');
    setImageError('');
  };

  const closeEditor = () => {
    setActiveCert(null);
    reset(defaultCertificationValues);
    resetEdit(defaultCertificationValues);
    resetImageFields();
  };

  const onCreateCertification = (data) => {
    const image = localImage || data.imageUrl;
    if (!image) {
      setImageError('Debes cargar una imagen o proporcionar una URL de imagen.');
      return;
    }
    actions.addCertification({ ...data, image });
    reset(defaultCertificationValues);
    resetImageFields();
  };

  const onUpdateCertification = (data) => {
    if (!activeCert) return;
    const image = localImage || data.imageUrl || activeCert.image;
    if (!image) {
      setImageError('Debes cargar una imagen o proporcionar una URL de imagen.');
      return;
    }
    actions.updateCertification(activeCert.id, { ...data, image });
    closeEditor();
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = store.certifications.findIndex((cert) => cert.id === active.id);
      const newIndex = store.certifications.findIndex((cert) => cert.id === over?.id);
      const nextOrder = arrayMove(store.certifications, oldIndex, newIndex);
      actions.reorderCertifications(nextOrder);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-[#17364F] bg-[#0D1A2F] p-8 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.5)] text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#09D8C7]/80">Panel administrativo</p>
            <h1 className="mt-4 text-4xl font-bold">Gestión de certificaciones</h1>
            <p className="mt-3 max-w-2xl text-sm text-[#C9F7EE]">Administra certificados, estados, URLs de badge y cargas locales desde un solo lugar.</p>
          </div>
          <button
            onClick={closeEditor}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#09D8C7] bg-[#09D8C7]/10 px-4 py-3 text-sm font-semibold text-[#09D8C7] hover:bg-[#09D8C7]/20 focus:outline-none focus:ring-2 focus:ring-[#09D8C7]"
          >
            <Plus className="w-4 h-4" /> Nueva certificación
          </button>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-4">
          <div className="rounded-[1.75rem] border border-[#17364F] bg-[#11243B]/90 p-6 shadow-lg shadow-[#0D1A2F]/20 text-[#E2E8F0]">
            <h2 className="text-xl font-semibold text-white">Listado de certificaciones</h2>
            <p className="mt-1 text-sm text-[#C9F7EE]">Reordena con drag-and-drop y edita sin salir del panel.</p>
          </div>
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={store.certifications.map((cert) => cert.id)} strategy={verticalListSortingStrategy}>
              {store.certifications.map((cert) => (
                <SortableCertItem key={cert.id} cert={cert} onEdit={openEditor} onDelete={actions.deleteCertification} />
              ))}
            </SortableContext>
          </DndContext>
        </section>

        <section className="rounded-[2rem] border border-[#17364F] bg-[#11243B]/95 p-6 shadow-lg shadow-[#0D1A2F]/20 text-[#E2E8F0]">
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold text-white">Crear nueva certificación</h2>
            <p className="text-sm text-[#C9F7EE]">Carga imagen local o usa URL, añade un enlace de badge y selecciona el estado correcto.</p>
          </div>
          <form onSubmit={handleSubmit(onCreateCertification)} className="mt-6 space-y-5">
            {[
              { name: 'title', label: 'Título', hint: 'Mínimo 3 caracteres' },
              { name: 'authority', label: 'Institución', hint: 'P. ej. Credly, LinkedIn, Universidad' },
              { name: 'date', label: 'Fecha', hint: 'Formato requerido: DD/MM/YYYY' },
              { name: 'url', label: 'URL pública del certificado', type: 'url', hint: 'Enlace a la certificación o página oficial' },
              { name: 'badgeUrl', label: 'URL de Badge', type: 'url', hint: 'Link directo a badge en Credly, LinkedIn o institución' }
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-semibold text-white">{field.label}</label>
                <input
                  type={field.type || 'text'}
                  {...register(field.name)}
                  className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
                />
                <p className="text-xs text-[#C9F7EE]">{field.hint}</p>
                {errors[field.name] && <p className="text-xs text-[#FCA5A5]">{errors[field.name].message}</p>}
              </div>
            ))}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">URL de imagen</label>
                <input
                  type="url"
                  {...register('imageUrl')}
                  placeholder="https://..."
                  className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
                />
                <p className="text-xs text-[#C9F7EE]">O selecciona una imagen local en PNG/JPG/JPEG/WEBP.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Imagen local</label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={(event) => handleImageFile(event)}
                  className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
                />
                <p className="text-xs text-[#C9F7EE]">Carga directamente desde tu dispositivo.</p>
              </div>
            </div>

            {previewImage && (
              <div className="rounded-3xl border border-[#17364F] bg-[#0D1A2F]/5 p-4 text-[#E2E8F0]">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">Vista previa de imagen</p>
                  <span className="rounded-full bg-[#09D8C7]/20 px-3 py-1 text-xs text-[#09D8C7]">Local/URL</span>
                </div>
                <div className="mt-4 overflow-hidden rounded-3xl bg-[#11243B] p-3">
                  <img src={previewImage} alt="Vista previa de certificación" className="h-44 w-full object-contain" />
                </div>
              </div>
            )}

            {imageError && <p className="text-xs text-[#BD0927]">{imageError}</p>}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Estado</label>
              <select
                {...register('status')}
                className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
              >
                <option>Activo</option>
                <option>Inactivo</option>
                <option>Obsoleto</option>
                <option>En proceso de certificación</option>
              </select>
            </div>

{[
              { name: 'tools', label: 'Herramientas', hint: 'Formato: Postman | Jira | SQL | Cypress' },
              { name: 'integrations', label: 'Integraciones', hint: 'Formato: GitHub | Vercel | Supabase' },
              { name: 'summary', label: 'Descripción', hint: 'Mínimo recomendado: 20 caracteres' }
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-semibold text-white">{field.label}</label>
                <textarea
                  {...register(field.name)}
                  rows={field.name === 'summary' ? 4 : 2}
                  className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
                />
                <p className="text-xs text-[#C9F7EE]">{field.hint}</p>
              </div>
            ))}

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="reset"
                onClick={() => {
                  reset(defaultCertificationValues);
                  resetImageFields();
                }}
                className="rounded-2xl border border-[#17364F] px-5 py-3 text-sm font-semibold text-[#C9F7EE] hover:bg-[#17364F]/10 focus:outline-none focus:ring-2 focus:ring-[#09D8C7]/30"
              >
                Limpiar
              </button>
              <button
                type="submit"
                className="rounded-2xl bg-[#09D8C7] px-5 py-3 text-sm font-semibold text-[#0D1A2F] hover:bg-[#08c1b6] focus:outline-none focus:ring-2 focus:ring-[#09D8C7]"
              >
                Crear certificación
              </button>
            </div>
          </form>
        </section>
      </div>

      {activeCert && (
        <Modal
          isOpen={Boolean(activeCert)}
          onClose={closeEditor}
          title="Editar certificación"
          subtitle="Actualiza datos sin interferir con los nuevos registros."
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
                form="edit-cert-form"
                type="submit"
                className="rounded-2xl bg-[#09D8C7] px-5 py-3 text-sm font-semibold text-[#0D1A2F] hover:bg-[#08c1b6]"
              >
                Guardar cambios
              </button>
            </div>
          }
        >
          <form id="edit-cert-form" onSubmit={handleSubmitEdit(onUpdateCertification)} className="space-y-5">
            {[
              { name: 'title', label: 'Título', hint: 'Mínimo 3 caracteres' },
              { name: 'authority', label: 'Institución', hint: 'P. ej. Credly, LinkedIn, Universidad' },
              { name: 'date', label: 'Fecha', hint: 'Formato requerido: DD/MM/YYYY' },
              { name: 'url', label: 'URL pública del certificado', type: 'url', hint: 'Enlace oficial del certificado' },
              { name: 'badgeUrl', label: 'URL de Badge', type: 'url', hint: 'Link directo de badge público' }
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-semibold text-white">{field.label}</label>
                <input
                  type={field.type || 'text'}
                  {...registerEdit(field.name)}
                  className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
                />
                <p className="text-xs text-[#C9F7EE]">{field.hint}</p>
                {editErrors[field.name] && <p className="text-xs text-[#FCA5A5]">{editErrors[field.name].message}</p>}
              </div>
            ))}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">URL de imagen</label>
                <input
                  type="url"
                  {...registerEdit('imageUrl')}
                  placeholder="https://..."
                  className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
                />
                <p className="text-xs text-[#C9F7EE]">URL para badge o imagen pública.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Imagen local</label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={(event) => handleImageFile(event)}
                  className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
                />
                <p className="text-xs text-[#C9F7EE]">Carga directamente desde tu dispositivo.</p>
              </div>
            </div>

            {previewImage && (
              <div className="rounded-3xl border border-[#17364F] bg-[#0D1A2F]/5 p-4 text-[#E2E8F0]">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-white">Vista previa de imagen</p>
                  <span className="rounded-full bg-[#09D8C7]/20 px-3 py-1 text-xs text-[#09D8C7]">Local/URL</span>
                </div>
                <div className="mt-4 overflow-hidden rounded-3xl bg-[#11243B] p-3">
                  <img src={previewImage} alt="Vista previa de certificación" className="h-44 w-full object-contain" />
                </div>
              </div>
            )}

            {imageError && <p className="text-xs text-[#FCA5A5]">{imageError}</p>}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Estado</label>
              <select
                {...registerEdit('status')}
                className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
              >
                <option>Activo</option>
                <option>Inactivo</option>
                <option>Obsoleto</option>
                <option>En proceso de certificación</option>
              </select>
            </div>

            {[
              { name: 'tools', label: 'Herramientas', hint: 'Formato: Postman | Jira | SQL | Cypress' },
              { name: 'integrations', label: 'Integraciones', hint: 'Formato: GitHub | Vercel | Supabase' },
              { name: 'summary', label: 'Resumen', hint: 'Mínimo recomendado: 20 caracteres' }
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-semibold text-white">{field.label}</label>
                <textarea
                  {...registerEdit(field.name)}
                  rows={field.name === 'summary' ? 4 : 2}
                  className="w-full rounded-2xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none focus:border-[#09D8C7] focus:ring-2 focus:ring-[#09D8C7]/30"
                />
                <p className="text-xs text-[#C9F7EE]">{field.hint}</p>
              </div>
            ))}
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CertificationsManager;

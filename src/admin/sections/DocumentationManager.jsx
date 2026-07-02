import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { ConfirmDialog } from '../../components/ConfirmDialog.jsx';
import { Plus, Trash2, Edit, HelpCircle } from 'lucide-react';
import Modal from '../../components/Modal.jsx';

const docSchema = z.object({
  title: z.string().min(3, 'El título es obligatorio'),
  category: z.string().min(3, 'La categoría es obligatoria'),
  type: z.string().min(3, 'El tipo es obligatorio'),
  template: z.string().min(3, 'El nombre de la plantilla es obligatorio'),
  methodology: z.string().optional(),
  questions: z.string().optional(),
  parameters: z.string().optional(),
  checklist: z.string().optional(),
  strategies: z.string().optional()
});

const DocumentationManager = () => {
  const { store, actions } = usePortfolio();
  const { toast } = useToast();
  const [activeDoc, setActiveDoc] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);

  // Deletion confirm states
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  const defaultValues = {
    title: '',
    category: '',
    type: '',
    template: '',
    methodology: '',
    questions: '',
    parameters: '',
    checklist: '',
    strategies: ''
  };

  const { register, handleSubmit: handleSubmitCreate, reset, formState: { errors } } = useForm({
    resolver: zodResolver(docSchema),
    defaultValues
  });

  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, formState: { errors: editErrors } } = useForm({
    resolver: zodResolver(docSchema),
    defaultValues
  });

  const openEditor = (template) => {
    setActiveDoc(template);
    resetEdit({
      title: template.title,
      category: template.category,
      type: template.type,
      template: template.template,
      methodology: template.methodology || '',
      questions: template.questions ? template.questions.join(', ') : '',
      parameters: template.parameters ? template.parameters.join(', ') : '',
      checklist: template.checklist ? template.checklist.join(', ') : '',
      strategies: template.strategies ? template.strategies.join(', ') : ''
    });
  };

  const closeEditor = () => {
    setActiveDoc(null);
    resetEdit(defaultValues);
  };

  const onCreateTemplate = (data) => {
    try {
      actions.addDocumentationTemplate(data);
      toast.success('Plantilla de documentación creada con éxito');
      reset(defaultValues);
    } catch (e) {
      toast.error('Error al crear la plantilla');
    }
  };

  const onUpdateTemplate = (data) => {
    if (!activeDoc) return;
    try {
      actions.updateDocumentationTemplate(activeDoc.id, data);
      toast.success('Plantilla de documentación actualizada correctamente');
      closeEditor();
    } catch (e) {
      toast.error('Error al actualizar la plantilla');
    }
  };

  const handleDeleteClick = (template) => {
    setDocToDelete(template);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (docToDelete) {
      try {
        actions.deleteDocumentationTemplate(docToDelete.id);
        toast.success('Plantilla de documentación eliminada correctamente');
      } catch (e) {
        toast.error('Error al eliminar la plantilla');
      }
      setDocToDelete(null);
    }
    setIsDeleteConfirmOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-[#17364F] bg-[#0D1A2F] p-8 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.6)] text-white">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-[#09D8C7]/80">Panel de documentación</p>
            <h1 className="mt-4 text-4xl font-semibold">Plantillas QA</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#C9F7EE]/80">
              Crea y organiza plantillas de documentación desde un espacio moderno, claro y seguro.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={closeEditor}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#09D8C7] px-4 py-3 text-sm font-semibold text-[#0D1A2F] shadow-lg shadow-[#09D8C7]/20 transition hover:bg-[#08c1b6] duration-200"
            >
              <Plus className="w-4 h-4" /> Nueva plantilla
            </button>
            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#09D8C7] bg-[#09D8C7]/10 px-4 py-3 text-sm font-semibold text-[#09D8C7] hover:bg-[#09D8C7]/20 focus:outline-none focus:ring-2 focus:ring-[#09D8C7] transition duration-200"
            >
              <HelpCircle className="w-4 h-4" /> Ayuda
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-4">
          <div className="rounded-[1.75rem] border border-[#17364F] bg-[#11243B] p-6 shadow-lg shadow-[#0D1A2F]/10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-[#E5F9F4]">Plantillas activas</h2>
                <p className="mt-1 text-sm text-[#B8EDE6]">Gestiona tus plantillas QA con acciones rápidas y vista clara.</p>
              </div>
              <span className="rounded-full bg-[#09D8C7]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#09D8C7]">
                {store.documentation.templates.length} plantillas
              </span>
            </div>
          </div>

          {store.documentation.templates.map((template) => (
            <article key={template.id} className="group rounded-[1.75rem] border border-[#17364F] bg-[#0E2036] p-6 shadow-lg shadow-[#0D1A2F]/15 transition duration-200 hover:-translate-y-1 hover:border-[#09D8C7]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#09D8C7]/80">{template.category}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{template.title}</h3>
                  <p className="mt-2 text-sm text-[#B8EDE6]">{template.type}</p>
                </div>
                <div className="flex flex-wrap gap-3 shrink-0">
                  <button
                    onClick={() => openEditor(template)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-[#09D8C7] px-4 py-2 text-sm font-semibold text-[#09D8C7] transition hover:bg-[#09D8C7]/10"
                  >
                    <Edit className="w-4 h-4" /> Editar
                  </button>
                  <button
                    onClick={() => handleDeleteClick(template)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-[#BD0927] bg-[#BD0927]/10 px-4 py-2 text-sm font-semibold text-[#BD0927] transition hover:bg-[#BD0927]/20"
                  >
                    <Trash2 className="w-4 h-4" /> Eliminar
                  </button>
                </div>
              </div>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#C9F7EE]/80 line-clamp-3">{template.template}</p>
            </article>
          ))}
        </section>

        <section className="rounded-[2rem] border border-[#17364F] bg-[#11243B] p-6 shadow-lg shadow-[#0D1A2F]/15">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#09D8C7]/10">
            <div>
              <h2 className="text-2xl font-semibold text-white">Formulario de plantilla</h2>
              <p className="mt-1 text-sm text-[#B8EDE6]">Rellena los campos para crear una plantilla QA.</p>
            </div>
          </div>

          <form onSubmit={handleSubmitCreate(onCreateTemplate)} className="mt-6 space-y-5">
            {[
              { name: 'title', label: 'Título', placeholder: 'Plantilla de reporte QA' },
              { name: 'category', label: 'Categoría', placeholder: 'Checklist, Guía, Reporte' },
              { name: 'type', label: 'Tipo', placeholder: 'Checklist | Informe | Proceso' },
              { name: 'template', label: 'Nombre de plantilla', placeholder: 'Nombre corto de plantilla' }
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-semibold text-[#E5F9F4]">{field.label}</label>
                <input
                  type="text"
                  {...register(field.name)}
                  placeholder={field.placeholder}
                  className="w-full rounded-3xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none transition focus:border-[#09D8C7] focus:ring-[#09D8C7]/30"
                />
                {errors[field.name] && <p className="text-xs text-[#FF7E8B]">{errors[field.name].message}</p>}
              </div>
            ))}

            {[
              { name: 'methodology', label: 'Metodología' },
              { name: 'questions', label: 'Preguntas (separadas por comas)' },
              { name: 'parameters', label: 'Parámetros (separados por comas)' },
              { name: 'checklist', label: 'Checklist (separadas por comas)' },
              { name: 'strategies', label: 'Estrategias (separadas por comas)' }
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-semibold text-[#E5F9F4]">{field.label}</label>
                <textarea
                  {...register(field.name)}
                  rows={field.name === 'methodology' ? 4 : 2}
                  className="w-full rounded-3xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none transition focus:border-[#09D8C7] focus:ring-[#09D8C7]/30"
                />
              </div>
            ))}

            <div className="flex justify-end gap-3 pt-3">
              <button type="reset" onClick={() => reset(defaultValues)} className="rounded-2xl border border-[#17364F] px-5 py-3 text-sm font-semibold text-[#B8EDE6] hover:bg-[#17364F]/10 transition">
                Limpiar
              </button>
              <button type="submit" className="rounded-2xl bg-[#09D8C7] px-5 py-3 text-sm font-semibold text-[#0D1A2F] transition hover:bg-[#08c1b6]">
                Crear plantilla
              </button>
            </div>
          </form>
        </section>
      </div>

      {activeDoc && (
        <Modal
          isOpen={Boolean(activeDoc)}
          onClose={closeEditor}
          title="Editar plantilla QA"
          subtitle="Edita la plantilla seleccionada."
          footer={
            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={closeEditor}
                className="rounded-2xl border border-[#17364F] px-5 py-3 text-sm font-semibold text-[#B8EDE6] hover:bg-[#17364F]/10 transition"
              >
                Cancelar
              </button>
              <button
                form="edit-doc-form"
                type="submit"
                className="rounded-2xl bg-[#09D8C7] px-5 py-3 text-sm font-semibold text-[#0D1A2F] hover:bg-[#08c1b6] transition"
              >
                Guardar cambios
              </button>
            </div>
          }
        >
          <form 
            id="edit-doc-form" 
            onSubmit={handleSubmitEdit(onUpdateTemplate)} 
            className="mt-6 space-y-5 max-h-[60vh] overflow-y-auto pr-2"
          >
            {[
              { name: 'title', label: 'Título', placeholder: 'Plantilla de reporte QA' },
              { name: 'category', label: 'Categoría', placeholder: 'Checklist, Guía, Reporte' },
              { name: 'type', label: 'Tipo', placeholder: 'Checklist | Informe | Proceso' },
              { name: 'template', label: 'Nombre de plantilla', placeholder: 'Nombre corto de plantilla' }
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-semibold text-[#E5F9F4]">{field.label}</label>
                <input
                  type="text"
                  {...registerEdit(field.name)}
                  placeholder={field.placeholder}
                  className="w-full rounded-3xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none transition focus:border-[#09D8C7] focus:ring-[#09D8C7]/30"
                />
                {editErrors[field.name] && <p className="text-xs text-[#FF7E8B]">{editErrors[field.name].message}</p>}
              </div>
            ))}

            {[
              { name: 'methodology', label: 'Metodología', placeholder: 'Describe el proceso o enfoque usado.' },
              { name: 'questions', label: 'Preguntas (separadas por comas)', placeholder: '¿Funciona? ¿Se muestra correctamente?' },
              { name: 'parameters', label: 'Parámetros (separados por comas)', placeholder: 'Velocidad, compatibilidad, accesibilidad' },
              { name: 'checklist', label: 'Checklist (separadas por comas)', placeholder: 'Elementos visibles, enlaces, roles ARIA' },
              { name: 'strategies', label: 'Estrategias (separadas por comas)', placeholder: 'E2E, unitarias, revisión manual' }
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-semibold text-[#E5F9F4]">{field.label}</label>
                <textarea
                  {...registerEdit(field.name)}
                  rows={field.name === 'methodology' ? 4 : 2}
                  placeholder={field.placeholder}
                  className="w-full rounded-3xl border border-[#17364F] bg-[#0D1A2F] px-4 py-3 text-white outline-none transition focus:border-[#09D8C7] focus:ring-[#09D8C7]/30"
                />
              </div>
            ))}
          </form>
        </Modal>
      )}

      <Modal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        title="Ayuda para plantillas QA"
        subtitle="Guía rápida sobre cómo crear plantillas de documentación claras y reutilizables."
        footer={
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setHelpOpen(false)}
              className="rounded-2xl bg-[#09D8C7] px-5 py-3 text-sm font-semibold text-[#0D1A2F] hover:bg-[#08c1b6]"
            >
              Cerrar ayuda
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="rounded-3xl border border-[#17364F] bg-[#0D1A2F]/80 p-4">
            <p className="font-semibold text-white">Cómo usar el formulario</p>
            <p className="mt-2 text-sm text-[#C9F7EE]">Completa el título, categoría, tipo y nombre de plantilla para crear una plantilla válida. Los campos adicionales son opcionales.</p>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="Eliminar Plantilla QA"
        description={`¿Estás seguro de que deseas eliminar la plantilla "${docToDelete?.title || ''}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteConfirmOpen(false)}
      />
    </div>
  );
};

export default DocumentationManager;

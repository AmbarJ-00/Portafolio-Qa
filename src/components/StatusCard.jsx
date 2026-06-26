import React from 'react';
import { Wrench, AlertTriangle, BookOpen, GraduationCap } from 'lucide-react';

export const StatusCard = ({ status, type = 'project', children }) => {
  // For skills, always render children directly (compact grid cards)
  if (type === 'skill') {
    return children;
  }

  if (status === 'maintenance' || status === 'Mantenimiento') {
    return (
      <div className="glass-card rounded-2xl overflow-hidden relative border border-amber-500/30 bg-amber-950/10 p-6 flex flex-col justify-between h-full min-h-[280px]">
        {/* Warning pattern background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(45deg,#000,#000_10px,#f59e0b_10px,#f59e0b_20px)]" />

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-amber-500">
            <Wrench className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">En Mantenimiento</span>
          </div>

          <h3 className="text-xl font-bold text-slate-200">
            {type === 'project' ? 'Proyecto en Mantenimiento' : 'Certificación en Actualización'}
          </h3>

          <p className="text-sm text-slate-400 leading-relaxed">
            Estamos optimizando este elemento para alinearlo con los estándares de calidad más recientes. Vuelve pronto para ver los resultados.
          </p>
        </div>

        <div className="pt-4 mt-auto border-t border-slate-800/60 flex items-center gap-2 text-xs text-amber-500 font-semibold">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Fase de pruebas en progreso</span>
        </div>
      </div>
    );
  }

  if (status === 'learning' || status === 'En proceso' || status === 'learning-state') {
    return (
      <div className="glass-card rounded-2xl overflow-hidden relative border border-indigo-500/30 bg-indigo-950/10 p-6 flex flex-col justify-between h-full min-h-[280px]">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <BookOpen className="w-5 h-5 animate-bounce" />
            <span className="text-xs font-bold uppercase tracking-widest">Adquiriendo Conocimiento</span>
          </div>

          <h3 className="text-xl font-bold text-slate-200">
            {type === 'project' ? 'Próxima Implementación' : 'Certificación en Curso'}
          </h3>

          <p className="text-sm text-slate-400 leading-relaxed">
            Actualmente trabajando en el desarrollo, estudio y validación práctica de este conjunto de tecnologías.
          </p>
        </div>

        <div className="pt-4 mt-auto border-t border-slate-800/60 flex items-center gap-2 text-xs text-indigo-400 font-semibold">
          <GraduationCap className="w-4 h-4 shrink-0" />
          <span>Planificación activa</span>
        </div>
      </div>
    );
  }

  return children;
};

export default StatusCard;

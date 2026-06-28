import React from 'react';
import { Wrench, AlertTriangle, BookOpen, GraduationCap } from 'lucide-react';

export const StatusCard = ({ status, type = 'project', children }) => {
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
            {type === 'project' ? 'Proyecto en Mantenimiento' : type === 'skill' ? 'Habilidad en Reevaluación' : 'Certificación en Actualización'}
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
            {type === 'project' ? 'Próxima Implementación' : type === 'skill' ? 'En Proceso de Adquisición' : 'Certificación en Curso'}
          </h3>

          <p className="text-sm text-slate-400 leading-relaxed">
            Actualmente trabajando en el desarrollo, estudio y validación práctica de este conjunto de tecnologías.
          </p>

          {/* Progress bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs text-slate-450">
              <span>Progreso de estudio</span>
              <span className="font-bold text-indigo-400 animate-pulse">65%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-violet-400 h-full rounded-full animate-pulse" 
                style={{ width: '65%' }}
              />
            </div>
          </div>
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

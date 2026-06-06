import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ToastContainer = () => {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => dismissToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem = ({ toast, onClose }) => {
  const { message, type } = toast;

  const config = {
    success: {
      bgColor: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
      progressColor: 'bg-emerald-500',
    },
    error: {
      bgColor: 'bg-red-950/80 border-red-500/50 text-red-200',
      icon: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
      progressColor: 'bg-red-500',
    },
    warning: {
      bgColor: 'bg-amber-950/80 border-amber-500/50 text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
      progressColor: 'bg-amber-500',
    },
    info: {
      bgColor: 'bg-blue-950/80 border-blue-500/50 text-blue-200',
      icon: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
      progressColor: 'bg-blue-500',
    },
  }[type] || {
    bgColor: 'bg-slate-900/80 border-slate-500/50 text-slate-200',
    icon: <Info className="w-5 h-5 text-slate-400 shrink-0" />,
    progressColor: 'bg-slate-500',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl ${config.bgColor}`}
    >
      {config.icon}
      <div className="flex-1 text-sm font-medium leading-5 pr-2">{message}</div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-200 transition-colors p-0.5 rounded-lg hover:bg-white/10 shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

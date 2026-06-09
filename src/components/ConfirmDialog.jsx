import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDangerous = true,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Dialog Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl shrink-0 ${isDangerous ? 'bg-red-500/10 text-red-500' : 'bg-brand-electric-500/10 text-brand-electric-500'}`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white leading-6">{title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{description}</p>
              </div>
              <button
                onClick={onCancel}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-xl transition-all"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all shadow-lg shadow-red-950/20 ${
                  isDangerous
                    ? 'bg-red-600 hover:bg-red-500 hover:shadow-red-600/20'
                    : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-600/20'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;


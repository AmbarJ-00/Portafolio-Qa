import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, subtitle, children, footer, size = 'lg', closeLabel = 'Cerrar' }) => {
  useEffect(() => {
    if (!isOpen) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-xl',
    md: 'max-w-2xl',
    lg: 'max-w-3xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizes[size]} overflow-hidden rounded-[2rem] border border-[#09D8C7] bg-[#11243B] shadow-[0_35px_90px_-30px_rgba(0,0,0,0.8)]`} role="dialog" aria-modal="true">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#09D8C7]/20 bg-[#11243B] px-6 py-5">
          <div>
            {title && <h2 className="text-2xl font-semibold text-white">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-[#C9F7EE]">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#17364F] p-2 text-[#09D8C7] transition hover:bg-[#0D1A2F] focus:outline-none focus:ring-2 focus:ring-[#09D8C7]"
            aria-label={closeLabel}
          >
            ✕
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-6">
          {children}
        </div>
        {footer && <div className="sticky bottom-0 border-t border-[#09D8C7]/20 bg-[#11243B] px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;

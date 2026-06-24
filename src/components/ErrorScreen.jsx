import React from 'react';
import { Database, ShieldAlert, Key, Settings, AlertTriangle, RefreshCw, Home } from 'lucide-react';

const ErrorScreen = ({ code = 'Server-500', customMessage = '', onRetry = null }) => {
  
  const getErrorDetails = (errorCode) => {
    switch (errorCode) {
      case 'DB-500':
        return {
          title: 'Error de Base de Datos',
          subtitle: 'No se pudo conectar con el sistema de base de datos MySQL.',
          description: customMessage || 'El servidor de base de datos no está respondiendo, los servicios están caídos o las credenciales configuradas son incorrectas.',
          icon: Database,
          iconColor: 'text-red-500 border-red-500/20 bg-red-950/20',
          codeLabel: 'Error #DB-500',
          actions: onRetry ? [
            { label: 'Reintentar conexión', onClick: onRetry, primary: true, icon: RefreshCw }
          ] : [
            { label: 'Recargar página', onClick: () => window.location.reload(), primary: true, icon: RefreshCw }
          ]
        };
      case 'Auth-401':
        return {
          title: 'Error de Autenticación',
          subtitle: 'Tu sesión ha expirado o tus credenciales son incorrectas.',
          description: customMessage || 'No tienes una sesión activa válida o la firma de autenticación no coincide con el servidor de seguridad.',
          icon: Key,
          iconColor: 'text-[#09D8C7] border-[#09D8C7]/20 bg-[#09D8C7]/10',
          codeLabel: 'Error #Auth-401',
          actions: [
            { label: 'Volver al inicio', onClick: () => window.location.href = '/', primary: true, icon: Home }
          ]
        };
      case 'Permission-403':
        return {
          title: 'Error de Permisos',
          subtitle: 'Acceso Denegado: Permisos Insuficientes.',
          description: customMessage || 'Tu nivel de rol de usuario no cuenta con los privilegios necesarios para realizar modificaciones o acceder a esta sección.',
          icon: ShieldAlert,
          iconColor: 'text-amber-500 border-amber-500/20 bg-amber-950/20',
          codeLabel: 'Error #Permission-403',
          actions: [
            { label: 'Volver al inicio', onClick: () => window.location.href = '/', primary: true, icon: Home }
          ]
        };
      case 'Config-001':
        return {
          title: 'Módulo Pendiente de Configuración',
          subtitle: 'Este es un módulo nuevo.',
          description: customMessage || 'Debe configurarse un mensaje personalizado antes de publicarse.',
          icon: Settings,
          iconColor: 'text-brand-lilac-500 border-brand-lilac-500/20 bg-brand-lilac-950/20',
          codeLabel: 'Referencia: Error #Config-001',
          actions: [
            { label: 'Volver al inicio', onClick: () => window.location.href = '/', primary: true, icon: Home }
          ]
        };
      case 'Server-500':
      default:
        return {
          title: 'Error Interno del Servidor',
          subtitle: 'El servidor de APIs experimentó un fallo imprevisto.',
          description: customMessage || 'Ocurrió un error inesperado al procesar la última acción del usuario o al contactar con la API remota.',
          icon: AlertTriangle,
          iconColor: 'text-red-400 border-red-400/20 bg-red-950/20',
          codeLabel: 'Error #Server-500',
          actions: [
            { label: 'Volver al inicio', onClick: () => window.location.href = '/', primary: false, icon: Home },
            { label: 'Recargar', onClick: () => window.location.reload(), primary: true, icon: RefreshCw }
          ]
        };
    }
  };

  const details = getErrorDetails(code);
  const IconComponent = details.icon;

  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center p-6 text-white animate-fade-in relative z-10">
      <div className="w-full max-w-lg glass-card p-8 rounded-3xl border border-brand-ash-200/20 bg-brand-navy-950/50 shadow-2xl space-y-6 text-center">
        
        {/* Animated Icon Container */}
        <div className={`inline-flex p-4 rounded-2xl border ${details.iconColor} shadow-lg shadow-black/25 animate-pulse`}>
          <IconComponent className="w-10 h-10" />
        </div>

        {/* Error Headers */}
        <div className="space-y-2">
          <span className="text-xs font-bold font-mono px-3 py-1 bg-black/30 border border-brand-ash-200/10 rounded-full text-brand-ash-300">
            {details.codeLabel}
          </span>
          <h2 className="text-2xl font-display font-extrabold text-white mt-3">
            {details.title}
          </h2>
          <p className="text-sm font-semibold text-brand-electric-500">
            {details.subtitle}
          </p>
        </div>

        {/* Informative description */}
        <p className="text-xs text-brand-ash-400 leading-relaxed bg-black/20 p-4 rounded-xl border border-brand-ash-200/5 text-left">
          {details.description}
        </p>

        {/* Custom actions buttons */}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          {details.actions.map((act, idx) => {
            const ButtonIcon = act.icon;
            return (
              <button
                key={idx}
                onClick={act.onClick}
                className={`inline-flex items-center gap-2 px-5 py-3 text-xs font-bold rounded-xl transition duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  act.primary
                    ? 'bg-[#09D8C7] text-[#0D1A2F] hover:bg-[#08c1b6] shadow-lg shadow-[#09D8C7]/10'
                    : 'bg-brand-navy-800 border border-brand-ash-200/15 text-brand-ash-200 hover:bg-brand-navy-750'
                }`}
              >
                {ButtonIcon && <ButtonIcon className="w-4 h-4" />}
                <span>{act.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default ErrorScreen;

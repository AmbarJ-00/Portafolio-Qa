import React from 'react';
import { Database, ShieldAlert, Key, Settings, AlertTriangle, RefreshCw, Home, ArrowRight } from 'lucide-react';

const ErrorScreen = ({ code = 'Server-500', customMessage = '', onRetry = null }) => {

  const getErrorDetails = (errorCode) => {
    switch (errorCode) {
      case 'DB-500':
        return {
          title: 'Error de Base de Datos',
          subtitle: 'No se pudo conectar con el sistema de base de datos MySQL.',
          description: customMessage || 'El servidor de base de datos no está respondiendo, los servicios están caídos o las credenciales configuradas son incorrectas.',
          icon: Database,
          iconColor: 'text-red-500',
          iconBg: 'rgba(239,68,68,0.1)',
          iconBorder: 'rgba(239,68,68,0.2)',
          codeLabel: 'Error #DB-500',
          actions: onRetry
            ? [{ label: 'Reintentar conexión', onClick: onRetry, primary: true, icon: RefreshCw }]
            : [{ label: 'Recargar página', onClick: () => window.location.reload(), primary: true, icon: RefreshCw }]
        };
      case 'Auth-401':
        return {
          title: 'Error de Autenticación',
          subtitle: 'Tu sesión ha expirado o tus credenciales son incorrectas.',
          description: customMessage || 'No tienes una sesión activa válida o la firma de autenticación no coincide con el servidor de seguridad.',
          icon: Key,
          iconColor: 'text-emerald-400',
          iconBg: 'rgba(52,211,153,0.1)',
          iconBorder: 'rgba(52,211,153,0.2)',
          codeLabel: 'Error #Auth-401',
          actions: [{ label: 'Ir al Login', onClick: () => window.location.href = '/backoffice/login', primary: true, icon: ArrowRight }]
        };
      case 'Permission-403':
        return {
          title: 'Error de Permisos',
          subtitle: 'Acceso Denegado: Permisos Insuficientes.',
          description: customMessage || 'Tu nivel de rol de usuario no cuenta con los privilegios necesarios para realizar modificaciones o acceder a esta sección.',
          icon: ShieldAlert,
          iconColor: 'text-amber-500',
          iconBg: 'rgba(245,158,11,0.1)',
          iconBorder: 'rgba(245,158,11,0.2)',
          codeLabel: 'Error #Permission-403',
          actions: [{ label: 'Volver al inicio', onClick: () => window.location.href = '/', primary: true, icon: Home }]
        };
      case 'Config-001':
        return {
          title: 'Módulo Pendiente de Configuración',
          subtitle: 'Este es un módulo nuevo.',
          description: customMessage || 'Debe configurarse un mensaje personalizado antes de publicarse.',
          icon: Settings,
          iconColor: '',
          iconBg: 'rgba(214,136,128,0.1)',
          iconBorder: 'rgba(214,136,128,0.2)',
          codeLabel: 'Referencia: Error #Config-001',
          actions: [{ label: 'Volver al inicio', onClick: () => window.location.href = '/', primary: true, icon: Home }]
        };
      case 'Server-500':
      default:
        return {
          title: 'Error Interno del Servidor',
          subtitle: 'El servidor de APIs experimentó un fallo imprevisto.',
          description: customMessage || 'Ocurrió un error inesperado al procesar la última acción del usuario o al contactar con la API remota.',
          icon: AlertTriangle,
          iconColor: 'text-red-400',
          iconBg: 'rgba(248,113,113,0.1)',
          iconBorder: 'rgba(248,113,113,0.2)',
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
    <div className="min-h-[75vh] flex flex-col justify-center items-center p-6 animate-fade-in relative z-10">
      <div
        className="w-full max-w-lg glass-card p-8 rounded-3xl shadow-2xl space-y-6 text-center"
        style={{ border: '1px solid var(--color-border)' }}
      >
        {/* Icon */}
        <div
          className={`inline-flex p-4 rounded-2xl shadow-lg animate-pulse ${details.iconColor}`}
          style={{ background: details.iconBg, border: `1px solid ${details.iconBorder}` }}
        >
          <IconComponent className="w-10 h-10" />
        </div>

        {/* Headers */}
        <div className="space-y-2">
          <span
            className="text-xs font-bold font-mono px-3 py-1 rounded-full"
            style={{ background: 'var(--bg-card)', color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}
          >
            {details.codeLabel}
          </span>
          <h2 className="text-2xl font-display font-extrabold mt-3" style={{ color: 'var(--color-text)' }}>
            {details.title}
          </h2>
          <p className="text-sm font-semibold" style={{ color: 'var(--color-button)' }}>
            {details.subtitle}
          </p>
        </div>

        {/* Description */}
        <p
          className="text-xs leading-relaxed p-4 rounded-xl text-left"
          style={{
            color: 'var(--color-muted)',
            background: 'var(--bg-card)',
            border: '1px solid var(--color-border)'
          }}
        >
          {details.description}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          {details.actions.map((act, idx) => {
            const ButtonIcon = act.icon;
            return (
              <button
                key={idx}
                onClick={act.onClick}
                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold rounded-xl transition duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={act.primary
                  ? { background: 'var(--color-button)', color: '#fff' }
                  : { background: 'var(--bg-card)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }
                }
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

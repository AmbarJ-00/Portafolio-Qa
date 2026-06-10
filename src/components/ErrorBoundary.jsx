import React from 'react';
import { Terminal, RefreshCw, Home, AlertOctagon, Layout } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  // handleGoPanel = () => {
  //   window.location.href = '/backoffice';
  // };

  getErrorDetails(error) {
    const msg = (error?.message || error?.toString() || '').toLowerCase();

    if (
      msg.includes('auth') ||
      msg.includes('login') ||
      msg.includes('token') ||
      msg.includes('permission') ||
      msg.includes('unauthorized') ||
      msg.includes('forbidden') ||
      msg.includes('autenticaci')
    ) {
      return {
        title: 'Error de Autenticación',
        description: 'Ocurrió un problema al validar tus credenciales de acceso o tu sesión ha expirado.',
        causes: [
          'Sesión inactiva por demasiado tiempo.',
          'Intento de acceso a una ruta protegida sin los permisos necesarios.',
          'Token de seguridad corrupto, inválido o expirado.'
        ]
      };
    }

    if (
      msg.includes('module') ||
      msg.includes('módulo') ||
      msg.includes('custommodule') ||
      msg.includes('widget')
    ) {
      return {
        title: 'Error de Módulo',
        description: 'Ocurrió un fallo al inicializar o interactuar con uno de los módulos dinámicos de la aplicación.',
        causes: [
          'Incompatibilidad o corrupción en el esquema del módulo.',
          'Configuración incompleta o falta de campos obligatorios en el componente.',
          'Excepción inesperada al procesar el estado local del módulo.'
        ]
      };
    }

    if (
      msg.includes('load') ||
      msg.includes('loading') ||
      msg.includes('chunk') ||
      msg.includes('fetch') ||
      msg.includes('import') ||
      msg.includes('dns') ||
      msg.includes('network')
    ) {
      return {
        title: 'Error de Carga',
        description: 'No se pudieron descargar los scripts o recursos estáticos necesarios para visualizar esta sección.',
        causes: [
          'Micro-cortes en la conexión de red local.',
          'Archivos de script temporales obsoletos o corruptos en el caché del navegador.',
          'Fallo de descarga de fragmentos optimizados (chunks/lazy loads) desde el servidor CDN.'
        ]
      };
    }

    if (
      msg.includes('integration') ||
      msg.includes('integración') ||
      msg.includes('api') ||
      msg.includes('database') ||
      msg.includes('storage') ||
      msg.includes('sync') ||
      msg.includes('parse')
    ) {
      return {
        title: 'Error de Integración',
        description: 'Hubo un fallo en el intercambio de información entre los servicios o el almacenamiento interno.',
        causes: [
          'Fallo de lectura/escritura en el almacenamiento local persistente (LocalStorage).',
          'Esquema de datos inconsistente tras una actualización manual del backend.',
          'Interrupción inesperada en la sincronización de flujo de datos con APIs externas.'
        ]
      };
    }

    // Default / Generic Error
    return {
      title: 'Error de Ejecución',
      description: 'El sistema detectó una excepción no controlada en el entorno de ejecución de la aplicación.',
      causes: [
        'Excepción imprevista en el ciclo de vida de React.',
        'Estado inconsistente al procesar la última acción del usuario.',
        'Incompatibilidad menor con la versión o características del navegador web.'
      ]
    };
  }

  render() {
    if (this.state.hasError) {
      const details = this.getErrorDetails(this.state.error);

      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6 select-none relative overflow-hidden">
          {/* Futuristic background lines */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="w-full max-w-xl text-center space-y-6 relative z-10">
            {/* Header Icon */}
            <div className="inline-flex p-4 rounded-3xl bg-red-950/35 border border-red-500/25 text-red-500 shadow-lg shadow-red-950/20 animate-pulse">
              <AlertOctagon className="w-12 h-12" />
            </div>

            {/* Error Message */}
            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                QA Shield: {details.title}
              </h1>
              <p className="text-slate-350 text-sm md:text-base leading-relaxed max-w-md mx-auto">
                {details.description}
              </p>
            </div>

            {/* Possible Causes List */}
            <div className="text-left bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5 space-y-3 shadow-inner">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Posibles causas:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-300">
                {details.causes.map((cause, idx) => (
                  <li key={idx} className="leading-relaxed">{cause}</li>
                ))}
              </ul>
            </div>

            {/* Diagnostic Box */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-4 text-left font-mono text-xs text-red-400/95 overflow-x-auto max-h-32 shadow-inner">
              <p className="font-bold border-b border-slate-800 pb-2 flex items-center gap-2 text-slate-450">
                <Terminal className="w-4 h-4 text-slate-400" />
                <span>DIAGNOSTIC_INFO:</span>
              </p>
              <p className="mt-2 whitespace-pre-wrap">{this.state.error?.toString() || 'Unknown runtime error'}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-red-650 hover:bg-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
              >
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
                <span>Reintentar</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold rounded-xl border border-slate-700/50 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
              >
                <Home className="w-4 h-4" />
                <span>Volver al inicio</span>
              </button>
              <button
                onClick={this.handleGoPanel}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-755 text-slate-250 font-semibold rounded-xl border border-slate-700/55 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
              >
                <Layout className="w-4 h-4 text-[#09D8C7]" />
                <span>Volver al panel</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


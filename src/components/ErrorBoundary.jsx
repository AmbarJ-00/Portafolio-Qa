import React from 'react';
import { Terminal, RefreshCw, Home, AlertOctagon } from 'lucide-react';

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

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6 select-none relative overflow-hidden">
          {/* Futuristic background lines */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="w-full max-w-xl text-center space-y-8 relative z-10">
            {/* Header Icon */}
            <div className="inline-flex p-4 rounded-3xl bg-red-950/35 border border-red-500/25 text-red-500 shadow-lg shadow-red-950/20 animate-pulse">
              <AlertOctagon className="w-12 h-12" />
            </div>

            {/* Error Message */}
            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                QA Shield: Error de Ejecución
              </h1>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-md mx-auto">
                El sistema detectó una excepción no controlada en el entorno de ejecución. Los logs de depuración automáticos ya han registrado la anomalía.
              </p>
            </div>

            {/* Diagnostic Box */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 text-left font-mono text-xs text-red-400 overflow-x-auto max-h-40 shadow-inner">
              <p className="font-bold border-b border-slate-800 pb-2 flex items-center gap-2 text-slate-350">
                <Terminal className="w-4 h-4 text-slate-400" />
                <span>DIAGNOSTIC_INFO:</span>
              </p>
              <p className="mt-2 whitespace-pre-wrap">{this.state.error?.toString() || 'Unknown runtime error'}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl shadow-lg shadow-red-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
                <span>Reintentar carga</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Home className="w-4 h-4" />
                <span>Volver al inicio</span>
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

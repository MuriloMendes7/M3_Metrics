// src/components/common/SplashScreen.jsx
import { Activity, Loader2 } from 'lucide-react';

export function SplashScreen() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
        <Activity size={32} aria-hidden="true" />
      </span>

      <div className="flex flex-col items-center gap-2">
        <p className="text-lg font-bold text-slate-800">PT Manager</p>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="animate-spin" size={16} aria-hidden="true" />
          <span>Carregando sua conta...</span>
        </div>
      </div>
    </div>
  );
}
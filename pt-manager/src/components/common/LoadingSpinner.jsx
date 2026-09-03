// src/components/common/LoadingSpinner.jsx
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ label = 'Carregando...' }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center gap-2 py-8 text-slate-500">
      <Loader2 className="animate-spin" size={28} aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
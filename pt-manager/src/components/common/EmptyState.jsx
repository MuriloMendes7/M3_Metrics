// src/components/common/EmptyState.jsx
export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-slate-500">
      {Icon && <Icon size={32} aria-hidden="true" className="text-slate-300" />}
      <p className="font-medium text-slate-700">{title}</p>
      {description && <p className="max-w-sm text-sm">{description}</p>}
    </div>
  );
}
// src/components/layout/Header.jsx
import { Menu, Bell, ChevronDown } from 'lucide-react';

export function Header({ onMenuClick, trainerName = 'Treinador' }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir menu de navegação"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={22} aria-hidden="true" />
        </button>
        <h1 className="text-base font-semibold text-slate-800 sm:text-lg">Painel do Treinador</h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Ver notificações"
          className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100"
        >
          <Bell size={20} aria-hidden="true" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100"
          aria-label={`Menu do usuário: ${trainerName}`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white">
            {trainerName.charAt(0).toUpperCase()}
          </span>
          <span className="hidden text-sm font-medium text-slate-700 sm:inline">{trainerName}</span>
          <ChevronDown size={16} className="hidden text-slate-400 sm:inline" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
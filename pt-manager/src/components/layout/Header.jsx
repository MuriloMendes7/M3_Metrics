// src/components/layout/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';

export function Header({ onMenuClick }) {
  const { trainer, logout } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

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

        <Link
          to="/perfil"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100"
          aria-label={`Ver perfil de ${trainer?.name || 'treinador'}`}
        >
          {profile?.avatarDataUrl ? (
            <img
              src={profile.avatarDataUrl}
              alt=""
              aria-hidden="true"
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white">
              {(trainer?.name || 'T').charAt(0).toUpperCase()}
            </span>
          )}
          <span className="hidden text-sm font-medium text-slate-700 sm:inline">{trainer?.name}</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Sair da conta"
          className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
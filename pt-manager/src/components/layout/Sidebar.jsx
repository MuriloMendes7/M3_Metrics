// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Dumbbell, Apple, Activity } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/alunos', label: 'Alunos', icon: Users },
  { to: '/treinos', label: 'Treinos', icon: Dumbbell },
  { to: '/dieta', label: 'Dieta', icon: Apple },
];

export function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Navegação principal"
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
          <Activity className="text-emerald-500" size={24} aria-hidden="true" />
          <span className="text-lg font-bold text-slate-800">PT Manager</span>
        </div>

        <nav aria-label="Menu principal" className="flex flex-col gap-1 p-4">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
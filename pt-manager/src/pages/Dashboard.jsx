// src/pages/Dashboard.jsx
import { Users, Dumbbell, TrendingUp } from 'lucide-react';

const STATS = [
  { label: 'Alunos Ativos', value: '24', icon: Users },
  { label: 'Treinos Criados', value: '58', icon: Dumbbell },
  { label: 'Evolução Média', value: '+12%', icon: TrendingUp },
];

export function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-500">Visão geral da sua base de alunos e treinos</p>
      </header>

      <section aria-label="Indicadores gerais" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATS.map(({ label, value, icon: Icon }) => (
          <article key={label} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Icon size={22} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-xl font-bold text-slate-800">{value}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
// src/pages/Dashboard.jsx
import { useMemo } from 'react';
import { Users, Dumbbell, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useStudents } from '../hooks/useStudents';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const STATUS_COLORS = {
  Ativo: '#10b981',
  Pausado: '#f59e0b',
};

export function Dashboard() {
  const { students, status } = useStudents();

  const activeCount = useMemo(() => students.filter((s) => s.status === 'Ativo').length, [students]);

  const goalDistribution = useMemo(() => {
    const counts = students.reduce((acc, student) => {
      acc[student.goal] = (acc[student.goal] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([goal, total]) => ({ goal, total }));
  }, [students]);

  const statusDistribution = useMemo(() => {
    const counts = students.reduce((acc, student) => {
      acc[student.status] = (acc[student.status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([statusLabel, total]) => ({ status: statusLabel, total }));
  }, [students]);

  const stats = [
    { label: 'Alunos Ativos', value: String(activeCount), icon: Users },
    { label: 'Total de Alunos', value: String(students.length), icon: Dumbbell },
    { label: 'Evolução Média', value: '—', icon: TrendingUp },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-500">Visão geral da sua base de alunos e treinos</p>
      </header>

      <section aria-label="Indicadores gerais" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
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

      {status === 'loading' && <LoadingSpinner label="Carregando dados dos alunos..." />}

      {status === 'success' && students.length === 0 && (
        <EmptyState
          icon={Users}
          title="Sem dados para exibir ainda"
          description="Cadastre seu primeiro aluno na tela de Alunos para ver os gráficos aqui."
        />
      )}

      {status === 'success' && students.length > 0 && (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <figure className="rounded-xl border border-slate-200 bg-white p-5">
            <figcaption className="mb-4 text-sm font-semibold text-slate-800">Alunos por Objetivo</figcaption>

            <div
              role="img"
              aria-label={`Gráfico de barras: ${goalDistribution
                .map((g) => `${g.goal}, ${g.total} aluno${g.total === 1 ? '' : 's'}`)
                .join('; ')}`}
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={goalDistribution} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="goal"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                    interval={0}
                    angle={-10}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: 8, borderColor: '#e2e8f0', fontSize: 13 }} />
                  <Bar dataKey="total" name="Alunos" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <table className="sr-only">
              <caption>Quantidade de alunos por objetivo</caption>
              <thead>
                <tr>
                  <th scope="col">Objetivo</th>
                  <th scope="col">Alunos</th>
                </tr>
              </thead>
              <tbody>
                {goalDistribution.map((row) => (
                  <tr key={row.goal}>
                    <td>{row.goal}</td>
                    <td>{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </figure>

          <figure className="rounded-xl border border-slate-200 bg-white p-5">
            <figcaption className="mb-4 text-sm font-semibold text-slate-800">Alunos por Status</figcaption>

            <div
              role="img"
              aria-label={`Gráfico de pizza: ${statusDistribution
                .map((s) => `${s.status}, ${s.total} aluno${s.total === 1 ? '' : 's'}`)
                .join('; ')}`}
            >
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={statusDistribution} dataKey="total" nameKey="status" innerRadius={60} outerRadius={90} paddingAngle={3}>
                    {statusDistribution.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, borderColor: '#e2e8f0', fontSize: 13 }} />
                  <Legend
                    verticalAlign="bottom"
                    height={32}
                    formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <table className="sr-only">
              <caption>Quantidade de alunos por status</caption>
              <thead>
                <tr>
                  <th scope="col">Status</th>
                  <th scope="col">Alunos</th>
                </tr>
              </thead>
              <tbody>
                {statusDistribution.map((row) => (
                  <tr key={row.status}>
                    <td>{row.status}</td>
                    <td>{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </figure>
        </section>
      )}
    </div>
  );
}
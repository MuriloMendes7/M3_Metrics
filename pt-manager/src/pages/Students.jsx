// src/pages/Students.jsx
import { useState } from 'react';
import { Search, UserPlus } from 'lucide-react';

const MOCK_STUDENTS = [
  { id: 1, name: 'Ana Souza', goal: 'Hipertrofia', status: 'Ativo' },
  { id: 2, name: 'Bruno Lima', goal: 'Emagrecimento', status: 'Ativo' },
  { id: 3, name: 'Carla Dias', goal: 'Recomposição Corporal', status: 'Pausado' },
];

export function Students() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = MOCK_STUDENTS.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Alunos</h2>
          <p className="text-sm text-slate-500">Gerencie sua base de alunos</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          <UserPlus size={16} aria-hidden="true" />
          Novo Aluno
        </button>
      </header>

      <form role="search" onSubmit={(e) => e.preventDefault()} className="max-w-sm">
        <label htmlFor="student-search" className="sr-only">
          Buscar aluno pelo nome
        </label>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            id="student-search"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar aluno..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Lista de alunos cadastrados</caption>
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Nome</th>
              <th scope="col" className="px-4 py-3 font-medium">Objetivo</th>
              <th scope="col" className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{student.name}</td>
                <td className="px-4 py-3 text-slate-600">{student.goal}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      student.status === 'Ativo' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                  Nenhum aluno encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// src/components/workout/StudentPicker.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, ArrowRight, UserPlus } from 'lucide-react';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';

export function StudentPicker({ students, status, error, onSelectStudent }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4">
      <header className="text-center">
        <h2 className="text-xl font-bold text-slate-800">Selecione o Aluno</h2>
        <p className="text-sm text-slate-500">Escolha para qual aluno você vai montar o treino</p>
      </header>

      {status === 'loading' && <LoadingSpinner label="Carregando alunos..." />}

      {status === 'error' && (
        <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {status === 'success' && students.length === 0 && (
        <>
          <EmptyState
            icon={UserPlus}
            title="Nenhum aluno cadastrado"
            description="Cadastre um aluno antes de montar um treino."
          />
          <Link
            to="/alunos"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Users size={16} aria-hidden="true" />
            Ir para Alunos
          </Link>
        </>
      )}

      {status === 'success' && students.length > 0 && (
        <>
          <form role="search" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="workout-student-search" className="sr-only">
              Buscar aluno pelo nome
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                id="workout-student-search"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar aluno..."
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </form>

          <ul className="flex flex-col divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white" aria-label="Lista de alunos">
            {filteredStudents.map((student) => (
              <li key={student.id}>
                <button
                  type="button"
                  onClick={() => onSelectStudent(student.id)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700">
                      {student.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.goal}</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="shrink-0 text-slate-400" aria-hidden="true" />
                </button>
              </li>
            ))}
            {filteredStudents.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-slate-500">
                Nenhum aluno encontrado para "{searchTerm}".
              </li>
            )}
          </ul>
        </>
      )}
    </div>
  );
}
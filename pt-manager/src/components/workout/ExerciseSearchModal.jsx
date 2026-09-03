// src/components/workout/ExerciseSearchModal.jsx
import { Search, Dumbbell, Plus } from 'lucide-react';
import { Modal } from '../common/Modal';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { useExerciseSearch } from '../../hooks/useExerciseSearch';

export function ExerciseSearchModal({ isOpen, onClose, onSelectExercise }) {
  const { query, setQuery, results, status, error, reset } = useExerciseSearch();

  function handleClose() {
    reset();
    onClose();
  }

  function handleSelect(exercise) {
    onSelectExercise(exercise);
    handleClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Buscar Exercício">
      <form role="search" onSubmit={(e) => e.preventDefault()} className="mb-4">
        <label htmlFor="exercise-search-input" className="sr-only">
          Buscar exercício por nome ou grupo muscular
        </label>
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="exercise-search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: supino, agachamento, remada..."
            autoComplete="off"
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
      </form>

      <div aria-live="polite" aria-atomic="true">
        {status === 'loading' && <LoadingSpinner label="Buscando exercícios..." />}

        {status === 'error' && (
          <div role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {status === 'idle' && query.trim().length < 2 && (
          <EmptyState
            icon={Dumbbell}
            title="Digite ao menos 2 caracteres"
            description="Busque por nome do exercício ou grupo muscular."
          />
        )}

        {status === 'success' && results.length === 0 && (
          <EmptyState icon={Dumbbell} title="Nenhum exercício encontrado" description="Tente outro termo de busca." />
        )}

        {status === 'success' && results.length > 0 && (
          <ul className="flex flex-col divide-y divide-slate-100" aria-label="Resultados da busca de exercícios">
            {results.map((exercise) => (
              <li key={exercise.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(exercise)}
                  className="flex w-full items-center justify-between gap-4 py-3 text-left transition hover:bg-slate-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{exercise.name}</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        {exercise.muscleGroup}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        {exercise.equipment}
                      </span>
                    </div>
                  </div>
                  <span
                    className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                    aria-hidden="true"
                  >
                    <Plus size={14} />
                    Adicionar
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}
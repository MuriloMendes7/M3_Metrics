// src/components/nutrition/FoodSearchModal.jsx
import { Search, AlertCircle, Plus } from 'lucide-react';
import { Modal } from '../common/Modal';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { useFoodSearch } from '../../hooks/useFoodSearch';

export function FoodSearchModal({ isOpen, onClose, onSelectFood }) {
  const { query, setQuery, results, status, error, reset } = useFoodSearch();

  function handleClose() {
    reset();
    onClose();
  }

  function handleSelect(food) {
    onSelectFood(food);
    handleClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Buscar Alimento">
      <form role="search" onSubmit={(e) => e.preventDefault()} className="mb-4">
        <label htmlFor="food-search-input" className="sr-only">
          Buscar alimento na base Open Food Facts
        </label>
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="food-search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: arroz integral, peito de frango..."
            autoComplete="off"
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
      </form>

      <div aria-live="polite" aria-atomic="true">
        {status === 'loading' && <LoadingSpinner label="Buscando alimentos..." />}

        {status === 'error' && (
          <div role="alert" className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={18} aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {status === 'idle' && query.trim().length < 2 && (
          <EmptyState
            icon={Search}
            title="Digite ao menos 2 caracteres"
            description="Busque por nome do alimento na base pública Open Food Facts."
          />
        )}

        {status === 'success' && results.length === 0 && (
          <EmptyState
            icon={Search}
            title="Nenhum alimento encontrado"
            description="Tente um termo diferente ou mais genérico."
          />
        )}

        {status === 'success' && results.length > 0 && (
          <ul className="flex flex-col divide-y divide-slate-100" aria-label="Resultados da busca de alimentos">
            {results.map((food) => (
              <li key={food.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(food)}
                  className="flex w-full items-center justify-between gap-4 py-3 text-left transition hover:bg-slate-50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{food.name}</p>
                    <p className="truncate text-xs text-slate-500">{food.brand}</p>
                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">
                      <span><strong className="font-semibold text-slate-800">{food.kcal ?? '—'}</strong> kcal</span>
                      <span><strong className="font-semibold text-slate-800">{food.protein ?? '—'}</strong>g proteína</span>
                      <span><strong className="font-semibold text-slate-800">{food.carbs ?? '—'}</strong>g carbo</span>
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
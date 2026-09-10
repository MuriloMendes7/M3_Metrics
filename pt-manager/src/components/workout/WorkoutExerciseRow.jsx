// src/components/workout/WorkoutExerciseRow.jsx
import { GripVertical, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

export function WorkoutExerciseRow({
  exercise,
  index,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
}) {
  function handleFieldChange(field, value) {
    const numericValue = value === '' ? '' : Math.max(0, Number(value));
    onUpdate(exercise.id, { ...exercise, [field]: numericValue });
  }

  return (
    <article
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      className={`flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 transition ${
        isDragging ? 'opacity-40' : 'opacity-100'
      }`}
      aria-label={`Exercício: ${exercise.name}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          <span
            aria-hidden="true"
            className="mt-0.5 hidden shrink-0 cursor-grab text-slate-400 hover:text-slate-600 md:block"
          >
            <GripVertical size={16} />
          </span>
          <div className="min-w-0">
            <p className="break-words text-sm font-semibold text-slate-800">{exercise.name}</p>
            <p className="break-words text-xs text-slate-500">
              {exercise.muscleGroup} · {exercise.equipment}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => onMoveUp(exercise.id)}
              disabled={isFirst}
              aria-label={`Mover ${exercise.name} para cima`}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronUp size={14} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onMoveDown(exercise.id)}
              disabled={isLast}
              aria-label={`Mover ${exercise.name} para baixo`}
              className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronDown size={14} aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onRemove(exercise.id)}
            aria-label={`Remover ${exercise.name} do treino`}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label htmlFor={`series-${exercise.id}`} className="sr-only">
            Séries de {exercise.name}
          </label>
          <input
            id={`series-${exercise.id}`}
            type="number"
            min="0"
            inputMode="numeric"
            value={exercise.sets}
            onChange={(e) => handleFieldChange('sets', e.target.value)}
            placeholder="Séries"
            className="w-full min-w-0 rounded-md border border-slate-300 px-2 py-1.5 text-center text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label htmlFor={`reps-${exercise.id}`} className="sr-only">
            Repetições de {exercise.name}
          </label>
          <input
            id={`reps-${exercise.id}`}
            type="number"
            min="0"
            inputMode="numeric"
            value={exercise.reps}
            onChange={(e) => handleFieldChange('reps', e.target.value)}
            placeholder="Reps"
            className="w-full min-w-0 rounded-md border border-slate-300 px-2 py-1.5 text-center text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label htmlFor={`load-${exercise.id}`} className="sr-only">
            Carga de {exercise.name} em quilogramas
          </label>
          <input
            id={`load-${exercise.id}`}
            type="number"
            min="0"
            step="0.5"
            inputMode="decimal"
            value={exercise.load}
            onChange={(e) => handleFieldChange('load', e.target.value)}
            placeholder="Kg"
            className="w-full min-w-0 rounded-md border border-slate-300 px-2 py-1.5 text-center text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>
    </article>
  );
}
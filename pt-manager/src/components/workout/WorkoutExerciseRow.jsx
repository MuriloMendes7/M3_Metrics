// src/components/workout/WorkoutExerciseRow.jsx
import { GripVertical, Trash2 } from 'lucide-react';

export function WorkoutExerciseRow({
  exercise,
  index,
  onUpdate,
  onRemove,
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
      className={`flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 transition sm:flex-row sm:items-center ${
        isDragging ? 'opacity-40' : 'opacity-100'
      }`}
      aria-label={`Exercício: ${exercise.name}`}
    >
      <button
        type="button"
        aria-label={`Reordenar ${exercise.name}`}
        className="hidden cursor-grab touch-none text-slate-400 hover:text-slate-600 sm:block"
      >
        <GripVertical size={18} aria-hidden="true" />
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">{exercise.name}</p>
        <p className="truncate text-xs text-slate-500">
          {exercise.muscleGroup} · {exercise.equipment}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:w-64">
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
            className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-center text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
            className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-center text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
            className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-center text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(exercise.id)}
        aria-label={`Remover ${exercise.name} do treino`}
        className="self-end rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 sm:self-center"
      >
        <Trash2 size={18} aria-hidden="true" />
      </button>
    </article>
  );
}
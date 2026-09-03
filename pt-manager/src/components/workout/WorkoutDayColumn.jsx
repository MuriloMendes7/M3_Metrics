// src/components/workout/WorkoutDayColumn.jsx
import { useState } from 'react';
import { Plus, Dumbbell } from 'lucide-react';
import { WorkoutExerciseRow } from './WorkoutExerciseRow';
import { EmptyState } from '../common/EmptyState';

export function WorkoutDayColumn({ day, exercises, onAddClick, onUpdateExercise, onRemoveExercise, onReorderExercises }) {
  const [draggedIndex, setDraggedIndex] = useState(null);

  function handleDragStart(event, index) {
    setDraggedIndex(index);
    event.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  function handleDrop(event, dropIndex) {
    event.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }
    onReorderExercises(day.id, draggedIndex, dropIndex);
    setDraggedIndex(null);
  }

  return (
    <section
      aria-labelledby={`day-heading-${day.id}`}
      className="flex w-full flex-shrink-0 flex-col rounded-xl border border-slate-200 bg-slate-50 sm:w-80"
    >
      <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h3 id={`day-heading-${day.id}`} className="font-semibold text-slate-800">
          {day.label}
        </h3>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500">
          {exercises.length} {exercises.length === 1 ? 'exercício' : 'exercícios'}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-2 p-3">
        {exercises.length === 0 ? (
          <EmptyState icon={Dumbbell} title="Nenhum exercício" description="Adicione exercícios a este treino." />
        ) : (
          exercises.map((exercise, index) => (
            <WorkoutExerciseRow
              key={exercise.id}
              exercise={exercise}
              index={index}
              onUpdate={(id, updated) => onUpdateExercise(day.id, id, updated)}
              onRemove={(id) => onRemoveExercise(day.id, id)}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              isDragging={draggedIndex === index}
            />
          ))
        )}

        <button
          type="button"
          onClick={() => onAddClick(day.id)}
          className="mt-1 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 py-3 text-sm font-medium text-slate-500 transition hover:border-emerald-400 hover:text-emerald-600"
        >
          <Plus size={16} aria-hidden="true" />
          Adicionar exercício
        </button>
      </div>
    </section>
  );
}
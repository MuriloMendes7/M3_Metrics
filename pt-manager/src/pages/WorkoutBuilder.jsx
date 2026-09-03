// src/pages/WorkoutBuilder.jsx
import { useState, useCallback } from 'react';
import { WorkoutDayColumn } from '../components/workout/WorkoutDayColumn';
import { ExerciseSearchModal } from '../components/workout/ExerciseSearchModal';

const INITIAL_DAYS = [
  { id: 'day-a', label: 'Treino A' },
  { id: 'day-b', label: 'Treino B' },
  { id: 'day-c', label: 'Treino C' },
  { id: 'day-d', label: 'Treino D' },
];

function createEmptyWorkoutState() {
  return INITIAL_DAYS.reduce((acc, day) => {
    acc[day.id] = [];
    return acc;
  }, {});
}

export function WorkoutBuilder() {
  const [workoutByDay, setWorkoutByDay] = useState(createEmptyWorkoutState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDayId, setActiveDayId] = useState(null);

  const handleOpenModal = useCallback((dayId) => {
    setActiveDayId(dayId);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setActiveDayId(null);
  }, []);

  const handleSelectExercise = useCallback(
    (exercise) => {
      if (!activeDayId) return;

      const newWorkoutExercise = {
        id: crypto.randomUUID(),
        exerciseId: exercise.id,
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        equipment: exercise.equipment,
        sets: 3,
        reps: 12,
        load: 0,
      };

      setWorkoutByDay((prev) => ({
        ...prev,
        [activeDayId]: [...prev[activeDayId], newWorkoutExercise],
      }));
    },
    [activeDayId]
  );

  const handleUpdateExercise = useCallback((dayId, exerciseId, updatedExercise) => {
    setWorkoutByDay((prev) => ({
      ...prev,
      [dayId]: prev[dayId].map((ex) => (ex.id === exerciseId ? updatedExercise : ex)),
    }));
  }, []);

  const handleRemoveExercise = useCallback((dayId, exerciseId) => {
    setWorkoutByDay((prev) => ({
      ...prev,
      [dayId]: prev[dayId].filter((ex) => ex.id !== exerciseId),
    }));
  }, []);

  const handleReorderExercises = useCallback((dayId, fromIndex, toIndex) => {
    setWorkoutByDay((prev) => {
      const dayExercises = [...prev[dayId]];
      const [movedExercise] = dayExercises.splice(fromIndex, 1);
      dayExercises.splice(toIndex, 0, movedExercise);
      return { ...prev, [dayId]: dayExercises };
    });
  }, []);

  const totalExercises = Object.values(workoutByDay).reduce((sum, list) => sum + list.length, 0);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Construtor de Treinos</h2>
          <p className="text-sm text-slate-500">
            {totalExercises} {totalExercises === 1 ? 'exercício planejado' : 'exercícios planejados'} nesta rotina
          </p>
        </div>
      </header>

      <div className="flex gap-4 overflow-x-auto pb-4" role="group" aria-label="Dias de treino da semana">
        {INITIAL_DAYS.map((day) => (
          <WorkoutDayColumn
            key={day.id}
            day={day}
            exercises={workoutByDay[day.id]}
            onAddClick={handleOpenModal}
            onUpdateExercise={handleUpdateExercise}
            onRemoveExercise={handleRemoveExercise}
            onReorderExercises={handleReorderExercises}
          />
        ))}
      </div>

      <ExerciseSearchModal isOpen={isModalOpen} onClose={handleCloseModal} onSelectExercise={handleSelectExercise} />
    </div>
  );
}
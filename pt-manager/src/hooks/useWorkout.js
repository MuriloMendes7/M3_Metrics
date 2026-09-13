// src/hooks/useWorkout.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { getWorkout, saveWorkout } from '../services/workoutService';

export const WORKOUT_DAYS = [
  { id: 'day-a', label: 'Treino A' },
  { id: 'day-b', label: 'Treino B' },
  { id: 'day-c', label: 'Treino C' },
  { id: 'day-d', label: 'Treino D' },
];

function createEmptyWorkoutState() {
  return WORKOUT_DAYS.reduce((acc, day) => {
    acc[day.id] = [];
    return acc;
  }, {});
}

export function useWorkout(studentId) {
  const { trainer } = useAuth();
  const [workoutByDay, setWorkoutByDay] = useState(createEmptyWorkoutState);
  const [status, setStatus] = useState('loading');
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    let isCancelled = false;
    isFirstLoadRef.current = true;

    async function loadWorkout() {
      if (!trainer || !studentId) {
        setWorkoutByDay(createEmptyWorkoutState());
        setStatus('success');
        return;
      }

      setStatus('loading');
      const data = await getWorkout(trainer.id, studentId, WORKOUT_DAYS);

      if (!isCancelled) {
        setWorkoutByDay(data);
        setStatus('success');
        isFirstLoadRef.current = false;
      }
    }

    loadWorkout();

    return () => {
      isCancelled = true;
    };
  }, [trainer, studentId]);

  useEffect(() => {
    if (isFirstLoadRef.current || !trainer || !studentId) return;
    saveWorkout(trainer.id, studentId, workoutByDay);
  }, [workoutByDay, trainer, studentId]);

  const addExercise = useCallback((dayId, exercise) => {
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
      [dayId]: [...prev[dayId], newWorkoutExercise],
    }));
  }, []);

  const updateExercise = useCallback((dayId, exerciseId, updatedExercise) => {
    setWorkoutByDay((prev) => ({
      ...prev,
      [dayId]: prev[dayId].map((ex) => (ex.id === exerciseId ? updatedExercise : ex)),
    }));
  }, []);

  const removeExercise = useCallback((dayId, exerciseId) => {
    setWorkoutByDay((prev) => ({
      ...prev,
      [dayId]: prev[dayId].filter((ex) => ex.id !== exerciseId),
    }));
  }, []);

  const reorderExercises = useCallback((dayId, fromIndex, toIndex) => {
    setWorkoutByDay((prev) => {
      const dayExercises = [...prev[dayId]];
      const [movedExercise] = dayExercises.splice(fromIndex, 1);
      dayExercises.splice(toIndex, 0, movedExercise);
      return { ...prev, [dayId]: dayExercises };
    });
  }, []);

  return {
    workoutByDay,
    status,
    days: WORKOUT_DAYS,
    addExercise,
    updateExercise,
    removeExercise,
    reorderExercises,
  };
}
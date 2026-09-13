// src/services/workoutService.js
const STORAGE_KEY = 'pt_manager_workouts';

function getAllWorkouts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveAllWorkouts(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function buildKey(trainerId, studentId) {
  return `${trainerId}:${studentId}`;
}

export async function getWorkout(trainerId, studentId, days) {
  const allWorkouts = getAllWorkouts();
  const key = buildKey(trainerId, studentId);
  const stored = allWorkouts[key];

  if (stored) return stored;

  return days.reduce((acc, day) => {
    acc[day.id] = [];
    return acc;
  }, {});
}

export async function saveWorkout(trainerId, studentId, workoutByDay) {
  const allWorkouts = getAllWorkouts();
  const key = buildKey(trainerId, studentId);
  allWorkouts[key] = workoutByDay;
  saveAllWorkouts(allWorkouts);
  return workoutByDay;
}
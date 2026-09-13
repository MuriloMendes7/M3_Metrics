// src/pages/WorkoutBuilder.jsx
import { useState, useCallback, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useStudents } from '../hooks/useStudents';
import { useWorkout } from '../hooks/useWorkout';
import { StudentPicker } from '../components/workout/StudentPicker';
import { WorkoutDayColumn } from '../components/workout/WorkoutDayColumn';
import { ExerciseSearchModal } from '../components/workout/ExerciseSearchModal';

export function WorkoutBuilder() {
  const { students, status: studentsStatus, error: studentsError } = useStudents();
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const {
    workoutByDay,
    status: workoutStatus,
    days,
    addExercise,
    updateExercise,
    removeExercise,
    reorderExercises,
  } = useWorkout(selectedStudentId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDayId, setActiveDayId] = useState(null);

  const selectedStudent = useMemo(
    () => students.find((student) => student.id === selectedStudentId) || null,
    [students, selectedStudentId]
  );

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
      addExercise(activeDayId, exercise);
    },
    [activeDayId, addExercise]
  );

  const handleChangeStudent = useCallback(() => {
    setSelectedStudentId(null);
  }, []);

  if (!selectedStudentId) {
    return (
      <StudentPicker
        students={students}
        status={studentsStatus}
        error={studentsError}
        onSelectStudent={setSelectedStudentId}
      />
    );
  }

  const totalExercises = Object.values(workoutByDay).reduce((sum, list) => sum + list.length, 0);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleChangeStudent}
          aria-label="Trocar aluno"
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Treino de {selectedStudent?.name || 'Aluno'}
          </h2>
          <p className="text-sm text-slate-500">
            {totalExercises} {totalExercises === 1 ? 'exercício planejado' : 'exercícios planejados'} nesta rotina
          </p>
        </div>
      </header>

      {workoutStatus === 'loading' ? (
        <p className="text-sm text-slate-500">Carregando treino...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2" role="group" aria-label="Dias de treino da semana">
          {days.map((day) => (
            <WorkoutDayColumn
              key={day.id}
              day={day}
              exercises={workoutByDay[day.id] || []}
              onAddClick={handleOpenModal}
              onUpdateExercise={(dayId, id, updated) => updateExercise(dayId, id, updated)}
              onRemoveExercise={(dayId, id) => removeExercise(dayId, id)}
              onReorderExercises={(dayId, from, to) => reorderExercises(dayId, from, to)}
            />
          ))}
        </div>
      )}

      <ExerciseSearchModal isOpen={isModalOpen} onClose={handleCloseModal} onSelectExercise={handleSelectExercise} />
    </div>
  );
}
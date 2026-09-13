// src/hooks/useStudents.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getStudents, createStudent } from '../services/studentService';

export function useStudents() {
  const { trainer } = useAuth();
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [error, setError] = useState(null);

  const loadStudents = useCallback(async () => {
    if (!trainer) {
      setStudents([]);
      setStatus('success');
      return;
    }

    setStatus('loading');
    setError(null);
    try {
      const data = await getStudents(trainer.id);
      setStudents(data);
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Erro ao carregar alunos.');
      setStatus('error');
    }
  }, [trainer]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  const addStudent = useCallback(
    async (studentData) => {
      if (!trainer) throw new Error('Sessão inválida.');
      const newStudent = await createStudent(trainer.id, studentData);
      setStudents((prev) => [...prev, newStudent]);
      return newStudent;
    },
    [trainer]
  );

  return { students, status, error, addStudent, refetch: loadStudents };
}
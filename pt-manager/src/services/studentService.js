// src/services/studentService.js
const STORAGE_KEY = 'pt_manager_students';

function getAllStudentsByTrainer() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveAllStudentsByTrainer(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export async function getStudents(trainerId) {
  const allData = getAllStudentsByTrainer();
  return allData[trainerId] || [];
}

export async function createStudent(trainerId, { name, email, goal }) {
  if (!name || !name.trim()) {
    throw new Error('O nome do aluno é obrigatório.');
  }

  const allData = getAllStudentsByTrainer();
  const trainerStudents = allData[trainerId] || [];

  const newStudent = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email?.trim() || '',
    goal: goal || 'Não definido',
    status: 'Ativo',
    createdAt: new Date().toISOString(),
  };

  allData[trainerId] = [...trainerStudents, newStudent];
  saveAllStudentsByTrainer(allData);

  return newStudent;
}
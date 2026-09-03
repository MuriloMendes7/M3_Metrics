// src/services/wgerService.js
const WGER_BASE_URL = 'https://wger.de/api/v2';

const MOCK_EXERCISES = [
  { id: 'mock-1', name: 'Supino Reto com Barra', muscleGroup: 'Peito', equipment: 'Barra' },
  { id: 'mock-2', name: 'Agachamento Livre', muscleGroup: 'Pernas', equipment: 'Barra' },
  { id: 'mock-3', name: 'Puxada Frontal', muscleGroup: 'Costas', equipment: 'Máquina de Cabo' },
  { id: 'mock-4', name: 'Desenvolvimento Militar', muscleGroup: 'Ombros', equipment: 'Halteres' },
  { id: 'mock-5', name: 'Rosca Direta', muscleGroup: 'Bíceps', equipment: 'Barra W' },
  { id: 'mock-6', name: 'Tríceps Corda', muscleGroup: 'Tríceps', equipment: 'Máquina de Cabo' },
  { id: 'mock-7', name: 'Levantamento Terra', muscleGroup: 'Posterior de Coxa', equipment: 'Barra' },
  { id: 'mock-8', name: 'Elevação Lateral', muscleGroup: 'Ombros', equipment: 'Halteres' },
  { id: 'mock-9', name: 'Cadeira Extensora', muscleGroup: 'Quadríceps', equipment: 'Máquina' },
  { id: 'mock-10', name: 'Mesa Flexora', muscleGroup: 'Posterior de Coxa', equipment: 'Máquina' },
  { id: 'mock-11', name: 'Remada Curvada', muscleGroup: 'Costas', equipment: 'Barra' },
  { id: 'mock-12', name: 'Abdominal Supra', muscleGroup: 'Abdômen', equipment: 'Peso Corporal' },
];

export async function searchExercises(query) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    term: query.trim(),
    language: 'portuguese',
    format: 'json',
  });

  try {
    const response = await fetch(`${WGER_BASE_URL}/exercise/search/?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Wger API respondeu com status ${response.status}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.suggestions) || data.suggestions.length === 0) {
      return filterMockExercises(query);
    }

    return data.suggestions.map((item) => normalizeWgerSuggestion(item));
  } catch (err) {
    return filterMockExercises(query);
  }
}

function normalizeWgerSuggestion(item) {
  const details = item.data || {};
  return {
    id: item.value ? `${item.value}-${details.base_id || Math.random()}` : crypto.randomUUID(),
    name: item.value || 'Exercício sem nome',
    muscleGroup: details.category || 'Não informado',
    equipment: Array.isArray(details.equipment) ? details.equipment.join(', ') : 'Não informado',
  };
}

function filterMockExercises(query) {
  const normalizedQuery = query.trim().toLowerCase();
  return MOCK_EXERCISES.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(normalizedQuery) ||
      exercise.muscleGroup.toLowerCase().includes(normalizedQuery)
  );
}
// src/pages/Diet.jsx
import { useState, useCallback } from 'react';
import { Plus, Trash2, Apple } from 'lucide-react';
import { FoodSearchModal } from '../components/nutrition/FoodSearchModal';
import { EmptyState } from '../components/common/EmptyState';

const MEALS = [
  { id: 'meal-1', label: 'Café da Manhã' },
  { id: 'meal-2', label: 'Almoço' },
  { id: 'meal-3', label: 'Lanche da Tarde' },
  { id: 'meal-4', label: 'Jantar' },
];

function createEmptyMealState() {
  return MEALS.reduce((acc, meal) => {
    acc[meal.id] = [];
    return acc;
  }, {});
}

export function Diet() {
  const [foodsByMeal, setFoodsByMeal] = useState(createEmptyMealState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMealId, setActiveMealId] = useState(null);

  const handleOpenModal = useCallback((mealId) => {
    setActiveMealId(mealId);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setActiveMealId(null);
  }, []);

  const handleSelectFood = useCallback(
    (food) => {
      if (!activeMealId) return;
      setFoodsByMeal((prev) => ({
        ...prev,
        [activeMealId]: [...prev[activeMealId], { ...food, entryId: crypto.randomUUID() }],
      }));
    },
    [activeMealId]
  );

  const handleRemoveFood = useCallback((mealId, entryId) => {
    setFoodsByMeal((prev) => ({
      ...prev,
      [mealId]: prev[mealId].filter((food) => food.entryId !== entryId),
    }));
  }, []);

  const dailyTotals = Object.values(foodsByMeal)
    .flat()
    .reduce(
      (totals, food) => ({
        kcal: totals.kcal + (food.kcal || 0),
        protein: totals.protein + (food.protein || 0),
        carbs: totals.carbs + (food.carbs || 0),
      }),
      { kcal: 0, protein: 0, carbs: 0 }
    );

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Plano Alimentar</h2>
          <p className="text-sm text-slate-500">Monte as refeições do aluno consultando a base Open Food Facts</p>
        </div>
        <dl className="flex gap-4 rounded-lg bg-white px-4 py-2 text-sm shadow-sm">
          <div className="text-center">
            <dt className="text-xs text-slate-500">Kcal</dt>
            <dd className="font-semibold text-slate-800">{Math.round(dailyTotals.kcal)}</dd>
          </div>
          <div className="text-center">
            <dt className="text-xs text-slate-500">Proteína</dt>
            <dd className="font-semibold text-slate-800">{Math.round(dailyTotals.protein)}g</dd>
          </div>
          <div className="text-center">
            <dt className="text-xs text-slate-500">Carbo</dt>
            <dd className="font-semibold text-slate-800">{Math.round(dailyTotals.carbs)}g</dd>
          </div>
        </dl>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {MEALS.map((meal) => (
          <section
            key={meal.id}
            aria-labelledby={`meal-heading-${meal.id}`}
            className="flex flex-col rounded-xl border border-slate-200 bg-slate-50"
          >
            <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h3 id={`meal-heading-${meal.id}`} className="font-semibold text-slate-800">
                {meal.label}
              </h3>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500">
                {foodsByMeal[meal.id].length} itens
              </span>
            </header>

            <div className="flex flex-col gap-2 p-3">
              {foodsByMeal[meal.id].length === 0 ? (
                <EmptyState icon={Apple} title="Nenhum alimento" description="Adicione alimentos a esta refeição." />
              ) : (
                foodsByMeal[meal.id].map((food) => (
                  <article
                    key={food.entryId}
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">{food.name}</p>
                      <p className="text-xs text-slate-500">
                        {food.kcal ?? '—'} kcal · {food.protein ?? '—'}g prot · {food.carbs ?? '—'}g carbo
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFood(meal.id, food.entryId)}
                      aria-label={`Remover ${food.name} de ${meal.label}`}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </article>
                ))
              )}

              <button
                type="button"
                onClick={() => handleOpenModal(meal.id)}
                className="mt-1 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 py-2.5 text-sm font-medium text-slate-500 transition hover:border-emerald-400 hover:text-emerald-600"
              >
                <Plus size={16} aria-hidden="true" />
                Adicionar alimento
              </button>
            </div>
          </section>
        ))}
      </div>

      <FoodSearchModal isOpen={isModalOpen} onClose={handleCloseModal} onSelectFood={handleSelectFood} />
    </div>
  );
}
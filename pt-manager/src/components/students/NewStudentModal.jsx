// src/components/students/NewStudentModal.jsx
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';

const GOAL_OPTIONS = ['Hipertrofia', 'Emagrecimento', 'Recomposição Corporal', 'Performance', 'Condicionamento Físico'];

export function NewStudentModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [goal, setGoal] = useState(GOAL_OPTIONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function resetForm() {
    setName('');
    setEmail('');
    setGoal(GOAL_OPTIONS[0]);
    setError(null);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('O nome do aluno é obrigatório.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreate({ name, email, goal });
      handleClose();
    } catch (err) {
      setError(err.message || 'Não foi possível cadastrar o aluno.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Novo Aluno">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div aria-live="assertive" aria-atomic="true">
          {error && (
            <div role="alert" className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertCircle size={16} aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="new-student-name" className="mb-1 block text-sm font-medium text-slate-700">
            Nome completo
          </label>
          <input
            id="new-student-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do aluno"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        <div>
          <label htmlFor="new-student-email" className="mb-1 block text-sm font-medium text-slate-700">
            E-mail <span className="font-normal text-slate-400">(opcional)</span>
          </label>
          <input
            id="new-student-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="aluno@exemplo.com"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        <div>
          <label htmlFor="new-student-goal" className="mb-1 block text-sm font-medium text-slate-700">
            Objetivo
          </label>
          <select
            id="new-student-goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            {GOAL_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar aluno'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
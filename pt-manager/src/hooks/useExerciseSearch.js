// src/hooks/useExerciseSearch.js
import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import { searchExercises } from '../services/wgerService';

export function useExerciseSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setResults([]);
      setStatus('idle');
      setError(null);
      return;
    }

    let isCancelled = false;

    async function runSearch() {
      setStatus('loading');
      setError(null);

      try {
        const exercises = await searchExercises(debouncedQuery);
        if (!isCancelled) {
          setResults(exercises);
          setStatus('success');
        }
      } catch (err) {
        if (!isCancelled) {
          setError('Erro ao buscar exercícios. Tente novamente.');
          setStatus('error');
        }
      }
    }

    runSearch();

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery]);

  const reset = useCallback(() => {
    setQuery('');
    setResults([]);
    setStatus('idle');
    setError(null);
  }, []);

  return { query, setQuery, results, status, error, reset };
}
// src/hooks/useFoodSearch.js
import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import { searchFoods } from '../services/openFoodFactsService';

export function useFoodSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState(null);

  const debouncedQuery = useDebounce(query, 500);

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
        const products = await searchFoods(debouncedQuery);
        if (!isCancelled) {
          setResults(products);
          setStatus('success');
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'Erro ao buscar alimentos. Tente novamente.');
          setStatus('error');
          setResults([]);
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
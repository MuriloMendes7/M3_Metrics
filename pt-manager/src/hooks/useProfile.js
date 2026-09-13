// src/hooks/useProfile.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getProfile, saveProfile } from '../services/profileService';

export function useProfile() {
  const { trainer } = useAuth();
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      if (!trainer) {
        setProfile(null);
        setStatus('success');
        return;
      }

      setStatus('loading');
      const data = await getProfile(trainer.id);
      if (!isCancelled) {
        setProfile(data);
        setStatus('success');
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [trainer]);

  const updateProfile = useCallback(
    async (partialData) => {
      if (!trainer) throw new Error('Sessão inválida.');
      const updated = await saveProfile(trainer.id, partialData);
      setProfile(updated);
      return updated;
    },
    [trainer]
  );

  return { profile, status, updateProfile };
}
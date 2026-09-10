// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from 'react';
import { loginTrainer, registerTrainer, logoutTrainer, getSession } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [trainer, setTrainer] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    setTrainer(getSession());
    setIsCheckingSession(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const loggedTrainer = await loginTrainer({ email, password });
    setTrainer(loggedTrainer);
    return loggedTrainer;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const newTrainer = await registerTrainer({ name, email, password });
    setTrainer(newTrainer);
    return newTrainer;
  }, []);

  const logout = useCallback(() => {
    logoutTrainer();
    setTrainer(null);
  }, []);

  const value = {
    trainer,
    isAuthenticated: Boolean(trainer),
    isCheckingSession,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}